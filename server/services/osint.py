import os
import requests
import json
import time
import whois
import dns.resolver
from urllib.parse import urlparse
import tldextract
from datetime import datetime, timedelta
import hashlib

class OSINTAnalyzer:
    def __init__(self):
        self.virustotal_api_key = os.getenv('VIRUSTOTAL_API_KEY')
        self.urlscan_api_key = os.getenv('URLSCAN_API_KEY')
        self.gsb_api_key = os.getenv('GSB_API_KEY')
        self.timeout = 30
        
    def analyze_url(self, url):
        """Main analysis function that coordinates all OSINT sources"""
        start_time = time.time()
        
        # Normalize URL
        normalized_url = self._normalize_url(url)
        domain = tldextract.extract(normalized_url).registered_domain
        
        results = {
            'normalizedUrl': normalized_url,
            'domain': domain,
            'sources': {},
            'timestamp': datetime.now().isoformat()
        }
        
        # Run all OSINT checks in parallel (simplified sequential for now)
        results['sources']['whoisRdap'] = self._check_whois_rdap(domain)
        results['sources']['virustotal'] = self._check_virustotal(normalized_url)
        results['sources']['urlscan'] = self._check_urlscan(normalized_url)
        results['sources']['googleSafeBrowsing'] = self._check_google_safe_browsing(normalized_url)
        results['sources']['certificateTransparency'] = self._check_certificate_transparency(domain)
        results['sources']['dnsAnalysis'] = self._check_dns_analysis(domain)
        
        results['analysisTime'] = round((time.time() - start_time) * 1000)  # in milliseconds
        
        return results
    
    def _normalize_url(self, url):
        """Ensure URL has proper protocol"""
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        return url
    
    def _check_whois_rdap(self, domain):
        """Check WHOIS/RDAP information"""
        try:
            w = whois.whois(domain)
            
            # Calculate domain age
            creation_date = w.creation_date
            if isinstance(creation_date, list):
                creation_date = creation_date[0]
            
            # Handle expiration date (might be a list)
            expiration_date = w.expiration_date
            if isinstance(expiration_date, list):
                expiration_date = expiration_date[0]
            
            age_days = (datetime.now() - creation_date).days if creation_date else 0
            
            return {
                'status': 'success',
                'data': {
                    'domain': domain,
                    'registrar': str(w.registrar) if w.registrar else 'Unknown',
                    'creation_date': creation_date.isoformat() if creation_date else None,
                    'expiration_date': expiration_date.isoformat() if expiration_date else None,
                    'age_days': age_days,
                    'name_servers': w.name_servers if w.name_servers else [],
                    'status': w.status if w.status else [],
                    'privacy_protected': bool(w.registrant_name and 'privacy' in str(w.registrant_name).lower())
                }
            }
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e)
            }
    
    def _check_virustotal(self, url):
        """Check VirusTotal URL analysis"""
        if not self.virustotal_api_key:
            return {'status': 'error', 'error': 'VirusTotal API key not configured'}
        
        try:
            # Get URL ID
            url_id = hashlib.sha256(url.encode()).hexdigest()
            
            headers = {'x-apikey': self.virustotal_api_key}
            response = requests.get(
                f'https://www.virustotal.com/api/v3/urls/{url_id}',
                headers=headers,
                timeout=self.timeout
            )
            
            if response.status_code == 404:
                # Submit URL for analysis
                submit_response = requests.post(
                    'https://www.virustotal.com/api/v3/urls',
                    headers=headers,
                    data={'url': url},
                    timeout=self.timeout
                )
                
                if submit_response.status_code == 200:
                    return {
                        'status': 'success',
                        'data': {
                            'submitted': True,
                            'message': 'URL submitted for analysis',
                            'positives': 0,
                            'total': 0
                        }
                    }
            
            if response.status_code == 200:
                data = response.json()
                stats = data['data']['attributes']['last_analysis_stats']
                
                return {
                    'status': 'success',
                    'data': {
                        'positives': stats.get('malicious', 0),
                        'total': sum(stats.values()),
                        'scan_date': data['data']['attributes']['last_analysis_date'],
                        'permalink': f"https://www.virustotal.com/gui/url/{url_id}",
                        'stats': stats
                    }
                }
            
            return {'status': 'error', 'error': f'VirusTotal API error: {response.status_code}'}
            
        except requests.Timeout:
            return {'status': 'timeout', 'error': 'VirusTotal request timeout'}
        except Exception as e:
            return {'status': 'error', 'error': str(e)}
    
    def _check_urlscan(self, url):
        """Check URLScan.io analysis"""
        if not self.urlscan_api_key:
            return {'status': 'error', 'error': 'URLScan API key not configured'}
        
        try:
            headers = {
                'API-Key': self.urlscan_api_key,
                'Content-Type': 'application/json'
            }
            
            # URLScan requires specific payload format
            payload = {
                'url': url,
                'visibility': 'public',
                'tags': ['phishing', 'security']
            }
            
            # Submit URL for scanning
            submit_response = requests.post(
                'https://urlscan.io/api/v1/scan/',
                headers=headers,
                json=payload,
                timeout=self.timeout
            )
            
            if submit_response.status_code == 200:
                scan_data = submit_response.json()
                scan_id = scan_data['uuid']
                
                # Wait a bit for scan to complete
                time.sleep(10)
                
                # Get results
                result_response = requests.get(
                    f'https://urlscan.io/api/v1/result/{scan_id}/',
                    timeout=self.timeout
                )
                
                if result_response.status_code == 200:
                    result_data = result_response.json()
                    
                    return {
                        'status': 'success',
                        'data': {
                            'scan_id': scan_id,
                            'url': result_data['page']['url'],
                            'domain': result_data['page']['domain'],
                            'screenshot': result_data['screenshot'],
                            'malicious': result_data['verdicts']['overall']['malicious'],
                            'suspicious': result_data['verdicts']['overall']['suspicious'],
                            'technologies': result_data['lists'].get('urls', [])[:5]  # First 5 technologies
                        }
                    }
                else:
                    return {
                        'status': 'success',
                        'data': {
                            'scan_id': scan_id,
                            'message': 'Scan in progress',
                            'status': 'pending'
                        }
                    }
            else:
                # Get the error details
                try:
                    error_data = submit_response.json()
                    error_message = error_data.get('message', 'Unknown error')
                    
                    # Check if it's a blocked URL error - show as success with friendly message
                    if any(phrase in error_message.lower() for phrase in [
                        'blocked from scanning', 
                        "don't be silly", 
                        'not allowed',
                        'restricted',
                        'forbidden',
                        'scan prevented',
                        'cannot be scanned',
                        'invalid url',
                        'unsupported'
                    ]):
                        return {
                            'status': 'success',
                            'data': {
                                'message': error_message,
                                'reason': 'This URL cannot be scanned by URLScan.io',
                                'scan_id': None,
                                'status': 'blocked',
                                'malicious': False,
                                'suspicious': False,
                                'technologies': []
                            }
                        }
                    else:
                        # For any 400 error, treat it as potentially blocked
                        if submit_response.status_code == 400:
                            return {
                                'status': 'success',
                                'data': {
                                    'message': error_message,
                                    'reason': 'This URL cannot be scanned by URLScan.io',
                                    'scan_id': None,
                                    'status': 'blocked',
                                    'malicious': False,
                                    'suspicious': False,
                                    'technologies': []
                                }
                            }
                        else:
                            return {'status': 'error', 'error': f'URLScan submission failed: {submit_response.status_code} - {error_message}'}
                except:
                    error_details = submit_response.text
                    return {'status': 'error', 'error': f'URLScan submission failed: {submit_response.status_code} - {error_details}'}
            
        except requests.Timeout:
            return {'status': 'timeout', 'error': 'URLScan request timeout'}
        except Exception as e:
            return {'status': 'error', 'error': str(e)}
    
    def _check_google_safe_browsing(self, url):
        """Check Google Safe Browsing API"""
        if not self.gsb_api_key:
            return {'status': 'error', 'error': 'Google Safe Browsing API key not configured'}
        
        try:
            api_url = f'https://safebrowsing.googleapis.com/v4/threatMatches:find?key={self.gsb_api_key}'
            
            payload = {
                'client': {
                    'clientId': 'phisheye',
                    'clientVersion': '1.0'
                },
                'threatInfo': {
                    'threatTypes': [
                        'MALWARE',
                        'SOCIAL_ENGINEERING',
                        'UNWANTED_SOFTWARE',
                        'POTENTIALLY_HARMFUL_APPLICATION'
                    ],
                    'platformTypes': ['ANY_PLATFORM'],
                    'threatEntryTypes': ['URL'],
                    'threatEntries': [{'url': url}]
                }
            }
            
            response = requests.post(api_url, json=payload, timeout=self.timeout)
            
            if response.status_code == 200:
                data = response.json()
                threats = data.get('matches', [])
                
                return {
                    'status': 'success',
                    'data': {
                        'threats_found': len(threats) > 0,
                        'threat_types': [match['threatType'] for match in threats],
                        'threat_count': len(threats)
                    }
                }
            
            return {'status': 'error', 'error': f'GSB API error: {response.status_code}'}
            
        except requests.Timeout:
            return {'status': 'timeout', 'error': 'Google Safe Browsing timeout'}
        except Exception as e:
            return {'status': 'error', 'error': str(e)}
    
    def _check_certificate_transparency(self, domain):
        """Check Certificate Transparency logs"""
        try:
            response = requests.get(
                f'https://crt.sh/?q={domain}&output=json',
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                certs = response.json()
                
                # Analyze certificate patterns
                recent_certs = [
                    cert for cert in certs 
                    if datetime.fromisoformat(cert['not_before'].replace('T', ' ')) > datetime.now() - timedelta(days=7)
                ]
                
                return {
                    'status': 'success',
                    'data': {
                        'total_certificates': len(certs),
                        'recent_certificates': len(recent_certs),
                        'certificate_churn': len(recent_certs) >= 3,  # 3+ certs in 7 days
                        'issuers': list(set([cert['issuer_name'] for cert in certs[-10:]])),  # Last 10 issuers
                        'latest_cert': certs[0] if certs else None
                    }
                }
            
            return {'status': 'error', 'error': f'Certificate Transparency API error: {response.status_code}'}
            
        except requests.Timeout:
            return {'status': 'timeout', 'error': 'Certificate Transparency timeout'}
        except Exception as e:
            return {'status': 'error', 'error': str(e)}
    
    def _check_dns_analysis(self, domain):
        """Check DNS records and security configurations"""
        try:
            dns_data = {
                'a_records': [],
                'mx_records': [],
                'txt_records': [],
                'ns_records': [],
                'has_spf': False,
                'has_dmarc': False
            }
            
            # A records
            try:
                a_records = dns.resolver.resolve(domain, 'A')
                dns_data['a_records'] = [str(record) for record in a_records]
            except:
                pass
            
            # MX records
            try:
                mx_records = dns.resolver.resolve(domain, 'MX')
                dns_data['mx_records'] = [str(record) for record in mx_records]
            except:
                pass
            
            # TXT records (for SPF/DMARC)
            try:
                txt_records = dns.resolver.resolve(domain, 'TXT')
                for record in txt_records:
                    txt_str = str(record).strip('"')
                    dns_data['txt_records'].append(txt_str)
                    if txt_str.startswith('v=spf'):
                        dns_data['has_spf'] = True
                    elif txt_str.startswith('v=DMARC'):
                        dns_data['has_dmarc'] = True
            except:
                pass
            
            # NS records
            try:
                ns_records = dns.resolver.resolve(domain, 'NS')
                dns_data['ns_records'] = [str(record) for record in ns_records]
            except:
                pass
            
            return {
                'status': 'success',
                'data': dns_data
            }
            
        except Exception as e:
            return {'status': 'error', 'error': str(e)}
