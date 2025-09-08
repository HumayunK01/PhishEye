import { motion } from "framer-motion";
import { Link } from "wouter";
import { ShieldCheck, Github, Twitter, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Analyzer", href: "/analyzer" },
      { name: "History", href: "/history" },
      { name: "Documentation", href: "/documentation" },
      { name: "Settings", href: "/settings" },
    ],
    resources: [
      { name: "API Documentation", href: "/documentation#api", external: true },
      { name: "Security Guide", href: "/documentation#security", external: true },
      { name: "Best Practices", href: "/documentation#best-practices", external: true },
      { name: "Troubleshooting", href: "/documentation#troubleshooting", external: true },
    ],
    support: [
      { name: "GitHub Issues", href: "https://github.com/your-org/phish-eye/issues", external: true },
      { name: "Contact Support", href: "mailto:support@phish-eye.com", external: true },
      { name: "Feature Requests", href: "https://github.com/your-org/phish-eye/discussions", external: true },
      { name: "Bug Reports", href: "https://github.com/your-org/phish-eye/issues/new", external: true },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy", external: false },
      { name: "Terms of Service", href: "/terms", external: false },
      { name: "Cookie Policy", href: "/cookies", external: false },
      { name: "Disclaimer", href: "/disclaimer", external: false },
    ]
  };

  const socialLinks = [
    { name: "GitHub", href: "https://github.com/your-org/phish-eye", icon: Github },
    { name: "Twitter", href: "https://twitter.com/phish-eye", icon: Twitter },
    { name: "Email", href: "mailto:contact@phish-eye.com", icon: Mail },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <Link href="/" className="flex items-center space-x-3 group">
                  <motion.div 
                    className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ShieldCheck className="w-5 h-5 text-primary-foreground" />
                  </motion.div>
                  <span className="text-xl font-bold group-hover:text-primary transition-colors">
                    PhishEye
                  </span>
                </Link>
                
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                  Advanced OSINT-based security analysis platform for real-time scam and phishing 
                  website detection. Protect yourself and your organization with comprehensive 
                  threat intelligence.
                </p>

                {/* Social Links */}
                <div className="flex items-center space-x-4">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title={social.name}
                      >
                        <IconComponent className="w-5 h-5" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Product Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-sm font-semibold text-foreground mb-4">Product</h3>
                <ul className="space-y-3">
                  {footerLinks.product.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Resources Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-sm font-semibold text-foreground mb-4">Resources</h3>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                      >
                        {link.name}
                        {link.external && <ExternalLink className="w-3 h-3" />}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Support Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-sm font-semibold text-foreground mb-4">Support</h3>
                <ul className="space-y-3">
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                      >
                        {link.name}
                        {link.external && <ExternalLink className="w-3 h-3" />}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Legal Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      {link.external ? (
                        <a 
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.name}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <Link 
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-6 border-t border-border/50"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <p>&copy; {currentYear} PhishEye. All rights reserved.</p>
              <span className="hidden sm:inline">•</span>
              <p>Built with ❤️ for cybersecurity</p>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                All systems operational
              </span>
              <span>Version 1.0.0</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
