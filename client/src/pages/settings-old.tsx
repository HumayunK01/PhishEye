import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
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
import type { Settings } from "@shared/schema";
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
  RefreshCw
} from "lucide-react";

const defaultSettings: Settings = {
  theme: "dark",
  maxHistoryEntries: 50,
  autoAnalyze: true,
  soundNotifications: false,
  reducedMotion: false,
  analysisTimeout: 30,
  organizationName: "",
  // New enhanced settings
  notifications: {
    email: false,
    browser: true,
    desktop: false,
    sound: false,
    vibration: false
  },
  analysis: {
    autoStart: true,
    bulkMode: false,
    deepScan: false,
    timeout: 30,
    retryAttempts: 3
  },
  security: {
    dataRetention: 30,
    autoDelete: false,
    encryption: true,
    anonymize: false
  },
  appearance: {
    compactMode: false,
    showAnimations: true,
    fontSize: 'medium',
    colorScheme: 'auto'
  }
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [historyCount, setHistoryCount] = useState(0);
  const [storageSize, setStorageSize] = useState("0");

  useEffect(() => {
    loadSettings();
    updateStorageInfo();
  }, []);

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('phishEyeSettings:v1');
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = (newSettings: Settings) => {
    try {
      localStorage.setItem('phishEyeSettings:v1', JSON.stringify(newSettings));
      setSettings(newSettings);
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateStorageInfo = () => {
    const history = getHistory();
    setHistoryCount(history.length);

    // Calculate approximate storage size
    const historyData = localStorage.getItem('phishEyeHistory:v1') || '[]';
    const settingsData = localStorage.getItem('phishEyeSettings:v1') || '{}';
    const totalSize = new Blob([historyData, settingsData]).size;
    setStorageSize((totalSize / 1024).toFixed(1)); // KB
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as "light" | "dark" | "system");
    saveSettings({ ...settings, theme: newTheme as "light" | "dark" | "system" });
  };

  const handleSettingChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const handleClearAllData = () => {
    if (window.confirm("This will reset all settings to defaults and clear all stored data. This action cannot be undone. Are you sure?")) {
      localStorage.removeItem('phishEyeHistory:v1');
      localStorage.removeItem('phishEyeSettings:v1');
      localStorage.removeItem('phishEyeTheme');
      setSettings(defaultSettings);
      setTheme("dark");
      updateStorageInfo();
      toast({
        title: "All Data Cleared",
        description: "Settings have been reset and all data cleared.",
      });
    }
  };

  const handleExportSettings = () => {
    const exportData = {
      settings,
      history: getHistory(),
      exportDate: new Date().toISOString(),
      version: "1.0"
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phisheye-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Backup Created",
      description: "Settings and history exported successfully.",
    });
  };


  return (
    <section className="min-h-screen py-20 bg-muted/5" data-testid="settings-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Settings</h2>
          <p className="text-muted-foreground">Customize your PhishEye experience and manage your data.</p>
        </motion.div>

        <div className="space-y-8">
          {/* Appearance Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Appearance
                </h3>

                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Theme</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        onClick={() => handleThemeChange("light")}
                        className="p-4 h-auto"
                        data-testid="button-theme-light"
                      >
                        <div className="flex items-center gap-3">
                          <Sun className="w-5 h-5" />
                          <span>Light</span>
                        </div>
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        onClick={() => handleThemeChange("dark")}
                        className="p-4 h-auto"
                        data-testid="button-theme-dark"
                      >
                        <div className="flex items-center gap-3">
                          <Moon className="w-5 h-5" />
                          <span>Dark</span>
                        </div>
                      </Button>
                      <Button
                        variant={theme === "system" ? "default" : "outline"}
                        onClick={() => handleThemeChange("system")}
                        className="p-4 h-auto"
                        data-testid="button-theme-system"
                      >
                        <div className="flex items-center gap-3">
                          <Monitor className="w-5 h-5" />
                          <span>System</span>
                        </div>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Reduced Motion</Label>
                      <p className="text-sm text-muted-foreground">Minimize animations for better accessibility</p>
                    </div>
                    <Switch
                      checked={settings.reducedMotion}
                      onCheckedChange={(checked) => handleSettingChange('reducedMotion', checked)}
                      data-testid="switch-reduced-motion"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Data Management
                </h3>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="history-retention" className="text-sm font-medium mb-3 block">
                      History Retention
                    </Label>
                    <Select
                      value={settings.maxHistoryEntries.toString()}
                      onValueChange={(value) => handleSettingChange('maxHistoryEntries', parseInt(value))}
                    >
                      <SelectTrigger data-testid="select-history-retention">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">Keep last 25 analyses</SelectItem>
                        <SelectItem value="50">Keep last 50 analyses (default)</SelectItem>
                        <SelectItem value="100">Keep last 100 analyses</SelectItem>
                        <SelectItem value="1000">Keep all analyses</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-2">
                      Older analyses will be automatically removed when the limit is reached.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-accent/5 rounded-lg">
                      <div className="font-medium mb-2">Current Usage</div>
                      <div className="text-2xl font-bold text-primary mb-1">{historyCount} analyses</div>
                      <div className="text-sm text-muted-foreground">~{storageSize} KB local storage</div>
                    </div>
                    <div className="p-4 bg-accent/5 rounded-lg">
                      <div className="font-medium mb-2">Storage Limit</div>
                      <div className="text-2xl font-bold text-success mb-1">{settings.maxHistoryEntries} analyses</div>
                      <div className="text-sm text-muted-foreground">Browser local storage</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="secondary" 
                      onClick={handleExportSettings}
                      data-testid="button-export-backup"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Backup
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        clearHistory();
                        updateStorageInfo();
                        toast({
                          title: "History Cleared",
                          description: "All analysis history has been removed.",
                        });
                      }}
                      data-testid="button-clear-history"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* PDF Export Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  PDF Export Branding
                </h3>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="org-name" className="text-sm font-medium mb-3 block">
                      Organization Name
                    </Label>
                    <Input
                      id="org-name"
                      placeholder="Enter organization name (optional)"
                      value={settings.organizationName}
                      onChange={(e) => handleSettingChange('organizationName', e.target.value)}
                      data-testid="input-organization"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      This will appear in the PDF report header.
                    </p>
                  </div>


                  <div className="p-4 bg-accent/5 rounded-lg">
                    <h4 className="font-medium mb-2">Preview</h4>
                    <div className="border border-border rounded p-3 bg-background">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">
                          {settings.organizationName || "Your Organization"}
                        </div>
                        <div className="text-xs text-muted-foreground">Generated by PhishEye</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Risk Assessment Report - example.com
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Advanced Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-primary" />
                  Advanced Settings
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Automatic Analysis</Label>
                      <p className="text-sm text-muted-foreground">Automatically analyze URLs when pasted</p>
                    </div>
                    <Switch
                      checked={settings.autoAnalyze}
                      onCheckedChange={(checked) => handleSettingChange('autoAnalyze', checked)}
                      data-testid="switch-auto-analyze"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Sound Notifications</Label>
                      <p className="text-sm text-muted-foreground">Play sounds for analysis completion</p>
                    </div>
                    <Switch
                      checked={settings.soundNotifications}
                      onCheckedChange={(checked) => handleSettingChange('soundNotifications', checked)}
                      data-testid="switch-sound-notifications"
                    />
                  </div>

                  <div>
                    <Label htmlFor="analysis-timeout" className="text-sm font-medium mb-3 block">
                      Analysis Timeout
                    </Label>
                    <Select
                      value={settings.analysisTimeout.toString()}
                      onValueChange={(value) => handleSettingChange('analysisTimeout', parseInt(value))}
                    >
                      <SelectTrigger data-testid="select-timeout">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 seconds</SelectItem>
                        <SelectItem value="30">30 seconds (default)</SelectItem>
                        <SelectItem value="60">60 seconds</SelectItem>
                        <SelectItem value="120">120 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-2">
                      Maximum time to wait for each OSINT source response.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Reset Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-card border-destructive/20">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  Reset All Settings
                </h3>

                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    This will reset all settings to their default values and clear all stored data. This action cannot be undone.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleClearAllData}
                    className="px-6"
                    data-testid="button-reset-all"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset All Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
