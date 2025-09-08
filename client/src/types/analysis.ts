// Additional type definitions for analysis functionality

export interface OSINTSource {
  name: string;
  description: string;
  icon: string;
  url: string;
  status: 'success' | 'error' | 'timeout' | 'pending';
  data?: any;
  error?: string;
  lastChecked?: string;
}

export interface AnalysisProgress {
  total: number;
  completed: number;
  current: string;
  sources: {
    [key: string]: 'pending' | 'running' | 'completed' | 'error';
  };
}

export interface RiskMeterData {
  score: number;
  maxScore: number;
  segments: {
    label: string;
    value: number;
    color: string;
    range: [number, number];
  }[];
}

export interface EvidenceDetails {
  source: string;
  status: 'success' | 'error' | 'timeout';
  summary: string;
  details: {
    label: string;
    value: string | number;
    status?: 'positive' | 'negative' | 'neutral';
  }[];
  rawData?: any;
  lastUpdated: string;
}

export interface AnalysisSettings {
  timeout: number;
  retryAttempts: number;
  sources: string[];
  includeScreenshots: boolean;
  detailedReporting: boolean;
}

export interface PDFExportOptions {
  includeRawData: boolean;
  includeScreenshots: boolean;
  includeBranding: boolean;
  organizationName?: string;
  logoUrl?: string;
  customFooter?: string;
}

export interface HistoryFilter {
  search?: string;
  riskLevel?: 'all' | 'safe' | 'warning' | 'high-risk';
  dateRange?: 'all' | '24h' | '7d' | '30d';
  sources?: string[];
}

export interface AnalysisStats {
  totalAnalyses: number;
  averageScore: number;
  riskDistribution: {
    safe: number;
    warning: number;
    highRisk: number;
  };
  topDomains: {
    domain: string;
    count: number;
    avgScore: number;
  }[];
  sourceReliability: {
    source: string;
    successRate: number;
    avgResponseTime: number;
  }[];
}

export interface URLValidation {
  isValid: boolean;
  normalizedUrl: string;
  domain: string;
  subdomain?: string;
  path?: string;
  errors: string[];
  warnings: string[];
}

export interface ComparisonAnalysis {
  urls: string[];
  results: {
    url: string;
    score: number;
    verdict: string;
    timestamp: string;
  }[];
  summary: {
    highestRisk: string;
    lowestRisk: string;
    averageScore: number;
    commonThreats: string[];
  };
}

// Utility type for analysis state management
export type AnalysisState = 
  | { status: 'idle' }
  | { status: 'analyzing'; progress: AnalysisProgress }
  | { status: 'completed'; result: any }
  | { status: 'error'; error: string };

// Event types for analysis lifecycle
export type AnalysisEvent = 
  | { type: 'START_ANALYSIS'; payload: { url: string } }
  | { type: 'UPDATE_PROGRESS'; payload: AnalysisProgress }
  | { type: 'SOURCE_COMPLETED'; payload: { source: string; result: any } }
  | { type: 'ANALYSIS_COMPLETED'; payload: any }
  | { type: 'ANALYSIS_ERROR'; payload: { error: string } }
  | { type: 'RESET_ANALYSIS' };
