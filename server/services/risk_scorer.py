from datetime import datetime, timedelta
import re

class RiskScorer:
    def __init__(self):
        # Known brand domains for typosquatting detection
        self.known_brands = [
            'google', 'facebook', 'amazon', 'microsoft', 'apple', 'paypal',
            'ebay', 'netflix', 'linkedin', 'twitter', 'instagram', 'youtube',
            'github', 'stackoverflow', 'reddit', 'wikipedia', 'banking',
            'wells', 'chase', 'bankofamerica', 'citibank'
        ]
    
    def calculate_risk_score(self, analysis_data):
        """Calculate risk score based on OSINT analysis results"""
        score = 0
        reasons = []
        
        # Extract sources data
        sources = analysis_data.get('sources', {})
        domain = analysis_data.get('domain', '')
        
        # WHOIS/RDAP Analysis
        whois_data = sources.get('whoisRdap', {}).get('data', {})
        if whois_data:
            score_delta, whois_reasons = self._analyze_whois_risk(whois_data)
            score += score_delta
            reasons.extend(whois_reasons)
        
        # VirusTotal Analysis
        vt_data = sources.get('virustotal', {}).get('data', {})
        if vt_data:
            score_delta, vt_reasons = self._analyze_virustotal_risk(vt_data)
            score += score_delta
            reasons.extend(vt_reasons)
        
        # URLScan Analysis
        urlscan_data = sources.get('urlscan', {}).get('data', {})
        if urlscan_data:
            score_delta, urlscan_reasons = self._analyze_urlscan_risk(urlscan_data)
            score += score_delta
            reasons.extend(urlscan_reasons)
        
        # Google Safe Browsing Analysis
        gsb_data = sources.get('googleSafeBrowsing', {}).get('data', {})
        if gsb_data:
            score_delta, gsb_reasons = self._analyze_gsb_risk(gsb_data)
            score += score_delta
            reasons.extend(gsb_reasons)
        
        # Certificate Transparency Analysis
        ct_data = sources.get('certificateTransparency', {}).get('data', {})
        if ct_data:
            score_delta, ct_reasons = self._analyze_certificate_risk(ct_data)
            score += score_delta
            reasons.extend(ct_reasons)
        
        # DNS Analysis
        dns_data = sources.get('dnsAnalysis', {}).get('data', {})
        if dns_data:
            score_delta, dns_reasons = self._analyze_dns_risk(dns_data)
            score += score_delta
            reasons.extend(dns_reasons)
        
        # Typosquatting Analysis
        typo_score, typo_reasons = self._analyze_typosquatting(domain)
        score += typo_score
        reasons.extend(typo_reasons)
        
        # Ensure score is within bounds
        score = max(0, min(100, score))
        
        # Determine verdict
        if score <= 24:
            verdict = "Safe"
        elif score <= 59:
            verdict = "Warning"
        else:
            verdict = "High Risk"
        
        return score, verdict, reasons
    
    def _analyze_whois_risk(self, whois_data):
        """Analyze WHOIS data for risk factors"""
        score = 0
        reasons = []
        
        # Domain age analysis
        age_days = whois_data.get('age_days', 0)
        if age_days < 30:
            score += 20
            reasons.append(f"Domain registered only {age_days} days ago (+20 points)")
        elif age_days >= 365:
            score -= 10
            reasons.append(f"Domain age over 1 year indicates established presence (-10 points)")
        
        # Privacy protection + unusual status
        if whois_data.get('privacy_protected', False):
            status_list = whois_data.get('status', [])
            if any('unusual' in str(status).lower() or 'hold' in str(status).lower() for status in status_list):
                score += 5
                reasons.append("Domain privacy protection with unusual status (+5 points)")
        
        return score, reasons
    
    def _analyze_virustotal_risk(self, vt_data):
        """Analyze VirusTotal results for risk factors"""
        score = 0
        reasons = []
        
        positives = vt_data.get('positives', 0)
        total = vt_data.get('total', 1)
        
        if positives >= 1:
            score += 25
            reasons.append(f"VirusTotal detected threats: {positives}/{total} engines (+25 points)")
            
            if positives >= 5:
                score += 5
                reasons.append(f"Multiple engines detected threats (+5 points)")
        elif total > 0 and positives == 0:
            reasons.append("VirusTotal scan clean - no threats detected")
        
        return score, reasons
    
    def _analyze_urlscan_risk(self, urlscan_data):
        """Analyze URLScan.io results for risk factors"""
        score = 0
        reasons = []
        
        if urlscan_data.get('malicious', False):
            score += 15
            reasons.append("URLScan.io flagged as malicious (+15 points)")
        
        if urlscan_data.get('suspicious', False):
            score += 10
            reasons.append("URLScan.io flagged as suspicious (+10 points)")
        
        # Check for suspicious indicators (simplified)
        technologies = urlscan_data.get('technologies', [])
        suspicious_indicators = ['data:', 'javascript:', 'mixed-content']
        
        for tech in technologies:
            if any(indicator in str(tech).lower() for indicator in suspicious_indicators):
                score += 10
                reasons.append("Suspicious web technologies detected (+10 points)")
                break
        
        return score, reasons
    
    def _analyze_gsb_risk(self, gsb_data):
        """Analyze Google Safe Browsing results"""
        score = 0
        reasons = []
        
        if gsb_data.get('threats_found', False):
            score += 35
            threat_types = gsb_data.get('threat_types', [])
            reasons.append(f"Google Safe Browsing threat detected: {', '.join(threat_types)} (+35 points)")
        else:
            reasons.append("Google Safe Browsing - no threats detected")
        
        return score, reasons
    
    def _analyze_certificate_risk(self, ct_data):
        """Analyze Certificate Transparency data"""
        score = 0
        reasons = []
        
        # Certificate churn detection
        if ct_data.get('certificate_churn', False):
            score += 5
            recent_count = ct_data.get('recent_certificates', 0)
            reasons.append(f"Suspicious certificate activity: {recent_count} certificates in 7 days (+5 points)")
        
        # Valid certificate trust signal
        if ct_data.get('total_certificates', 0) > 0:
            score -= 5
            reasons.append("Valid SSL certificate from trusted authority (-5 points)")
        
        return score, reasons
    
    def _analyze_dns_risk(self, dns_data):
        """Analyze DNS configuration for risk factors"""
        score = 0
        reasons = []
        
        # Missing SPF/DMARC (email security)
        if not dns_data.get('has_spf', False) or not dns_data.get('has_dmarc', False):
            score += 5
            missing = []
            if not dns_data.get('has_spf', False):
                missing.append('SPF')
            if not dns_data.get('has_dmarc', False):
                missing.append('DMARC')
            reasons.append(f"Missing email security records: {'/'.join(missing)} (+5 points)")
        
        return score, reasons
    
    def _analyze_typosquatting(self, domain):
        """Check for potential typosquatting patterns"""
        score = 0
        reasons = []
        
        if not domain:
            return score, reasons
        
        domain_lower = domain.lower()
        
        # Simple brand similarity check
        for brand in self.known_brands:
            if brand in domain_lower and domain_lower != brand:
                # Check for common typosquatting patterns
                if (len(domain_lower) - len(brand) <= 3 or  # Similar length
                    any(char in domain_lower for char in ['-', '0', '1']) or  # Common substitutions
                    domain_lower.startswith(brand) or domain_lower.endswith(brand)):
                    
                    score += 10
                    reasons.append(f"Potential typosquatting of '{brand}' brand detected (+10 points)")
                    break
        
        return score, reasons
