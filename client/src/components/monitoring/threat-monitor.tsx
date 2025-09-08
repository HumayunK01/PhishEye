import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  Shield, 
  Activity, 
  Zap, 
  Eye, 
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Bell,
  BellOff
} from "lucide-react";

interface ThreatAlert {
  id: string;
  type: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  source: string;
  severity: number;
  resolved: boolean;
}

interface MonitoringStats {
  totalThreats: number;
  activeThreats: number;
  resolvedThreats: number;
  averageResponseTime: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
}

export default function ThreatMonitor() {
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  const [stats, setStats] = useState<MonitoringStats>({
    totalThreats: 0,
    activeThreats: 0,
    resolvedThreats: 0,
    averageResponseTime: 0,
    systemHealth: 'excellent'
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Simulate real-time threat monitoring
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // Simulate new threat detection
      if (Math.random() > 0.7) {
        const newAlert: ThreatAlert = {
          id: `threat-${Date.now()}`,
          type: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
          title: generateThreatTitle(),
          description: generateThreatDescription(),
          timestamp: new Date().toISOString(),
          source: ['OSINT Feed', 'Honeypot', 'User Report', 'AI Detection'][Math.floor(Math.random() * 4)],
          severity: Math.floor(Math.random() * 100),
          resolved: false
        };

        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep only last 10 alerts

        // Update stats
        setStats(prev => ({
          ...prev,
          totalThreats: prev.totalThreats + 1,
          activeThreats: prev.activeThreats + 1,
          averageResponseTime: Math.floor(Math.random() * 500) + 100
        }));

        // Show notification if enabled
        if (notificationsEnabled) {
          showNotification(newAlert);
        }
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [isMonitoring, notificationsEnabled]);

  const generateThreatTitle = () => {
    const titles = [
      "Suspicious Domain Registration",
      "Phishing Campaign Detected",
      "Malware Distribution Site",
      "Credential Harvesting Attempt",
      "Social Engineering Attack",
      "Fake Banking Website",
      "Cryptocurrency Scam",
      "Tech Support Scam",
      "Romance Scam Network",
      "Investment Fraud Scheme"
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const generateThreatDescription = () => {
    const descriptions = [
      "New domain registered with suspicious characteristics matching known phishing patterns.",
      "Multiple reports of phishing emails targeting financial institutions.",
      "Website hosting malicious software with high detection rate.",
      "Fake login page attempting to harvest user credentials.",
      "Social media accounts spreading misinformation and scams.",
      "Impersonating legitimate banking website with similar design.",
      "Cryptocurrency investment scheme promising unrealistic returns.",
      "Fake tech support website requesting remote access.",
      "Dating platform profiles used for romance scam operations.",
      "Investment platform with fake testimonials and promises."
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const showNotification = (alert: ThreatAlert) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Threat Alert: ${alert.title}`, {
        body: alert.description,
        icon: '/favicon.svg',
        tag: alert.id
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
      }
    }
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, resolved: true }
          : alert
      )
    );
    
    setStats(prev => ({
      ...prev,
      activeThreats: Math.max(0, prev.activeThreats - 1),
      resolvedThreats: prev.resolvedThreats + 1
    }));
  };

  const handleStartMonitoring = () => {
    setIsMonitoring(true);
    requestNotificationPermission();
  };

  const handleStopMonitoring = () => {
    setIsMonitoring(false);
  };

  const getThreatTypeColor = (type: string) => {
    switch (type) {
      case 'high': return 'text-red-500 bg-red-100';
      case 'medium': return 'text-yellow-500 bg-yellow-100';
      default: return 'text-blue-500 bg-blue-100';
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 80) return 'text-red-500';
    if (severity >= 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getSystemHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-red-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Threat Monitoring Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium">
                  {isMonitoring ? 'Monitoring Active' : 'Monitoring Stopped'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={notificationsEnabled ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                >
                  {notificationsEnabled ? <Bell className="w-4 h-4 mr-2" /> : <BellOff className="w-4 h-4 mr-2" />}
                  Notifications {notificationsEnabled ? 'On' : 'Off'}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              {!isMonitoring ? (
                <Button onClick={handleStartMonitoring} className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Start Monitoring
                </Button>
              ) : (
                <Button onClick={handleStopMonitoring} variant="outline" className="flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Stop Monitoring
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Threats</p>
                <p className="text-2xl font-bold">{stats.totalThreats}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Threats</p>
                <p className="text-2xl font-bold text-red-500">{stats.activeThreats}</p>
              </div>
              <Activity className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-green-500">{stats.resolvedThreats}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Health</p>
                <p className={`text-lg font-bold ${getSystemHealthColor(stats.systemHealth)}`}>
                  {stats.systemHealth.toUpperCase()}
                </p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Threat Alerts */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Real-time Threat Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No threats detected</p>
              <p className="text-sm">Start monitoring to see real-time alerts</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {alerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      alert.resolved 
                        ? 'bg-green-50 border-green-200' 
                        : alert.type === 'high'
                        ? 'bg-red-50 border-red-200'
                        : alert.type === 'medium'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getThreatTypeColor(alert.type)}>
                            {alert.type.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            Severity: <span className={getSeverityColor(alert.severity)}>{alert.severity}%</span>
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        
                        <h4 className="font-semibold mb-1">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Source: {alert.source}</span>
                          <span>ID: {alert.id}</span>
                        </div>
                      </div>
                      
                      {!alert.resolved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolveAlert(alert.id)}
                          className="ml-4"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
