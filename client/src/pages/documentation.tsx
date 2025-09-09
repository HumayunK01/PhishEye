import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Database, ShieldCheck, AlertTriangle, ExternalLink } from "lucide-react";

export default function DocumentationPage() {
  const osintSources = [
    {
      name: "VirusTotal",
      icon: "🛡️",
      description: "Multi-engine malware detection service that analyzes URLs using 80+ antivirus engines and security tools.",
      url: "https://virustotal.com"
    },
    {
      name: "Google Safe Browsing",
      icon: "🔍",
      description: "Google's threat intelligence service that identifies malicious URLs, phishing sites, and malware.",
      url: "https://safebrowsing.google.com"
    },
    {
      name: "URLScan.io",
      icon: "👁️",
      description: "Automated website scanner that analyzes page behavior, technologies, and potential threats.",
      url: "https://urlscan.io"
    },
    {
      name: "Certificate Transparency",
      icon: "🔐",
      description: "Public logs of SSL/TLS certificates that help detect suspicious certificate patterns and domain activity.",
      url: "https://crt.sh"
    },
    {
      name: "WHOIS/RDAP",
      icon: "ℹ️",
      description: "Domain registration information including age, registrar, and privacy settings.",
      url: "https://rdap.org"
    },
    {
      name: "DNS Analysis",
      icon: "🖥️",
      description: "DNS record analysis including security configurations like SPF, DMARC, and infrastructure patterns.",
      url: "https://cloudflare-dns.com"
    }
  ];

  const riskFactors = [
    { factor: "Domain age < 30 days", points: "+20", type: "risk" },
    { factor: "Google Safe Browsing threat match", points: "+35", type: "risk" },
    { factor: "VirusTotal detections ≥ 1", points: "+25", type: "risk" },
    { factor: "URLScan suspicious indicators", points: "+10", type: "risk" },
    { factor: "Typosquatting pattern detected", points: "+10", type: "risk" },
    { factor: "Missing SPF/DMARC records", points: "+5", type: "risk" },
    { factor: "Certificate churn (≥3 in 7 days)", points: "+5", type: "risk" },
    { factor: "Privacy protection + unusual status", points: "+5", type: "risk" },
  ];

  const trustSignals = [
    { factor: "Domain age ≥ 1 year + clean signals", points: "-10", type: "trust" },
    { factor: "Valid DV/OV/EV certificate", points: "-5", type: "trust" },
    { factor: "Complete DNS security records", points: "-3", type: "trust" },
  ];

  const privacyPoints = [
    "All data is stored locally in your browser only",
    "No server-side logging or data persistence",
    "API keys are secured server-side using Replit Secrets",
    "URLs are analyzed through secure proxy endpoints"
  ];

  const limitations = [
    "Results are for informational purposes only and should not be the sole basis for security decisions",
    "False positives and negatives are possible with any automated analysis",
    "API rate limits may affect analysis completeness during high usage",
    "Some sources may require additional verification for suspicious sites"
  ];

  return (
    <section className="min-h-screen py-20" data-testid="documentation-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 motion-safe"
        >
          <h2 className="text-3xl font-bold mb-4">Documentation</h2>
          <p className="text-muted-foreground">
            Learn how our OSINT-based threat detection works and how to interpret the results.
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Risk Scoring Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Risk Scoring Algorithm
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  Our risk scoring system uses a transparent, deterministic algorithm that combines signals from multiple OSINT sources. 
                  The score ranges from 0 (safe) to 100 (high risk).
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-destructive flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Risk Factors (+Points)
                    </h4>
                    <div className="space-y-3">
                      {riskFactors.map((factor, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.05 }}
                          className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg"
                        >
                          <span className="text-sm">{factor.factor}</span>
                          <Badge variant="destructive">{factor.points}</Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-success flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Trust Signals (-Points)
                    </h4>
                    <div className="space-y-3">
                      {trustSignals.map((signal, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.05 }}
                          className="flex justify-between items-center p-3 bg-success/10 rounded-lg"
                        >
                          <span className="text-sm">{signal.factor}</span>
                          <Badge className="bg-success text-success-foreground">{signal.points}</Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                  <h5 className="font-semibold mb-2">Risk Level Classifications:</h5>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-success/20 rounded-lg">
                      <div className="font-bold text-success">0-24</div>
                      <div className="text-sm">Safe</div>
                    </div>
                    <div className="p-3 bg-warning/20 rounded-lg">
                      <div className="font-bold text-warning">25-59</div>
                      <div className="text-sm">Warning</div>
                    </div>
                    <div className="p-3 bg-destructive/20 rounded-lg">
                      <div className="font-bold text-destructive">60-100</div>
                      <div className="text-sm">High Risk</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* OSINT Sources Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  OSINT Sources
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {osintSources.map((source, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="p-4 bg-accent/5 rounded-lg hover:bg-accent/10 transition-colors"
                    >
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="text-lg">{source.icon}</span>
                        {source.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {source.description}
                      </p>
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                        data-testid={`link-${source.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {source.url} <ExternalLink className="w-3 h-3" />
                      </a>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy & Limitations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Privacy & Limitations
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-success">Privacy Protection</h4>
                    <ul className="space-y-2">
                      {privacyPoints.map((point, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <ShieldCheck className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          {point}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-warning">Important Limitations</h4>
                    <ul className="space-y-2">
                      {limitations.map((limitation, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                          {limitation}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
