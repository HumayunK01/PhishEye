import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, Shield, Info, Mail, ExternalLink } from "lucide-react";
import { useLocation } from "wouter";

export default function Disclaimer() {
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
              <AlertTriangle className="w-10 h-10 text-warning" />
              Disclaimer
            </h1>
            <p className="text-muted-foreground text-lg">
              Important information about the limitations of our service
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
          {/* General Disclaimer */}
          <Card className="border-warning/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle className="w-5 h-5" />
                General Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The information provided by PhishEye ("we," "us," or "our") on our website and 
                through our security analysis service is for general informational purposes only. 
                All information on the service is provided in good faith, however we make no 
                representation or warranty of any kind, express or implied, regarding the accuracy, 
                adequacy, validity, reliability, availability, or completeness of any information 
                on the service.
              </p>
              <p>
                <strong>Under no circumstance shall we have any liability to you for any loss or 
                damage of any kind incurred as a result of the use of the service or reliance on 
                any information provided on the service.</strong>
              </p>
            </CardContent>
          </Card>

          {/* Analysis Results Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Analysis Results Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The security analysis results provided by PhishEye are based on publicly available 
                information and third-party data sources. These results should be considered as 
                <strong> informational only</strong> and not as definitive security assessments.
              </p>
              
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <h3 className="font-semibold text-destructive mb-2">Important Limitations:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                  <li>Analysis results may contain false positives or false negatives</li>
                  <li>Threat intelligence data may be outdated or incomplete</li>
                  <li>Some threats may not be detected by available sources</li>
                  <li>Analysis is based on automated tools and may miss human-context threats</li>
                  <li>Results should not be the sole basis for security decisions</li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground">
                We strongly recommend consulting with qualified cybersecurity professionals for 
                critical security assessments and decisions.
              </p>
            </CardContent>
          </Card>

          {/* Third-Party Data Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Third-Party Data Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                PhishEye relies on various third-party data sources and APIs for analysis. We 
                cannot guarantee the accuracy, completeness, or timeliness of information from 
                these sources:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Data Sources Used:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>VirusTotal API</li>
                    <li>URLScan.io</li>
                    <li>Google Safe Browsing</li>
                    <li>WHOIS/RDAP services</li>
                    <li>Certificate Transparency logs</li>
                    <li>DNS analysis tools</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Potential Issues:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>API rate limits and availability</li>
                    <li>Data source accuracy variations</li>
                    <li>Service outages or downtime</li>
                    <li>Changes in data source policies</li>
                    <li>Geographic data restrictions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Advice Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Advice Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The information provided by PhishEye does not constitute professional cybersecurity 
                advice, legal advice, or any other type of professional advice. You should not 
                rely solely on this information for making security decisions.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  When to Seek Professional Help:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>Critical security incidents or breaches</li>
                  <li>Compliance with industry regulations</li>
                  <li>Legal requirements for security assessments</li>
                  <li>Complex threat analysis and response planning</li>
                  <li>Integration with enterprise security systems</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* External Links Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-primary" />
                External Links Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our service may contain links to external websites that are not provided or 
                maintained by or in any way affiliated with PhishEye. Please note that we do 
                not guarantee the accuracy, relevance, timeliness, or completeness of any 
                information on these external websites.
              </p>
              <p>
                We are not responsible for the content, privacy policies, or practices of any 
                third-party websites or services that you may access through our service.
              </p>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                In no event shall PhishEye, its officers, directors, employees, or agents be 
                liable to you for any direct, indirect, incidental, special, punitive, or 
                consequential damages whatsoever resulting from any:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Errors, mistakes, or inaccuracies of content</li>
                <li>Personal injury or property damage resulting from your access to and use of our service</li>
                <li>Any unauthorized access to or use of our secure servers and/or any personal information stored therein</li>
                <li>Any interruption or cessation of transmission to or from our service</li>
                <li>Any bugs, viruses, trojan horses, or the like which may be transmitted to or through our service</li>
                <li>Any loss or damage of any kind incurred as a result of your use of any content posted, emailed, transmitted, or otherwise made available through the service</li>
              </ul>
            </CardContent>
          </Card>

          {/* Accuracy of Information */}
          <Card>
            <CardHeader>
              <CardTitle>Accuracy of Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                While we have made every attempt to ensure that the information contained in 
                this service has been obtained from reliable sources, PhishEye is not responsible 
                for any errors or omissions or for the results obtained from the use of this 
                information.
              </p>
              <p>
                All information in this service is provided "as is," with no guarantee of 
                completeness, accuracy, timeliness, or of the results obtained from the use of 
                this information, and without warranty of any kind, express or implied, including, 
                but not limited to warranties of performance, merchantability, and fitness for a 
                particular purpose.
              </p>
            </CardContent>
          </Card>

          {/* Updates to Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle>Updates to This Disclaimer</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We reserve the right to update this disclaimer at any time without notice. 
                By using our service, you acknowledge that it is your responsibility to review 
                this disclaimer periodically for changes.
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
                If you have any questions about this disclaimer, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> humayunk.pvt@gmail.com</p>
                <p><strong>Website:</strong> https://devhumayun.me</p>
                <p><strong>Address:</strong> Mumbai, India</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
