import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { analyzeRequestSchema, type AnalysisResult } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import RiskMeter from "@/components/analyzer/risk-meter";
import EvidenceCard from "@/components/analyzer/evidence-card";
import LoadingSkeleton from "@/components/analyzer/loading-skeleton";
import BulkAnalyzer from "@/components/analyzer/bulk-analyzer";
import { addToHistory } from "@/lib/history-manager-db";
import { exportToPDF } from "@/lib/pdf-export";
import { Globe, Search, RefreshCw, Save, Download, Shield, Brain, Eye, Upload, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnalyzerPage() {
  const [, setLocation] = useLocation();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const form = useForm({
    resolver: zodResolver(analyzeRequestSchema),
    defaultValues: {
      url: "",
    },
  });

  const analysisMutation = useMutation({
    mutationFn: async (data: { url: string }) => {
      console.log("Starting analysis for:", data.url);
      const response = await apiRequest("POST", "/api/analyze", data);
      console.log("Analysis response received:", response);
      return response.json() as Promise<AnalysisResult>;
    },
    onSuccess: (data) => {
      console.log("Analysis successful:", data);
      setAnalysisResult(data);
      toast({
        title: "Analysis Complete",
        description: `Risk score: ${data.score}/100 - ${data.verdict}`,
      });
    },
    onError: (error) => {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: { url: string }) => {
    console.log("Form submitted with data:", data);
    console.log("Form is valid:", form.formState.isValid);
    console.log("Form errors:", form.formState.errors);
    analysisMutation.mutate(data);
  };

  const handleSaveToHistory = () => {
    if (analysisResult) {
      addToHistory({
        id: analysisResult.id,
        url: analysisResult.url,
        date: analysisResult.timestamp,
        score: analysisResult.score,
        verdict: analysisResult.verdict,
        snapshot: {
          reasons: analysisResult.reasons,
          brief: `${analysisResult.verdict} - ${analysisResult.sources ? Object.keys(analysisResult.sources).length : 0} sources checked`,
        },
        fullAnalysis: analysisResult, // Store the complete analysis data
      });
      toast({
        title: "Saved to History",
        description: "Analysis has been saved to your local history.",
      });
    }
  };

  const handleExportPDF = () => {
    if (analysisResult) {
      exportToPDF(analysisResult);
    }
  };

  const handleViewReport = () => {
    if (analysisResult) {
      // Store the analysis data in localStorage for the report page to access
      localStorage.setItem(`analysis_${analysisResult.id}`, JSON.stringify(analysisResult));
      // Navigate to the report page
      setLocation(`/report?id=${analysisResult.id}`);
    }
  };

  const handleReAnalyze = () => {
    if (analysisResult) {
      analysisMutation.mutate({ url: analysisResult.url });
    }
  };

  return (
    <section className="min-h-screen relative overflow-hidden" data-testid="analyzer-page">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Real-Time Threat Detection
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Analyze any URL using advanced OSINT techniques. Get instant risk assessments powered by multiple security intelligence sources.
          </p>
          <p className="text-sm text-muted-foreground mb-12">
            🔒 We never store your data on our servers—only in your browser.
          </p>

          {/* Analysis Tabs */}
          <div className="max-w-4xl mx-auto mb-8">
            <Tabs defaultValue="single" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="single" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Single URL
                </TabsTrigger>
                <TabsTrigger value="bulk" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Bulk Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="single">
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <Form {...form}>
                      <form onSubmit={(e) => {
                        console.log("Form submit event triggered");
                        console.log("Form values:", form.getValues());
                        console.log("Form errors:", form.formState.errors);
                        e.preventDefault();
                        form.handleSubmit(onSubmit)(e);
                      }} className="flex flex-col sm:flex-row gap-4">
                        <FormField
                          control={form.control}
                          name="url"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    placeholder="Enter URL to analyze (e.g., https://example.com)"
                                    className="pl-12 h-12"
                                    data-testid="input-url"
                                    {...field}
                                  />
                                  <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          size="lg"
                          className="px-8 h-12 font-semibold"
                          disabled={analysisMutation.isPending}
                          data-testid="button-analyze"
                        >
                          {analysisMutation.isPending ? (
                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          ) : (
                            <Search className="w-5 h-5 mr-2" />
                          )}
                          {analysisMutation.isPending ? "Analyzing..." : "Analyze"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bulk">
                <BulkAnalyzer />
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {analysisMutation.isPending && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              data-testid="loading-state"
            >
              <LoadingSkeleton />
            </motion.div>
          )}

          {analysisResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              data-testid="analysis-results"
            >
              {/* Risk Score Section */}
              <div className="grid lg:grid-cols-3 gap-8 mb-12">
                {/* Risk Meter */}
                <div className="lg:col-span-1">
                  <RiskMeter 
                    score={analysisResult.score}
                    verdict={analysisResult.verdict}
                    url={analysisResult.normalizedUrl}
                    timestamp={analysisResult.timestamp}
                  />
                </div>

                {/* Risk Reasoning */}
                <div className="lg:col-span-2">
                  <Card className="glass-card h-full">
                    <CardContent className="p-8">
                      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-primary" />
                        Risk Analysis Reasoning
                      </h3>
                      <div className="space-y-3 mb-8" data-testid="risk-reasons">
                        {analysisResult.reasons.map((reason, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-start gap-3 p-3 rounded-lg ${
                              reason.includes('+') 
                                ? 'bg-destructive/10' 
                                : reason.includes('-')
                                ? 'bg-success/10'
                                : 'bg-warning/10'
                            }`}
                          >
                            <Shield className={`w-5 h-5 mt-0.5 ${
                              reason.includes('+') 
                                ? 'text-destructive' 
                                : reason.includes('-')
                                ? 'text-success'
                                : 'text-warning'
                            }`} />
                            <span className="text-sm">{reason}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <Button 
                          onClick={handleViewReport}
                          data-testid="button-view-report"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Report
                        </Button>
                        <Button 
                          onClick={handleReAnalyze}
                          disabled={analysisMutation.isPending}
                          data-testid="button-reanalyze"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Re-Analyze
                        </Button>
                        <Button 
                          variant="secondary" 
                          onClick={handleSaveToHistory}
                          data-testid="button-save"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save to History
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleExportPDF}
                          data-testid="button-export"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Evidence Cards */}
              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-primary" />
                  OSINT Evidence Sources
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(analysisResult.sources).map(([sourceKey, sourceData], index) => (
                    <motion.div
                      key={sourceKey}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <EvidenceCard
                        sourceName={sourceKey}
                        sourceData={sourceData}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
