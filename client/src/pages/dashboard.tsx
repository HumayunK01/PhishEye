import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Globe, 
  Search, 
  History, 
  Settings,
  Activity,
  Zap,
  Eye,
  BarChart3,
  Target,
  Users,
  Database
} from "lucide-react";
import { getHistory } from "@/lib/history-manager-db";

interface DashboardStats {
  totalAnalyses: number;
  highRiskDetected: number;
  lowRiskDetected: number;
  averageScore: number;
  recentActivity: number;
  threatLevel: 'low' | 'medium' | 'high';
}

interface RecentThreat {
  id: string;
  url: string;
  score: number;
  verdict: string;
  timestamp: string;
  source: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAnalyses: 0,
    highRiskDetected: 0,
    lowRiskDetected: 0,
    averageScore: 0,
    recentActivity: 0,
    threatLevel: 'low'
  });

  const { data: historyData } = useQuery({
    queryKey: ['history'],
    queryFn: () => getHistory(50, 0), // Get up to 50 recent entries
    staleTime: 30000, // 30 seconds
  });

  const { data: apiStatus } = useQuery({
    queryKey: ['api-status'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/health');
        return response.ok;
      } catch {
        return false;
      }
    },
    refetchInterval: 30000, // Check every 30 seconds
  });

  useEffect(() => {
    if (historyData) {
      const total = historyData.length;
      const highRisk = historyData.filter(item => item.score >= 70).length;
      const lowRisk = historyData.filter(item => item.score <= 30).length;
      const avgScore = total > 0 ? historyData.reduce((sum, item) => sum + item.score, 0) / total : 0;
      const recent = historyData.filter(item => {
        const itemDate = new Date(item.date);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return itemDate > dayAgo;
      }).length;

      let threatLevel: 'low' | 'medium' | 'high' = 'low';
      if (highRisk / total > 0.3) threatLevel = 'high';
      else if (highRisk / total > 0.1) threatLevel = 'medium';

      setStats({
        totalAnalyses: total,
        highRiskDetected: highRisk,
        lowRiskDetected: lowRisk,
        averageScore: Math.round(avgScore),
        recentActivity: recent,
        threatLevel
      });
    }
  }, [historyData]);

  const recentThreats: RecentThreat[] = historyData?.slice(0, 10).map(item => ({
    id: item.id,
    url: item.url,
    score: item.score,
    verdict: item.verdict,
    timestamp: item.date,
    source: 'OSINT Analysis'
  })) || [];

  const quickActions = [
    {
      title: "Analyze URL",
      description: "Check a single URL for threats",
      icon: Search,
      href: "/analyzer",
      color: "bg-blue-500",
    },
    {
      title: "Bulk Analysis",
      description: "Analyze multiple URLs at once",
      icon: Globe,
      href: "/analyzer?mode=bulk",
      color: "bg-green-500",
    },
    {
      title: "View History",
      description: "Browse your analysis history",
      icon: History,
      href: "/history",
      color: "bg-purple-500",
    },
    {
      title: "Settings",
      description: "Configure your preferences",
      icon: Settings,
      href: "/settings",
      color: "bg-orange-500",
    },
  ];

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500 bg-red-100';
      case 'medium': return 'text-yellow-500 bg-yellow-100';
      default: return 'text-green-500 bg-green-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Security Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor threats and manage your security analysis
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${apiStatus ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-muted-foreground">
                  API {apiStatus ? 'Online' : 'Offline'}
                </span>
              </div>
              <Badge variant={stats.threatLevel === 'high' ? 'destructive' : stats.threatLevel === 'medium' ? 'secondary' : 'default'}>
                Threat Level: {stats.threatLevel.toUpperCase()}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Analyses</p>
                    <p className="text-2xl font-bold">{stats.totalAnalyses}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">High Risk Detected</p>
                    <p className="text-2xl font-bold text-red-500">{stats.highRiskDetected}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Safe URLs</p>
                    <p className="text-2xl font-bold text-green-500">{stats.lowRiskDetected}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Risk Score</p>
                    <p className="text-2xl font-bold">{stats.averageScore}/100</p>
                  </div>
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link key={action.title} href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        <action.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{action.title}</p>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity & Threats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <Tabs defaultValue="recent" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="recent">Recent Activity</TabsTrigger>
                <TabsTrigger value="threats">Threat Intelligence</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recent" className="space-y-4">
                <Card className="glass-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Analyses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {recentThreats.length > 0 ? (
                      <div className="space-y-3 min-h-[200px]">
                        {recentThreats.map((threat, index) => (
                          <motion.div
                            key={threat.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                threat.score >= 70 ? 'bg-red-500' : 
                                threat.score >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                              }`} />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium truncate text-sm">{threat.url}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(threat.timestamp).toLocaleDateString()} at {new Date(threat.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge 
                                variant={threat.score >= 70 ? 'destructive' : threat.score >= 40 ? 'secondary' : 'default'}
                                className="text-xs"
                              >
                                {threat.score}/100
                              </Badge>
                              <Link href={`/report?id=${threat.id}`}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No recent analyses found</p>
                        <p className="text-sm">Start by analyzing a URL</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="threats" className="space-y-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Threat Intelligence Feed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="font-medium text-red-800">High Risk Pattern Detected</span>
                        </div>
                        <p className="text-sm text-red-700">
                          Phishing campaigns targeting financial institutions have increased by 23% this week.
                        </p>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium text-yellow-800">New Threat Vector</span>
                        </div>
                        <p className="text-sm text-yellow-700">
                          Social engineering attacks using AI-generated content are on the rise.
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-green-800">Security Update</span>
                        </div>
                        <p className="text-sm text-green-700">
                          OSINT database updated with 1,247 new threat indicators.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
