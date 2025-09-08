import { motion } from "framer-motion";
import ThreatMonitor from "@/components/monitoring/threat-monitor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Activity, AlertTriangle, Eye } from "lucide-react";

export default function MonitoringPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Real-Time Threat Monitoring
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Monitor threats in real-time with advanced OSINT intelligence and automated alerts
            </p>
          </div>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <Activity className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Real-Time Detection</h3>
              <p className="text-sm text-muted-foreground">
                Continuous monitoring of threat intelligence feeds and automated detection
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Instant Alerts</h3>
              <p className="text-sm text-muted-foreground">
                Get notified immediately when new threats are detected or patterns emerge
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <Eye className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Comprehensive Coverage</h3>
              <p className="text-sm text-muted-foreground">
                Monitor multiple threat vectors including phishing, malware, and social engineering
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Monitoring Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ThreatMonitor />
        </motion.div>
      </div>
    </div>
  );
}
