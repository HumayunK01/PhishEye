import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { analyzeRequestSchema, type AnalysisResult } from "@shared/schema";
import { addToHistory } from "@/lib/history-manager";
import { 
  Upload, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Download,
  Save,
  RefreshCw,
  FileText,
  Globe
} from "lucide-react";

interface BulkAnalysisResult {
  url: string;
  result?: AnalysisResult;
  error?: string;
  status: 'pending' | 'completed' | 'error';
}

export default function BulkAnalyzer() {
  const [urls, setUrls] = useState<string>("");
  const [results, setResults] = useState<BulkAnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const bulkAnalysisMutation = useMutation({
    mutationFn: async (urlList: string[]) => {
      const analysisPromises = urlList.map(async (url) => {
        try {
          const response = await apiRequest("POST", "/api/analyze", { url });
          const result = await response.json() as AnalysisResult;
          return { url, result, status: 'completed' as const };
        } catch (error) {
          return { 
            url, 
            error: error instanceof Error ? error.message : 'Unknown error', 
            status: 'error' as const 
          };
        }
      });

      return Promise.all(analysisPromises);
    },
    onSuccess: (data) => {
      setResults(data);
      setIsAnalyzing(false);
      toast({
        title: "Bulk Analysis Complete",
        description: `Analyzed ${data.length} URLs successfully`,
      });
    },
    onError: (error) => {
      setIsAnalyzing(false);
      toast({
        title: "Bulk Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = async () => {
    const urlList = urls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (urlList.length === 0) {
      toast({
        title: "No URLs provided",
        description: "Please enter at least one URL to analyze",
        variant: "destructive",
      });
      return;
    }

    if (urlList.length > 50) {
      toast({
        title: "Too many URLs",
        description: "Please limit to 50 URLs per batch",
        variant: "destructive",
      });
      return;
    }

    // Initialize results with pending status
    const initialResults = urlList.map(url => ({
      url,
      status: 'pending' as const
    }));
    setResults(initialResults);
    setCompletedCount(0);
    setIsAnalyzing(true);

    // Start analysis
    bulkAnalysisMutation.mutate(urlList);
  };

  const handleSaveToHistory = () => {
    const successfulResults = results.filter(r => r.result);
    successfulResults.forEach(result => {
      if (result.result) {
        addToHistory({
          id: result.result.id,
          url: result.result.url,
          date: result.result.timestamp,
          score: result.result.score,
          verdict: result.result.verdict,
          snapshot: {
            reasons: result.result.reasons,
            brief: `${result.result.verdict} - ${result.result.sources ? Object.keys(result.result.sources).length : 0} sources checked`,
          },
          fullAnalysis: result.result, // Store the complete analysis data
        });
      }
    });

    toast({
      title: "Saved to History",
      description: `${successfulResults.length} analyses saved to history`,
    });
  };

  const handleExportCSV = () => {
    const csvData = results.map(result => ({
      URL: result.url,
      Status: result.status,
      Score: result.result?.score || 'N/A',
      Verdict: result.result?.verdict || 'Error',
      Error: result.error || 'N/A',
      Timestamp: result.result?.timestamp || new Date().toISOString(),
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setUrls("");
    setResults([]);
    setCompletedCount(0);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const successfulResults = results.filter(r => r.result).length;
  const errorResults = results.filter(r => r.status === 'error').length;
  const progress = results.length > 0 ? (completedCount / results.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk URL Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Enter URLs (one per line)
            </label>
            <Textarea
              placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              className="min-h-[120px]"
              disabled={isAnalyzing}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Enter up to 50 URLs, one per line. Each URL will be analyzed independently.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !urls.trim()}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Analyze URLs
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={isAnalyzing}
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{completedCount} / {results.length}</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {results.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Analysis Results
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveToHistory}
                  disabled={successfulResults === 0}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save to History
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="text-2xl font-bold text-green-600">{successfulResults}</div>
                <div className="text-sm text-green-700">Successful</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="text-2xl font-bold text-red-600">{errorResults}</div>
                <div className="text-sm text-red-700">Errors</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{results.length}</div>
                <div className="text-sm text-blue-700">Total</div>
              </div>
            </div>

            {/* Results List */}
            <div className="space-y-3">
              <AnimatePresence>
                {results.map((result, index) => (
                  <motion.div
                    key={result.url}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getStatusIcon(result.status)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{result.url}</p>
                        {result.error && (
                          <p className="text-sm text-red-500">{result.error}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {result.result && (
                        <>
                          <Badge variant={result.result.score >= 70 ? 'destructive' : result.result.score >= 40 ? 'secondary' : 'default'}>
                            {result.result.score}/100
                          </Badge>
                          <Badge variant="outline">
                            {result.result.verdict}
                          </Badge>
                        </>
                      )}
                      {result.status === 'error' && (
                        <Badge variant="destructive">Error</Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
