import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, AlertTriangle, Shield, Users, Gavel, Mail } from "lucide-react";
import { useLocation } from "wouter";

export default function TermsOfService() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <FileText className="w-10 h-10 text-primary" />
              Terms of Service
            </h1>
            <p className="text-muted-foreground text-lg">
              Terms and conditions for using PhishEye
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {/* Acceptance of Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-primary" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                By accessing and using PhishEye ("the Service"), you accept and agree to be bound by 
                the terms and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
              <p>
                These Terms of Service ("Terms") govern your use of our web-based security analysis 
                platform operated by PhishEye ("us", "we", or "our").
              </p>
            </CardContent>
          </Card>

          {/* Description of Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Description of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                PhishEye is a security analysis platform that provides:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>URL security analysis using multiple OSINT sources</li>
                <li>Threat detection and risk assessment</li>
                <li>Analysis reports and recommendations</li>
                <li>Historical analysis tracking</li>
                <li>PDF report generation</li>
              </ul>
              <p>
                The service is provided "as is" and we make no warranties about the accuracy, 
                reliability, or completeness of the analysis results.
              </p>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                User Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>As a user of PhishEye, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Use the service only for legitimate security analysis purposes</li>
                <li>Not submit malicious or harmful URLs for analysis</li>
                <li>Respect the intellectual property rights of others</li>
                <li>Not attempt to reverse engineer or compromise the service</li>
                <li>Not use the service for any illegal or unauthorized purpose</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </CardContent>
          </Card>

          {/* Prohibited Uses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Prohibited Uses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You may not use PhishEye:</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                <li>For any obscene or immoral purpose</li>
              </ul>
            </CardContent>
          </Card>

          {/* Service Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Service Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We strive to maintain high service availability, but we do not guarantee that the 
                service will be available at all times. We may experience downtime due to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Scheduled maintenance</li>
                <li>Technical issues or bugs</li>
                <li>Third-party service outages</li>
                <li>Force majeure events</li>
              </ul>
              <p>
                We reserve the right to modify, suspend, or discontinue the service at any time 
                without notice.
              </p>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The service and its original content, features, and functionality are and will remain 
                the exclusive property of PhishEye and its licensors. The service is protected by 
                copyright, trademark, and other laws.
              </p>
              <p>
                Our trademarks and trade dress may not be used in connection with any product or 
                service without our prior written consent.
              </p>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                In no event shall PhishEye, nor its directors, employees, partners, agents, suppliers, 
                or affiliates, be liable for any indirect, incidental, special, consequential, or 
                punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                or other intangible losses, resulting from your use of the service.
              </p>
              <p>
                The analysis results provided by PhishEye are for informational purposes only and 
                should not be the sole basis for security decisions. We recommend consulting with 
                security professionals for critical security assessments.
              </p>
            </CardContent>
          </Card>

          {/* Indemnification */}
          <Card>
            <CardHeader>
              <CardTitle>Indemnification</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                You agree to defend, indemnify, and hold harmless PhishEye and its licensee and 
                licensors, and their employees, contractors, agents, officers and directors, from 
                and against any and all claims, damages, obligations, losses, liabilities, costs or 
                debt, and expenses (including but not limited to attorney's fees).
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We may terminate or suspend your access immediately, without prior notice or liability, 
                for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p>
                Upon termination, your right to use the service will cease immediately. All provisions 
                of the Terms which by their nature should survive termination shall survive termination.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any 
                time. If a revision is material, we will try to provide at least 30 days notice prior 
                to any new terms taking effect.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> legal@phish-eye.com</p>
                <p><strong>Website:</strong> https://phish-eye.com</p>
                <p><strong>Address:</strong> [Your Company Address]</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
