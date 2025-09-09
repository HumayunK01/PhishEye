// Risk calculation utilities and constants

export interface RiskFactor {
  id: string;
  name: string;
  description: string;
  points: number;
  category: 'risk' | 'trust';
}

export const RISK_FACTORS: RiskFactor[] = [
  {
    id: 'domain_nonexistent',
    name: 'Domain Does Not Exist',
    description: 'Domain not found in WHOIS database',
    points: 30,
    category: 'risk'
  },
  {
    id: 'dns_resolution_failed',
    name: 'DNS Resolution Failed',
    description: 'Domain cannot be resolved to an IP address',
    points: 25,
    category: 'risk'
  },
  {
    id: 'no_a_records',
    name: 'No A Records',
    description: 'Domain has no A records (no IP address)',
    points: 20,
    category: 'risk'
  },
  {
    id: 'suspicious_pattern_nonexistent',
    name: 'Suspicious Pattern (Non-existent)',
    description: 'Suspicious domain pattern for non-existent domain',
    points: 40,
    category: 'risk'
  },
  {
    id: 'no_ssl_certificates',
    name: 'No SSL Certificates',
    description: 'No SSL certificates found for domain',
    points: 10,
    category: 'risk'
  },
  {
    id: 'domain_age_young',
    name: 'Young Domain',
    description: 'Domain registered less than 30 days ago',
    points: 20,
    category: 'risk'
  },
  {
    id: 'gsb_threat',
    name: 'Google Safe Browsing Threat',
    description: 'URL flagged by Google Safe Browsing',
    points: 35,
    category: 'risk'
  },
  {
    id: 'virustotal_detections',
    name: 'Antivirus Detections',
    description: 'One or more antivirus engines detected threats',
    points: 25,
    category: 'risk'
  },
  {
    id: 'virustotal_multiple',
    name: 'Multiple AV Detections',
    description: 'Five or more antivirus engines detected threats',
    points: 5,
    category: 'risk'
  },
  {
    id: 'urlscan_suspicious',
    name: 'Suspicious Web Technologies',
    description: 'URLScan detected suspicious indicators',
    points: 10,
    category: 'risk'
  },
  {
    id: 'dns_security_missing',
    name: 'Missing DNS Security',
    description: 'Missing SPF or DMARC records',
    points: 5,
    category: 'risk'
  },
  {
    id: 'cert_churn',
    name: 'Certificate Churn',
    description: 'Multiple certificates issued in short timeframe',
    points: 5,
    category: 'risk'
  },
  {
    id: 'privacy_protection',
    name: 'Privacy Protection Issues',
    description: 'Domain privacy protection with unusual status',
    points: 5,
    category: 'risk'
  },
  {
    id: 'typosquatting',
    name: 'Typosquatting Pattern',
    description: 'Domain appears to mimic known brands',
    points: 10,
    category: 'risk'
  }
];

export const TRUST_SIGNALS: RiskFactor[] = [
  {
    id: 'domain_age_established',
    name: 'Established Domain',
    description: 'Domain age over 1 year with clean signals',
    points: -10,
    category: 'trust'
  },
  {
    id: 'valid_certificate',
    name: 'Valid SSL Certificate',
    description: 'Valid DV/OV/EV certificate from trusted authority',
    points: -5,
    category: 'trust'
  },
  {
    id: 'complete_dns_security',
    name: 'Complete DNS Security',
    description: 'Proper SPF, DMARC, and security records configured',
    points: -3,
    category: 'trust'
  }
];

export interface RiskCalculationResult {
  score: number;
  verdict: 'Safe' | 'Warning' | 'High Risk';
  appliedFactors: {
    factor: RiskFactor;
    reason: string;
  }[];
}

export function calculateRiskScore(
  factors: { id: string; reason: string }[]
): RiskCalculationResult {
  let score = 0;
  const appliedFactors: { factor: RiskFactor; reason: string }[] = [];

  // Find all risk factors and trust signals
  const allFactors = [...RISK_FACTORS, ...TRUST_SIGNALS];

  // Apply each factor
  factors.forEach(({ id, reason }) => {
    const factor = allFactors.find(f => f.id === id);
    if (factor) {
      score += factor.points;
      appliedFactors.push({ factor, reason });
    }
  });

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  // Determine verdict
  let verdict: 'Safe' | 'Warning' | 'High Risk';
  if (score <= 24) {
    verdict = 'Safe';
  } else if (score <= 59) {
    verdict = 'Warning';
  } else {
    verdict = 'High Risk';
  }

  return {
    score,
    verdict,
    appliedFactors
  };
}

export function getVerdictColor(verdict: string): string {
  switch (verdict) {
    case 'Safe': return 'success';
    case 'Warning': return 'warning';
    case 'High Risk': return 'destructive';
    default: return 'secondary';
  }
}

export function getScoreLabel(score: number): string {
  if (score <= 24) return 'Safe';
  if (score <= 59) return 'Warning';
  return 'High Risk';
}

export function getScoreDescription(score: number): string {
  if (score <= 24) {
    return 'This URL appears to be safe based on the analysis of multiple security sources.';
  } else if (score <= 59) {
    return 'This URL shows some warning signs and should be approached with caution.';
  } else {
    return 'This URL shows significant risk indicators and should be avoided.';
  }
}

// Known brand domains for typosquatting detection
export const KNOWN_BRANDS = [
  'google', 'facebook', 'amazon', 'microsoft', 'apple', 'paypal',
  'ebay', 'netflix', 'linkedin', 'twitter', 'instagram', 'youtube',
  'github', 'stackoverflow', 'reddit', 'wikipedia', 'banking',
  'wells', 'chase', 'bankofamerica', 'citibank', 'visa', 'mastercard'
];

export function detectTyposquatting(domain: string): boolean {
  if (!domain) return false;
  
  const domainLower = domain.toLowerCase();
  
  return KNOWN_BRANDS.some(brand => {
    if (domainLower === brand) return false; // Exact match is not typosquatting
    
    // Check for common typosquatting patterns
    return (
      domainLower.includes(brand) && 
      (
        domainLower.length - brand.length <= 3 || // Similar length
        domainLower.includes('-') || // Hyphenated variations
        domainLower.includes('0') || domainLower.includes('1') || // Number substitutions
        domainLower.startsWith(brand) || domainLower.endsWith(brand) // Prefix/suffix
      )
    );
  });
}

export function detectSuspiciousDomainPattern(domain: string): boolean {
  if (!domain) return false;
  
  const domainLower = domain.toLowerCase();
  
  // Check for brand impersonation patterns
  const suspiciousPatterns = [
    // Security/verification patterns
    /.*security.*verification.*/,
    /.*account.*update.*/,
    /.*urgent.*action.*/,
    /.*suspicious.*activity.*/,
    /.*verify.*identity.*/,
    /.*immediate.*action.*/,
    /.*account.*suspended.*/,
    /.*password.*reset.*/,
    /.*login.*required.*/,
    /.*verification.*required.*/,
    
    // Brand + action patterns
    /paypal.*security.*/,
    /amazon.*account.*/,
    /apple.*id.*/,
    /microsoft.*security.*/,
    /google.*account.*/,
    /facebook.*security.*/,
    /bank.*security.*/,
    /visa.*verification.*/,
    /mastercard.*security.*/,
    
    // Suspicious TLD patterns
    /.*\.tk$/,
    /.*\.ml$/,
    /.*\.ga$/,
    /.*\.cf$/,
    /.*\.click$/,
    /.*\.download$/,
    /.*\.online$/,
    /.*\.site$/,
    /.*\.website$/,
    /.*\.top$/,
    /.*\.xyz$/,
  ];
  
  // Check against patterns
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(domainLower)) {
      return true;
    }
  }
  
  // Check for excessive hyphens (common in phishing domains)
  if (domainLower.split('-').length >= 4) {
    return true;
  }
  
  // Check for number substitutions in brand names
  for (const brand of KNOWN_BRANDS) {
    if (domainLower.includes(brand)) {
      // Check for common number substitutions
      if (/[0-9]/.test(domainLower)) {
        return true;
      }
    }
  }
  
  return false;
}

export function formatRiskReasons(reasons: string[]): string[] {
  return reasons.map(reason => {
    // Clean up and format risk reasoning text
    return reason
      .replace(/^\s*[+-]?\d+\s*points?\s*:?\s*/i, '') // Remove point indicators
      .replace(/\s*\([+-]?\d+\s*points?\)/i, '') // Remove point parentheses
      .trim();
  });
}
