import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cookie, Settings, BarChart, Shield, Mail } from "lucide-react";
import { useLocation } from "wouter";

export default function CookiePolicy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <Cookie className="w-10 h-10 text-primary" />
              Cookie Policy
            </h1>
            <p className="text-muted-foreground text-lg">
              How we use cookies and similar technologies
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
          {/* What Are Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="w-5 h-5 text-primary" />
                What Are Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Cookies are small text files that are placed on your computer or mobile device when 
                you visit a website. They are widely used to make websites work more efficiently and 
                to provide information to website owners.
              </p>
              <p>
                PhishEye uses cookies and similar technologies to enhance your experience, analyze 
                usage patterns, and improve our service functionality.
              </p>
            </CardContent>
          </Card>

          {/* Types of Cookies We Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Types of Cookies We Use
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Essential Cookies */}
              <div>
                <h3 className="font-semibold mb-3 text-green-600">Essential Cookies</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  These cookies are necessary for the website to function properly and cannot be disabled.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Authentication and session management</li>
                  <li>Security and fraud prevention</li>
                  <li>Load balancing and performance</li>
                  <li>User preferences and settings</li>
                </ul>
              </div>

              {/* Analytics Cookies */}
              <div>
                <h3 className="font-semibold mb-3 text-blue-600">Analytics Cookies</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  These cookies help us understand how visitors interact with our website.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Page views and navigation patterns</li>
                  <li>Feature usage and performance metrics</li>
                  <li>Error tracking and debugging</li>
                  <li>User journey analysis</li>
                </ul>
              </div>

              {/* Functional Cookies */}
              <div>
                <h3 className="font-semibold mb-3 text-purple-600">Functional Cookies</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  These cookies enable enhanced functionality and personalization.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Theme preferences (light/dark mode)</li>
                  <li>Language and region settings</li>
                  <li>Analysis history and saved reports</li>
                  <li>Custom dashboard configurations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Cookie Details Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-primary" />
                Cookie Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Cookie Name</th>
                      <th className="text-left py-2 px-3">Purpose</th>
                      <th className="text-left py-2 px-3">Duration</th>
                      <th className="text-left py-2 px-3">Type</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b">
                      <td className="py-2 px-3 font-mono">phishEye_session</td>
                      <td className="py-2 px-3">Maintains user session</td>
                      <td className="py-2 px-3">24 hours</td>
                      <td className="py-2 px-3">Essential</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-mono">phishEye_theme</td>
                      <td className="py-2 px-3">Stores theme preference</td>
                      <td className="py-2 px-3">1 year</td>
                      <td className="py-2 px-3">Functional</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-mono">phishEye_settings</td>
                      <td className="py-2 px-3">User preferences and settings</td>
                      <td className="py-2 px-3">1 year</td>
                      <td className="py-2 px-3">Functional</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-mono">phishEye_analytics</td>
                      <td className="py-2 px-3">Usage analytics and performance</td>
                      <td className="py-2 px-3">30 days</td>
                      <td className="py-2 px-3">Analytics</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono">phishEye_history</td>
                      <td className="py-2 px-3">Analysis history storage</td>
                      <td className="py-2 px-3">90 days</td>
                      <td className="py-2 px-3">Functional</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We may use third-party services that set their own cookies. These include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li><strong>VirusTotal API:</strong> Security analysis and threat detection</li>
                <li><strong>URLScan.io:</strong> Behavioral analysis and website scanning</li>
                <li><strong>Google Safe Browsing:</strong> Phishing and malware detection</li>
                <li><strong>Analytics Services:</strong> Website usage and performance monitoring</li>
              </ul>
              <p className="text-sm">
                These third-party services have their own cookie policies, which we recommend 
                reviewing separately.
              </p>
            </CardContent>
          </Card>

          {/* Managing Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Managing Cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You can control and manage cookies in several ways:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Browser Settings</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Most web browsers allow you to control cookies through their settings preferences. 
                    You can set your browser to refuse cookies or delete certain cookies.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Chrome: Settings → Privacy and security → Cookies and other site data</li>
                    <li>Firefox: Options → Privacy & Security → Cookies and Site Data</li>
                    <li>Safari: Preferences → Privacy → Manage Website Data</li>
                    <li>Edge: Settings → Cookies and site permissions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Our Cookie Settings</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    You can manage your cookie preferences through our settings page:
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setLocation('/settings')}
                    className="text-sm"
                  >
                    Go to Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact of Disabling Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-warning" />
                Impact of Disabling Cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you choose to disable cookies, some features of our service may not function 
                properly:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>You may need to re-enter your preferences each time you visit</li>
                <li>Analysis history may not be saved</li>
                <li>Theme and display settings may reset</li>
                <li>Some security features may not work correctly</li>
                <li>Performance may be affected</li>
              </ul>
            </CardContent>
          </Card>

          {/* Updates to Cookie Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Updates to This Cookie Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our 
                practices or for other operational, legal, or regulatory reasons. We will notify 
                you of any material changes by posting the updated policy on this page.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> privacy@phish-eye.com</p>
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
