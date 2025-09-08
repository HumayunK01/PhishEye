import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { exportToPDF } from "@/lib/pdf-export";
import type { HistoryEntry } from "@shared/schema";
import { Eye, RefreshCw, Download, Trash2, Calendar, Clock, Database, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

interface HistoryEntryProps {
  entry: HistoryEntry;
  onDelete: (id: string) => void;
}

export default function HistoryEntryComponent({ entry, onDelete }: HistoryEntryProps) {
  const [, setLocation] = useLocation();
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
      case "Safe": return <ShieldCheck className="w-4 h-4" />;
      case "Warning": return <ShieldAlert className="w-4 h-4" />;
      case "High Risk": return <ShieldX className="w-4 h-4" />;
      default: return <ShieldCheck className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return dateString;
    }
  };

  const handleViewReport = () => {
    // Use the full analysis data if available, otherwise fall back to snapshot
    const analysisData = entry.fullAnalysis || {
      id: entry.id,
      url: entry.url,
      normalizedUrl: entry.url,
      timestamp: entry.date,
      score: entry.score,
      verdict: entry.verdict,
      reasons: entry.snapshot.reasons,
      sources: {
        whoisRdap: { status: "timeout" as const, error: "Historical data not available - this entry was created before detailed source tracking was implemented" },
        virustotal: { status: "timeout" as const, error: "Historical data not available - this entry was created before detailed source tracking was implemented" },
        urlscan: { status: "timeout" as const, error: "Historical data not available - this entry was created before detailed source tracking was implemented" },
        googleSafeBrowsing: { status: "timeout" as const, error: "Historical data not available - this entry was created before detailed source tracking was implemented" },
        certificateTransparency: { status: "timeout" as const, error: "Historical data not available - this entry was created before detailed source tracking was implemented" },
        dnsAnalysis: { status: "timeout" as const, error: "Historical data not available - this entry was created before detailed source tracking was implemented" },
      },
      analysisTime: 0
    };
    
    // Store the analysis data in localStorage for the report page to access
    localStorage.setItem(`analysis_${entry.id}`, JSON.stringify(analysisData));
    // Navigate to the report page
    setLocation(`/report?id=${entry.id}`);
  };

  const handleReAnalyze = () => {
    // This would trigger a new analysis of the same URL
    toast({
      title: "Re-analyze",
      description: "Re-analysis functionality would be implemented here.",
    });
  };

  const handleExportPDF = () => {
    // Convert history entry to analysis result format for PDF export
    const mockAnalysisResult = {
      id: entry.id,
      url: entry.url,
      normalizedUrl: entry.url,
      timestamp: entry.date,
      score: entry.score,
      verdict: entry.verdict,
      reasons: entry.snapshot.reasons,
      sources: {}, // Would need to be stored in history for full functionality
      analysisTime: 0
    };
    
    exportToPDF(mockAnalysisResult as any);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      onDelete(entry.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      data-testid={`history-entry-${entry.id}`}
    >
      <Card className="glass-card hover:bg-accent/10 transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge 
                  className={`inline-flex items-center px-3 py-1 text-sm font-medium ${getVerdictColor(entry.verdict)}`}
                  data-testid={`verdict-${entry.verdict.toLowerCase().replace(' ', '-')}`}
                >
                  {getVerdictIcon(entry.verdict)}
                  <span className="ml-1">{entry.verdict}</span>
                </Badge>
                <div className="text-2xl font-bold text-primary" data-testid="entry-score">
                  {entry.score}
                </div>
              </div>
              
              <div className="mb-2">
                <a 
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors font-medium break-all"
                  data-testid="entry-url"
                >
                  {entry.url}
                </a>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1" data-testid="entry-date">
                  <Calendar className="w-4 h-4" />
                  {formatDate(entry.date)}
                </span>
                <span className="flex items-center gap-1" data-testid="entry-brief">
                  <Database className="w-4 h-4" />
                  {entry.snapshot.brief}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleViewReport}
                title="View Report"
                data-testid="button-view-report"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReAnalyze}
                title="Re-analyze"
                data-testid="button-reanalyze"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExportPDF}
                title="Export PDF"
                data-testid="button-export-pdf"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                title="Delete"
                className="hover:bg-destructive/20 hover:text-destructive"
                data-testid="button-delete"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
