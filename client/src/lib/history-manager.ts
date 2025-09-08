import type { HistoryEntry } from "@shared/schema";
import { toast } from "@/hooks/use-toast";

const HISTORY_STORAGE_KEY = "phishEyeHistory:v1";
const MAX_HISTORY_ENTRIES = 50;

export function getHistory(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    
    // Migrate old entries that don't have fullAnalysis
    const migratedEntries = parsed.map((entry: any) => {
      if (!entry.fullAnalysis) {
        // Create a basic fullAnalysis object for old entries
        return {
          ...entry,
          fullAnalysis: {
            id: entry.id,
            url: entry.url,
            normalizedUrl: entry.url,
            timestamp: entry.date,
            score: entry.score,
            verdict: entry.verdict,
            reasons: entry.snapshot?.reasons || [],
            sources: {
              whoisRdap: { status: "timeout" as const, error: "Historical data not available - this entry was created before detailed source tracking was implemented" },
              virustotal: { status: "timeout" as const, error: "Historical data not available - this entry was created before detailed source tracking was implemented" },
              urlscan: { status: "timeout" as const, error: "Historical data not available - this entry was created before detailed source tracking was implemented" },
              googleSafeBrowsing: { status: "timeout" as const, error: "Historical data not available - this entry was created before detailed source tracking was implemented" },
              certificateTransparency: { status: "timeout" as const, error: "Historical data not available - this entry was created before detailed source tracking was implemented" },
              dnsAnalysis: { status: "timeout" as const, error: "Historical data not available - this entry was created before detailed source tracking was implemented" },
            },
            analysisTime: 0
          }
        };
      }
      return entry;
    });
    
    return migratedEntries;
  } catch (error) {
    console.error("Failed to load history:", error);
    return [];
  }
}

export function addToHistory(entry: HistoryEntry): void {
  try {
    const history = getHistory();
    
    // Remove any existing entry with the same URL to avoid duplicates
    const filteredHistory = history.filter(h => h.url !== entry.url);
    
    // Add new entry at the beginning
    const newHistory = [entry, ...filteredHistory];
    
    // Limit to max entries
    const limitedHistory = newHistory.slice(0, MAX_HISTORY_ENTRIES);
    
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error("Failed to save to history:", error);
    toast({
      title: "Storage Error",
      description: "Failed to save analysis to history.",
      variant: "destructive",
    });
  }
}

export function removeFromHistory(id: string): void {
  try {
    const history = getHistory();
    const updatedHistory = history.filter(entry => entry.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to remove from history:", error);
    toast({
      title: "Storage Error",
      description: "Failed to remove entry from history.",
      variant: "destructive",
    });
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear history:", error);
    toast({
      title: "Storage Error",
      description: "Failed to clear history.",
      variant: "destructive",
    });
  }
}

export function exportHistory(): void {
  try {
    const history = getHistory();
    const exportData = {
      history,
      exportDate: new Date().toISOString(),
      version: "1.0",
      source: "PhishEye"
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json"
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `phisheye-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to export history:", error);
    toast({
      title: "Export Error",
      description: "Failed to export history.",
      variant: "destructive",
    });
  }
}

export function importHistory(
  file: File,
  callback: (success: boolean, message: string) => void
): void {
  const reader = new FileReader();
  
  reader.onload = (event) => {
    try {
      const content = event.target?.result as string;
      const data = JSON.parse(content);
      
      if (!data.history || !Array.isArray(data.history)) {
        callback(false, "Invalid file format: missing history array");
        return;
      }

      // Validate each entry has required fields
      const isValid = data.history.every((entry: any) => 
        entry.id && entry.url && entry.date && typeof entry.score === 'number' && entry.verdict
      );

      if (!isValid) {
        callback(false, "Invalid file format: entries missing required fields");
        return;
      }

      // Merge with existing history (avoid duplicates by URL)
      const existingHistory = getHistory();
      const existingUrls = new Set(existingHistory.map(h => h.url));
      
      const newEntries = data.history.filter((entry: HistoryEntry) => 
        !existingUrls.has(entry.url)
      );

      const mergedHistory = [...existingHistory, ...newEntries]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, MAX_HISTORY_ENTRIES);

      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(mergedHistory));
      
      callback(true, `Successfully imported ${newEntries.length} new entries`);
    } catch (error) {
      console.error("Failed to import history:", error);
      callback(false, "Failed to parse file: invalid JSON format");
    }
  };

  reader.onerror = () => {
    callback(false, "Failed to read file");
  };

  reader.readAsText(file);
}

export function getHistoryStats(): {
  totalEntries: number;
  safeCount: number;
  warningCount: number;
  riskCount: number;
  storageSize: string;
} {
  const history = getHistory();
  
  const stats = {
    totalEntries: history.length,
    safeCount: history.filter(h => h.score <= 24).length,
    warningCount: history.filter(h => h.score >= 25 && h.score <= 59).length,
    riskCount: history.filter(h => h.score >= 60).length,
    storageSize: "0 KB"
  };

  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY) || "[]";
    const sizeInBytes = new Blob([stored]).size;
    stats.storageSize = `${(sizeInBytes / 1024).toFixed(1)} KB`;
  } catch (error) {
    console.error("Failed to calculate storage size:", error);
  }

  return stats;
}
