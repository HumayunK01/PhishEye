import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { useSettings } from "@/contexts/SettingsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { getHistory, clearHistory } from "@/lib/history-manager";
import { notificationService } from "@/lib/notification-service";
import { 
  Palette, 
  Database, 
  FileText, 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Monitor, 
  AlertTriangle, 
  RotateCcw, 
  Download, 
  Trash2,
  Bell,
  Shield,
  Zap,
  Eye,
  Globe,
  Clock,
  Save,
  RefreshCw,
  User,
  Lock,
  Activity,
  BarChart3
} from "lucide-react";


export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { settings, updateSetting, updateNestedSetting, resetSettings, exportSettings, isLoaded } = useSettings();
  const [historyCount, setHistoryCount] = useState(0);
  const [storageSize, setStorageSize] = useState("0");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    updateStorageInfo();
  }, [isLoaded]);

  const updateStorageInfo = () => {
    const history = getHistory();
    setHistoryCount(history.length);

    // Calculate approximate storage size
    const historyData = localStorage.getItem('phishEyeHistory:v1') || '[]';
    const settingsData = localStorage.getItem('phishEyeSettings:v2') || '{}';
    const totalSize = new Blob([historyData, settingsData]).size;
    setStorageSize((totalSize / 1024).toFixed(1)); // KB
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as "light" | "dark" | "system");
    updateSetting('theme', newTheme as "light" | "dark" | "system");
  };

  const handleSettingChange = <K extends keyof typeof settings>(key: K, value: typeof settings[K]) => {
    updateSetting(key, value);
  };

  const handleNestedSettingChange = <K extends keyof typeof settings>(
    category: K, 
    key: keyof typeof settings[K], 
    value: any
  ) => {
    updateNestedSetting(category, key, value);
  };

  const handleClearAllData = () => {
    if (window.confirm("This will reset all settings to defaults and clear all stored data. This action cannot be undone. Are you sure?")) {
      localStorage.removeItem('phishEyeHistory:v1');
      localStorage.removeItem('phishEyeSettings:v2');
      localStorage.removeItem('phishEyeTheme');
      resetSettings();
      setTheme("dark");
      updateStorageInfo();
    }
  };

  const handleTestNotification = async () => {
    if (settings.notifications.browser) {
      await notificationService.showNotification('Test Notification', {
        body: 'This is a test notification from PhishEye',
        icon: '/favicon.ico'
      });
    }
    
    if (settings.notifications.sound) {
      await notificationService.playSound('success');
    }
    
    if (settings.notifications.vibration) {
      notificationService.vibrate([200, 100, 200]);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("This will clear all analysis history. This action cannot be undone. Are you sure?")) {
      clearHistory();
      updateStorageInfo();
      toast({
        title: "History Cleared",
        description: "All analysis history has been removed.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground">
                Customize your PhishEye experience and manage your data
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isSaving && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Saving...
                </Badge>
              )}
              <Button onClick={exportSettings} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Data
            </TabsTrigger>
          </TabsList>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Theme & Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select value={settings.theme} onValueChange={handleThemeChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="w-4 h-4" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="w-4 h-4" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            System
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Select 
                      value={settings.appearance.fontSize} 
                      onValueChange={(value) => handleNestedSettingChange('appearance', 'fontSize', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Reduce spacing and padding for a more compact interface
                      </p>
                    </div>
                    <Switch
                      checked={settings.appearance.compactMode}
                      onCheckedChange={(checked) => handleNestedSettingChange('appearance', 'compactMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable smooth transitions and animations
                      </p>
                    </div>
                    <Switch
                      checked={settings.appearance.showAnimations}
                      onCheckedChange={(checked) => handleNestedSettingChange('appearance', 'showAnimations', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reduced Motion</Label>
                      <p className="text-sm text-muted-foreground">
                        Respect system accessibility preferences
                      </p>
                    </div>
                    <Switch
                      checked={settings.reducedMotion}
                      onCheckedChange={(checked) => handleSettingChange('reducedMotion', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Browser Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show desktop notifications for threat alerts
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.browser}
                      onCheckedChange={(checked) => handleNestedSettingChange('notifications', 'browser', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sound Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sound when new threats are detected
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.sound}
                      onCheckedChange={(checked) => handleNestedSettingChange('notifications', 'sound', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Vibration</Label>
                      <p className="text-sm text-muted-foreground">
                        Vibrate device for mobile notifications
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.vibration}
                      onCheckedChange={(checked) => handleNestedSettingChange('notifications', 'vibration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send email alerts for critical threats
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => handleNestedSettingChange('notifications', 'email', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex justify-center">
                    <Button onClick={handleTestNotification} variant="outline" size="sm">
                      <Bell className="w-4 h-4 mr-2" />
                      Test Notifications
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Settings */}
          <TabsContent value="analysis" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Analysis Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-Start Analysis</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically start analysis when URL is entered
                      </p>
                    </div>
                    <Switch
                      checked={settings.analysis.autoStart}
                      onCheckedChange={(checked) => handleNestedSettingChange('analysis', 'autoStart', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Bulk Mode Default</Label>
                      <p className="text-sm text-muted-foreground">
                        Start in bulk analysis mode by default
                      </p>
                    </div>
                    <Switch
                      checked={settings.analysis.bulkMode}
                      onCheckedChange={(checked) => handleNestedSettingChange('analysis', 'bulkMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Deep Scan</Label>
                      <p className="text-sm text-muted-foreground">
                        Perform more thorough analysis (slower but more accurate)
                      </p>
                    </div>
                    <Switch
                      checked={settings.analysis.deepScan}
                      onCheckedChange={(checked) => handleNestedSettingChange('analysis', 'deepScan', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Analysis Timeout (seconds)</Label>
                    <div className="px-3">
                      <Slider
                        value={[settings.analysis.timeout]}
                        onValueChange={([value]) => handleNestedSettingChange('analysis', 'timeout', value)}
                        max={120}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>10s</span>
                        <span>{settings.analysis.timeout}s</span>
                        <span>120s</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Retry Attempts</Label>
                    <div className="px-3">
                      <Slider
                        value={[settings.analysis.retryAttempts]}
                        onValueChange={([value]) => handleNestedSettingChange('analysis', 'retryAttempts', value)}
                        max={5}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0</span>
                        <span>{settings.analysis.retryAttempts}</span>
                        <span>5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data Encryption</Label>
                      <p className="text-sm text-muted-foreground">
                        Encrypt stored analysis data locally
                      </p>
                    </div>
                    <Switch
                      checked={settings.security.encryption}
                      onCheckedChange={(checked) => handleNestedSettingChange('security', 'encryption', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Anonymize Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Remove identifying information from analysis data
                      </p>
                    </div>
                    <Switch
                      checked={settings.security.anonymize}
                      onCheckedChange={(checked) => handleNestedSettingChange('security', 'anonymize', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-Delete Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically delete old analysis data
                      </p>
                    </div>
                    <Switch
                      checked={settings.security.autoDelete}
                      onCheckedChange={(checked) => handleNestedSettingChange('security', 'autoDelete', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Data Retention Period (days)</Label>
                  <div className="px-3">
                    <Slider
                      value={[settings.security.dataRetention]}
                      onValueChange={([value]) => handleNestedSettingChange('security', 'dataRetention', value)}
                      max={365}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1 day</span>
                      <span>{settings.security.dataRetention} days</span>
                      <span>1 year</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Organization Name</Label>
                    <Input
                      value={settings.organizationName}
                      onChange={(e) => handleSettingChange('organizationName', e.target.value)}
                      placeholder="Enter your organization name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max History Entries</Label>
                    <div className="px-3">
                      <Slider
                        value={[settings.maxHistoryEntries]}
                        onValueChange={([value]) => handleSettingChange('maxHistoryEntries', value)}
                        max={1000}
                        min={10}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>10</span>
                        <span>{settings.maxHistoryEntries}</span>
                        <span>1000</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <h4 className="font-medium">Storage Usage</h4>
                      <p className="text-sm text-muted-foreground">
                        {historyCount} analyses stored ({storageSize} KB)
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-muted-foreground" />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleClearHistory} variant="outline" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear History
                    </Button>
                    <Button onClick={exportSettings} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                    <h4 className="font-medium text-destructive mb-2">Danger Zone</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      These actions are irreversible. Please proceed with caution.
                    </p>
                    <Button onClick={handleClearAllData} variant="destructive" size="sm">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset All Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
