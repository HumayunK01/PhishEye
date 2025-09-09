import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { toast } from '@/hooks/use-toast';

export interface Settings {
  theme: "light" | "dark" | "system";
  maxHistoryEntries: number;
  autoAnalyze: boolean;
  soundNotifications: boolean;
  reducedMotion: boolean;
  analysisTimeout: number;
  organizationName: string;
  notifications: {
    email: boolean;
    browser: boolean;
    desktop: boolean;
    sound: boolean;
    vibration: boolean;
  };
  analysis: {
    autoStart: boolean;
    bulkMode: boolean;
    deepScan: boolean;
    timeout: number;
    retryAttempts: number;
  };
  security: {
    dataRetention: number;
    autoDelete: boolean;
    encryption: boolean;
    anonymize: boolean;
  };
  appearance: {
    compactMode: boolean;
    showAnimations: boolean;
    fontSize: 'small' | 'medium' | 'large';
    colorScheme: 'auto' | 'light' | 'dark';
  };
}

const defaultSettings: Settings = {
  theme: "dark",
  maxHistoryEntries: 50,
  autoAnalyze: true,
  soundNotifications: false,
  reducedMotion: false,
  analysisTimeout: 30,
  organizationName: "",
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

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  updateNestedSetting: <K extends keyof Settings>(
    category: K,
    key: keyof Settings[K],
    value: any
  ) => void;
  resetSettings: () => void;
  exportSettings: () => void;
  importSettings: (data: any) => void;
  isLoaded: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const { setTheme } = useTheme();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem('phishEyeSettings:v2');
        if (saved) {
          const parsedSettings = JSON.parse(saved);
          const mergedSettings = { ...defaultSettings, ...parsedSettings };
          setSettings(mergedSettings);
          
          // Apply theme immediately
          setTheme(mergedSettings.theme);
          
          // Apply appearance settings
          applyAppearanceSettings(mergedSettings.appearance);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast({
          title: "Settings Error",
          description: "Failed to load settings. Using defaults.",
          variant: "destructive",
        });
      } finally {
        setIsLoaded(true);
      }
    };

    loadSettings();
  }, [setTheme]);

  // Apply appearance settings to DOM
  const applyAppearanceSettings = (appearance: Settings['appearance']) => {
    const root = document.documentElement;
    
    // Font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    root.style.setProperty('--base-font-size', fontSizeMap[appearance.fontSize]);
    
    // Compact mode
    if (appearance.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
    
    // Animations
    if (!appearance.showAnimations) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }
    
    // Reduced motion
    if (appearance.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  };

  // Save settings to localStorage
  const saveSettings = (newSettings: Settings) => {
    try {
      localStorage.setItem('phishEyeSettings:v2', JSON.stringify(newSettings));
      setSettings(newSettings);
      
      // Apply appearance settings immediately
      applyAppearanceSettings(newSettings.appearance);
      
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings, [key]: value };
    
    // Handle theme change specially
    if (key === 'theme') {
      setTheme(value as "light" | "dark" | "system");
    }
    
    saveSettings(newSettings);
  };

  const updateNestedSetting = <K extends keyof Settings>(
    category: K,
    key: keyof Settings[K],
    value: any
  ) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    };
    saveSettings(newSettings);
  };

  const resetSettings = () => {
    if (window.confirm("This will reset all settings to defaults. Are you sure?")) {
      setSettings(defaultSettings);
      setTheme(defaultSettings.theme);
      applyAppearanceSettings(defaultSettings.appearance);
      localStorage.removeItem('phishEyeSettings:v2');
      toast({
        title: "Settings Reset",
        description: "All settings have been reset to defaults.",
      });
    }
  };

  const exportSettings = () => {
    try {
      const exportData = {
        settings,
        exportDate: new Date().toISOString(),
        version: "2.0"
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `phish-eye-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Settings Exported",
        description: "Settings have been exported successfully.",
      });
    } catch (error) {
      console.error('Failed to export settings:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const importSettings = (data: any) => {
    try {
      if (data.settings && data.version === "2.0") {
        const mergedSettings = { ...defaultSettings, ...data.settings };
        setSettings(mergedSettings);
        setTheme(mergedSettings.theme);
        applyAppearanceSettings(mergedSettings.appearance);
        saveSettings(mergedSettings);
        
        toast({
          title: "Settings Imported",
          description: "Settings have been imported successfully.",
        });
      } else {
        throw new Error('Invalid settings format');
      }
    } catch (error) {
      console.error('Failed to import settings:', error);
      toast({
        title: "Import Failed",
        description: "Failed to import settings. Invalid format.",
        variant: "destructive",
      });
    }
  };

  // Auto-delete old data based on retention settings
  useEffect(() => {
    if (!isLoaded || !settings.security.autoDelete) return;

    const cleanupOldData = () => {
      try {
        const history = JSON.parse(localStorage.getItem('phishEyeHistory:v1') || '[]');
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - settings.security.dataRetention);
        
        const filteredHistory = history.filter((entry: any) => {
          const entryDate = new Date(entry.date);
          return entryDate > cutoffDate;
        });
        
        if (filteredHistory.length !== history.length) {
          localStorage.setItem('phishEyeHistory:v1', JSON.stringify(filteredHistory));
          console.log(`Cleaned up ${history.length - filteredHistory.length} old entries`);
        }
      } catch (error) {
        console.error('Failed to cleanup old data:', error);
      }
    };

    // Run cleanup on mount and set up interval
    cleanupOldData();
    const interval = setInterval(cleanupOldData, 24 * 60 * 60 * 1000); // Daily

    return () => clearInterval(interval);
  }, [isLoaded, settings.security.autoDelete, settings.security.dataRetention]);

  const value: SettingsContextType = {
    settings,
    updateSetting,
    updateNestedSetting,
    resetSettings,
    exportSettings,
    importSettings,
    isLoaded
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
