import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { getHistory, clearHistory, exportHistory, importHistory, removeFromHistory } from "@/lib/history-manager-db";
import { exportToPDF } from "@/lib/pdf-export";
import type { HistoryEntry } from "@shared/schema";
import { Search, Download, Upload, Trash2, Eye, RefreshCw, Calendar, Clock, Database } from "lucide-react";
import HistoryEntryComponent from "@/components/history/history-entry";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterHistory();
  }, [history, searchQuery, riskFilter, timeFilter]);

  const loadHistory = async () => {
    try {
      const historyData = await getHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Failed to load history:', error);
      setHistory([]);
    }
  };

  const filterHistory = () => {
    if (!Array.isArray(history)) {
      setFilteredHistory([]);
      return;
    }
    
    let filtered = [...history];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(entry =>
        entry.url.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Risk level filter
    if (riskFilter !== "all") {
      filtered = filtered.filter(entry => {
        switch (riskFilter) {
          case "safe": return entry.score <= 24;
          case "warning": return entry.score >= 25 && entry.score <= 59;
          case "high-risk": return entry.score >= 60;
          default: return true;
        }
      });
    }

    // Time filter
    if (timeFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch (timeFilter) {
        case "24h":
          filterDate.setHours(now.getHours() - 24);
          break;
        case "7d":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "30d":
          filterDate.setDate(now.getDate() - 30);
          break;
      }

      if (timeFilter !== "all") {
        filtered = filtered.filter(entry => 
          new Date(entry.date) >= filterDate
        );
      }
    }

    setFilteredHistory(filtered);
    setCurrentPage(1);
  };

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear all history? This cannot be undone.")) {
      try {
        await clearHistory();
        setHistory([]);
        setFilteredHistory([]);
        toast({
          title: "History Cleared",
          description: "All analysis history has been removed.",
        });
      } catch (error) {
        console.error('Failed to clear history:', error);
        toast({
          title: "Error",
          description: "Failed to clear history. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleExportHistory = async () => {
    try {
      await exportHistory();
    } catch (error) {
      console.error('Failed to export history:', error);
      toast({
        title: "Export Error",
        description: "Failed to export history. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImportHistory = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await importHistory(file, (success, message) => {
          if (success) {
            loadHistory();
            toast({
              title: "History Imported",
              description: message,
            });
          } else {
            toast({
              title: "Import Failed",
              description: message,
              variant: "destructive",
            });
          }
        });
      } catch (error) {
        console.error('Failed to import history:', error);
        toast({
          title: "Import Error",
          description: "Failed to import history. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "Safe": return "bg-success/20 text-success";
      case "Warning": return "bg-warning/20 text-warning";
      case "High Risk": return "bg-destructive/20 text-destructive";
      default: return "bg-muted/20 text-muted-foreground";
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "Safe": return "shield-check";
      case "Warning": return "shield-alert";
      case "High Risk": return "shield-x";
      default: return "shield";
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="min-h-screen py-20 bg-muted/5" data-testid="history-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Analysis History</h2>
          <p className="text-muted-foreground">Review your previous URL analyses and export reports.</p>
        </motion.div>

        {/* History Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative">
                    <Input
                      placeholder="Search history..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="input-search"
                    />
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger className="w-48" data-testid="select-risk-filter">
                      <SelectValue placeholder="All Risk Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="safe">Safe (0-24)</SelectItem>
                      <SelectItem value="warning">Warning (25-59)</SelectItem>
                      <SelectItem value="high-risk">High Risk (60-100)</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-40" data-testid="select-time-filter">
                      <SelectValue placeholder="All time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All time</SelectItem>
                      <SelectItem value="24h">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-3">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportHistory}
                    className="hidden"
                    id="import-history"
                    data-testid="input-import"
                  />
                  <label htmlFor="import-history">
                    <Button variant="secondary" asChild data-testid="button-import">
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Import
                      </span>
                    </Button>
                  </label>
                  <Button onClick={handleExportHistory} data-testid="button-export-all">
                    <Download className="w-4 h-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* History Entries */}
        <div className="space-y-4">
          {paginatedHistory.length > 0 ? (
            paginatedHistory.map((entry, index) => (
              <motion.div
                key={entry.id}
                className="motion-safe"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.02, 0.2) }}
              >
                <HistoryEntryComponent
                  entry={entry}
                  onDelete={async (id) => {
                    try {
                      await removeFromHistory(id);
                      const updatedHistory = history.filter(h => h.id !== id);
                      setHistory(updatedHistory);
                    } catch (error) {
                      console.error('Failed to delete entry:', error);
                      toast({
                        title: "Delete Error",
                        description: "Failed to delete entry. Please try again.",
                        variant: "destructive",
                      });
                    }
                  }}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Analysis History</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || riskFilter !== "all" || timeFilter !== "all"
                  ? "No entries match your current filters."
                  : "Start analyzing URLs to build your history."}
              </p>
              {(searchQuery || riskFilter !== "all" || timeFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setRiskFilter("all");
                    setTimeFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </motion.div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mt-8"
          >
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredHistory.length)} of {filteredHistory.length} analyses
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                data-testid="button-prev-page"
              >
                Previous
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === totalPages || 
                  Math.abs(page - currentPage) <= 2
                )
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      data-testid={`button-page-${page}`}
                    >
                      {page}
                    </Button>
                  </div>
                ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                data-testid="button-next-page"
              >
                Next
              </Button>
            </div>
          </motion.div>
        )}

        {/* Clear History Button */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center"
          >
            <Button
              variant="destructive"
              onClick={handleClearHistory}
              data-testid="button-clear-history"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All History
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
