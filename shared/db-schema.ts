import { pgTable, text, integer, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";

// History entries table
export const historyEntries = pgTable("history_entries", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  date: timestamp("date").notNull(),
  score: integer("score").notNull(),
  verdict: text("verdict", { enum: ["Safe", "Warning", "High Risk"] }).notNull(),
  snapshot: jsonb("snapshot").notNull(),
  fullAnalysis: jsonb("full_analysis"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Analysis results table (for caching)
export const analysisResults = pgTable("analysis_results", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  normalizedUrl: text("normalized_url").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  score: integer("score").notNull(),
  verdict: text("verdict", { enum: ["Safe", "Warning", "High Risk"] }).notNull(),
  reasons: jsonb("reasons").notNull(),
  sources: jsonb("sources").notNull(),
  analysisTime: integer("analysis_time").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type HistoryEntry = typeof historyEntries.$inferSelect;
export type NewHistoryEntry = typeof historyEntries.$inferInsert;
export type AnalysisResult = typeof analysisResults.$inferSelect;
export type NewAnalysisResult = typeof analysisResults.$inferInsert;
