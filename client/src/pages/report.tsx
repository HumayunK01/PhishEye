import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Calendar, 
  Clock, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Info,
  Eye,
  Search,
  Key,
  Server,
  ExternalLink,
  Copy,
  Check
} from "lucide-react";
import { exportToPDF } from "@/lib/pdf-export";
import type { AnalysisResult } from "@shared/schema";

export default function ReportPage() {
  const [, setLocation] = useLocation();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Get analysis data from localStorage or URL params
    const analysisId = new URLSearchParams(window.location.search).get('id');
    if (analysisId) {
      const stored = localStorage.getItem(`analysis_${analysisId}`);
      if (stored) {
        try {
          const analysisData = JSON.parse(stored);
          setAnalysis(analysisData);
        } catch (error) {
          console.error('Failed to parse analysis data:', error);
        }
      }
    }
    setLoading(false);
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "Safe": return "bg-green-100 text-green-800 border-green-200";
      case "Warning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "High Risk": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "Safe": return <CheckCircle className="w-4 h-4" />;
      case "Warning": return <AlertTriangle className="w-4 h-4" />;
      case "High Risk": return <XCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const sourceConfig = {
    whoisRdap: {
      name: "WHOIS/RDAP",
      description: "Domain registration information",
      icon: Info,
      color: "text-blue-600"
    },
    virustotal: {
      name: "VirusTotal",
      description: "Multi-engine malware scan",
      icon: Shield,
      color: "text-green-600"
    },
    urlscan: {
      name: "URLScan.io",
      description: "Behavioral analysis and screenshots",
      icon: Eye,
      color: "text-purple-600"
    },
    googleSafeBrowsing: {
      name: "Google Safe Browsing",
      description: "Threat detection and phishing protection",
      icon: Search,
      color: "text-orange-600"
    },
    certificateTransparency: {
      name: "Certificate Transparency",
      description: "SSL/TLS certificate analysis",
      icon: Key,
      color: "text-indigo-600"
    },
    dnsAnalysis: {
      name: "DNS Analysis",
      description: "Infrastructure and DNS record analysis",
      icon: Server,
      color: "text-cyan-600"
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatAnalysisTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Report Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The requested analysis report could not be found or is incomplete.
            </p>
            <Button onClick={() => setLocation('/history')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to History
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ensure sources object exists, even if empty
  const analysisWithSources = {
    ...analysis,
    sources: analysis.sources || {
      whoisRdap: { status: "timeout" as const, error: "Historical data not available - this entry was created before detailed source tracking was implemented" },
      virustotal: { status: "timeout" as const, error: "Historical data not available - this entry was created before detailed source tracking was implemented" },
      urlscan: { status: "timeout" as const, error: "Historical data not available - this entry was created before detailed source tracking was implemented" },
      googleSafeBrowsing: { status: "timeout" as const, error: "Historical data not available - this entry was created before detailed source tracking was implemented" },
      certificateTransparency: { status: "timeout" as const, error: "Historical data not available - this entry was created before detailed source tracking was implemented" },
      dnsAnalysis: { status: "timeout" as const, error: "Historical data not available - this entry was created before detailed source tracking was implemented" },
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => setLocation('/history')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to History
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(window.location.href)}
                className="flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Share'}
              </Button>
              <Button
                onClick={() => exportToPDF(analysisWithSources)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Security Analysis Report</h1>
            <p className="text-muted-foreground text-lg">
              Comprehensive threat assessment for
            </p>
            <div className="mt-4 p-4 bg-accent/10 rounded-lg border">
              <p className="font-mono text-sm break-all">{analysisWithSources.normalizedUrl || analysisWithSources.url}</p>
            </div>
          </div>
        </motion.div>

        {/* Risk Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass-card">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="text-6xl font-bold text-primary">
                    {analysisWithSources.score}
                  </div>
                  <div className="text-left">
                    <Badge className={`text-lg px-4 py-2 ${getVerdictColor(analysisWithSources.verdict)}`}>
                      {getVerdictIcon(analysisWithSources.verdict)}
                      <span className="ml-2">{analysisWithSources.verdict}</span>
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">Risk Score</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <Calendar className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Analysis Date</p>
                    <p className="font-medium">{formatTimestamp(analysisWithSources.timestamp)}</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Analysis Time</p>
                    <p className="font-medium">{formatAnalysisTime(analysisWithSources.analysisTime)}</p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Report ID</p>
                    <p className="font-mono text-xs">{analysisWithSources.id}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="reasons" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="reasons">Risk Analysis</TabsTrigger>
              <TabsTrigger value="sources">OSINT Sources</TabsTrigger>
              <TabsTrigger value="technical">Technical Details</TabsTrigger>
              <TabsTrigger value="raw">Raw Data</TabsTrigger>
            </TabsList>

            {/* Risk Analysis Tab */}
            <TabsContent value="reasons" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Risk Analysis Reasoning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(analysisWithSources.reasons || []).map((reason, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-accent/5 rounded-lg border"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary">{index + 1}</span>
                        </div>
                        <p className="text-sm leading-relaxed">{reason}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* OSINT Sources Tab */}
            <TabsContent value="sources" className="mt-6">
              <div className="grid gap-6">
                {Object.entries(analysisWithSources.sources || {}).map(([sourceKey, sourceData]) => {
                  const config = sourceConfig[sourceKey as keyof typeof sourceConfig];
                  const IconComponent = config?.icon || Shield;
                  
                  return (
                    <motion.div
                      key={sourceKey}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <IconComponent className={`w-6 h-6 ${config?.color}`} />
                              <div>
                                <CardTitle className="text-lg">{config?.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{config?.description}</p>
                              </div>
                            </div>
                            <Badge 
                              variant={
                                sourceData.status === 'success' ? 'default' : 
                                sourceData.status === 'timeout' ? 'secondary' : 
                                'destructive'
                              }
                              className="flex items-center gap-1"
                            >
                              {sourceData.status === 'success' ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : sourceData.status === 'timeout' ? (
                                <Clock className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              {sourceData.status === 'success' ? 'Success' : 
                               sourceData.status === 'timeout' ? 'Not Available' : 
                               'Failed'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {sourceData.status === 'success' && sourceData.data ? (
                            <div className="space-y-4">
                              <ScrollArea className="h-64 custom-scrollbar">
                                <pre className="text-xs text-muted-foreground p-4 bg-accent/5 rounded-lg">
                                  {JSON.stringify(sourceData.data, null, 2)}
                                </pre>
                              </ScrollArea>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              {sourceData.status === 'timeout' ? (
                                <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                              ) : (
                                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                              )}
                              <p className="text-muted-foreground">
                                {sourceData.error || 'Analysis failed for this source'}
                              </p>
                              {sourceData.status === 'timeout' && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  This analysis was performed before detailed source tracking was implemented.
                                </p>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Technical Details Tab */}
            <TabsContent value="technical" className="mt-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Metadata</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Analysis ID</p>
                        <p className="font-mono text-sm">{analysisWithSources.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Original URL</p>
                        <p className="font-mono text-sm break-all">{analysisWithSources.url}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Normalized URL</p>
                        <p className="font-mono text-sm break-all">{analysisWithSources.normalizedUrl || analysisWithSources.url}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Analysis Time</p>
                        <p className="text-sm">{formatAnalysisTime(analysisWithSources.analysisTime)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Source Status Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(analysisWithSources.sources || {}).map(([sourceKey, sourceData]) => {
                        const config = sourceConfig[sourceKey as keyof typeof sourceConfig];
                        return (
                          <div key={sourceKey} className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                            <div className="flex items-center gap-3">
                              <config.icon className="w-4 h-4" />
                              <span className="text-sm font-medium">{config.name}</span>
                            </div>
                            <Badge 
                              variant={sourceData.status === 'success' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {sourceData.status}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Raw Data Tab */}
            <TabsContent value="raw" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Analysis Data</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Raw JSON data from the analysis
                  </p>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 custom-scrollbar">
                    <pre className="text-xs text-muted-foreground p-4 bg-accent/5 rounded-lg">
                      {JSON.stringify(analysis, null, 2)}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
