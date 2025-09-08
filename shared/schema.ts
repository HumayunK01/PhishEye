import { z } from "zod";

// Analysis result schema
export const analysisResultSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  normalizedUrl: z.string().url(),
  timestamp: z.string(),
  score: z.number().min(0).max(100),
  verdict: z.enum(["Safe", "Warning", "High Risk"]),
  reasons: z.array(z.string()),
  sources: z.object({
    whoisRdap: z.object({
      status: z.enum(["success", "error", "timeout"]),
      data: z.any().optional(),
      error: z.string().optional(),
    }),
    virustotal: z.object({
      status: z.enum(["success", "error", "timeout"]),
      data: z.any().optional(),
      error: z.string().optional(),
    }),
    urlscan: z.object({
      status: z.enum(["success", "error", "timeout"]),
      data: z.any().optional(),
      error: z.string().optional(),
    }),
    googleSafeBrowsing: z.object({
      status: z.enum(["success", "error", "timeout"]),
      data: z.any().optional(),
      error: z.string().optional(),
    }),
    certificateTransparency: z.object({
      status: z.enum(["success", "error", "timeout"]),
      data: z.any().optional(),
      error: z.string().optional(),
    }),
    dnsAnalysis: z.object({
      status: z.enum(["success", "error", "timeout"]),
      data: z.any().optional(),
      error: z.string().optional(),
    }),
  }),
  analysisTime: z.number(),
});

export const analyzeRequestSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export const historyEntrySchema = z.object({
  id: z.string(),
  url: z.string(),
  date: z.string(),
  score: z.number(),
  verdict: z.enum(["Safe", "Warning", "High Risk"]),
  snapshot: z.object({
    reasons: z.array(z.string()),
    brief: z.string(),
  }),
  // Store the full analysis data for report generation
  fullAnalysis: z.object({
    id: z.string(),
    url: z.string().url(),
    normalizedUrl: z.string().url(),
    timestamp: z.string(),
    score: z.number().min(0).max(100),
    verdict: z.enum(["Safe", "Warning", "High Risk"]),
    reasons: z.array(z.string()),
    sources: z.object({
      whoisRdap: z.object({
        status: z.enum(["success", "error", "timeout"]),
        data: z.any().optional(),
        error: z.string().optional(),
      }),
      virustotal: z.object({
        status: z.enum(["success", "error", "timeout"]),
        data: z.any().optional(),
        error: z.string().optional(),
      }),
      urlscan: z.object({
        status: z.enum(["success", "error", "timeout"]),
        data: z.any().optional(),
        error: z.string().optional(),
      }),
      googleSafeBrowsing: z.object({
        status: z.enum(["success", "error", "timeout"]),
        data: z.any().optional(),
        error: z.string().optional(),
      }),
      certificateTransparency: z.object({
        status: z.enum(["success", "error", "timeout"]),
        data: z.any().optional(),
        error: z.string().optional(),
      }),
      dnsAnalysis: z.object({
        status: z.enum(["success", "error", "timeout"]),
        data: z.any().optional(),
        error: z.string().optional(),
      }),
    }),
    analysisTime: z.number(),
  }).optional(),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;
export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
export type HistoryEntry = z.infer<typeof historyEntrySchema>;

// Settings schema
export const settingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("dark"),
  maxHistoryEntries: z.number().min(10).max(1000).default(50),
  autoAnalyze: z.boolean().default(true),
  soundNotifications: z.boolean().default(false),
  reducedMotion: z.boolean().default(false),
  analysisTimeout: z.number().default(30),
  organizationName: z.string().optional(),
});

export type Settings = z.infer<typeof settingsSchema>;
