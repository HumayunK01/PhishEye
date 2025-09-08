import { toast } from "@/hooks/use-toast";
import type { HistoryEntry } from "@shared/schema";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class HistoryManagerDB {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getHistory(limit: number = 50, offset: number = 0): Promise<HistoryEntry[]> {
    try {
      return await this.request<HistoryEntry[]>(`/history?limit=${limit}&offset=${offset}`);
    } catch (error) {
      console.error("Failed to load history:", error);
      toast({
        title: "Database Error",
        description: "Failed to load history from database. Please try again.",
        variant: "destructive",
      });
      return [];
    }
  }

  async addToHistory(entry: HistoryEntry): Promise<HistoryEntry | null> {
    try {
      const newEntry = await this.request<HistoryEntry>('/history', {
        method: 'POST',
        body: JSON.stringify(entry),
      });
      
      toast({
        title: "Saved to History",
        description: "Analysis has been saved to the database.",
      });
      
      return newEntry;
    } catch (error) {
      console.error("Failed to save to history:", error);
      toast({
        title: "Database Error",
        description: "Failed to save analysis to database. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }

  async removeFromHistory(id: string): Promise<boolean> {
    try {
      await this.request(`/history/${id}`, {
        method: 'DELETE',
      });
      
      toast({
        title: "Entry Deleted",
        description: "History entry has been removed from the database.",
      });
      
      return true;
    } catch (error) {
      console.error("Failed to remove from history:", error);
      toast({
        title: "Database Error",
        description: "Failed to delete entry from database. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  async clearHistory(): Promise<boolean> {
    try {
      await this.request('/history', {
        method: 'DELETE',
      });
      
      toast({
        title: "History Cleared",
        description: "All history entries have been removed from the database.",
      });
      
      return true;
    } catch (error) {
      console.error("Failed to clear history:", error);
      toast({
        title: "Database Error",
        description: "Failed to clear history from database. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  async getHistoryStats(): Promise<{
    totalEntries: number;
    safeCount: number;
    warningCount: number;
    riskCount: number;
  }> {
    try {
      return await this.request('/history/stats');
    } catch (error) {
      console.error("Failed to get history stats:", error);
      return {
        totalEntries: 0,
        safeCount: 0,
        warningCount: 0,
        riskCount: 0,
      };
    }
  }

  async getEntryById(id: string): Promise<HistoryEntry | null> {
    try {
      return await this.request<HistoryEntry>(`/history/${id}`);
    } catch (error) {
      console.error("Failed to get history entry:", error);
      return null;
    }
  }

  async updateEntry(id: string, updates: Partial<HistoryEntry>): Promise<HistoryEntry | null> {
    try {
      return await this.request<HistoryEntry>(`/history/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error("Failed to update history entry:", error);
      toast({
        title: "Database Error",
        description: "Failed to update entry in database. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }

  // Fallback to localStorage if database is unavailable
  private getLocalStorageHistory(): HistoryEntry[] {
    try {
      const stored = localStorage.getItem("phishEyeHistory:v1");
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      
      // Migrate old entries that don't have fullAnalysis
      return parsed.map((entry: any) => {
        if (!entry.fullAnalysis) {
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
                whoisRdap: { status: "timeout" as const, error: "Historical data not available" },
                virustotal: { status: "timeout" as const, error: "Historical data not available" },
                urlscan: { status: "timeout" as const, error: "Historical data not available" },
                googleSafeBrowsing: { status: "timeout" as const, error: "Historical data not available" },
                certificateTransparency: { status: "timeout" as const, error: "Historical data not available" },
                dnsAnalysis: { status: "timeout" as const, error: "Historical data not available" },
              },
              analysisTime: 0
            }
          };
        }
        return entry;
      });
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
      return [];
    }
  }

  // Hybrid approach: try database first, fallback to localStorage
  async getHistoryWithFallback(limit: number = 50, offset: number = 0): Promise<HistoryEntry[]> {
    try {
      // Try database first
      return await this.getHistory(limit, offset);
    } catch (error) {
      console.warn("Database unavailable, falling back to localStorage:", error);
      // Fallback to localStorage
      const localHistory = this.getLocalStorageHistory();
      return localHistory.slice(offset, offset + limit);
    }
  }

  async exportHistory(): Promise<void> {
    try {
      const history = await this.getHistory(1000, 0); // Get up to 1000 entries
      const exportData = {
        history,
        exportDate: new Date().toISOString(),
        version: "1.0",
        source: "PhishEye Database"
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json"
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `phish-eye-history-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "History has been exported from the database.",
      });
    } catch (error) {
      console.error("Failed to export history:", error);
      toast({
        title: "Export Error",
        description: "Failed to export history from database. Please try again.",
        variant: "destructive",
      });
    }
  }

  async importHistory(
    file: File,
    callback: (success: boolean, message: string) => void
  ): Promise<void> {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
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

        // Import entries to database
        let successCount = 0;
        let errorCount = 0;

        for (const entry of data.history) {
          try {
            // Convert date string to Date object
            const entryData = {
              ...entry,
              date: new Date(entry.date),
            };
            await this.addToHistory(entryData);
            successCount++;
          } catch (error) {
            console.error("Failed to import entry:", error);
            errorCount++;
          }
        }

        if (successCount > 0) {
          callback(true, `Successfully imported ${successCount} entries${errorCount > 0 ? ` (${errorCount} failed)` : ''}`);
        } else {
          callback(false, "No entries could be imported");
        }
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
}

export const historyManagerDB = new HistoryManagerDB();

// Export individual functions for compatibility
export const getHistory = (limit?: number, offset?: number) => 
  historyManagerDB.getHistoryWithFallback(limit, offset);

export const addToHistory = (entry: HistoryEntry) => 
  historyManagerDB.addToHistory(entry);

export const removeFromHistory = (id: string) => 
  historyManagerDB.removeFromHistory(id);

export const clearHistory = () => 
  historyManagerDB.clearHistory();

export const getHistoryStats = () => 
  historyManagerDB.getHistoryStats();

export const getEntryById = (id: string) => 
  historyManagerDB.getEntryById(id);

export const updateEntry = (id: string, updates: Partial<HistoryEntry>) => 
  historyManagerDB.updateEntry(id, updates);

export const exportHistory = () => 
  historyManagerDB.exportHistory();

export const importHistory = (file: File, callback: (success: boolean, message: string) => void) => 
  historyManagerDB.importHistory(file, callback);
