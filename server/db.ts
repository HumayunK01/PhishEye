import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { historyEntries, analysisResults, type HistoryEntry, type NewHistoryEntry, type AnalysisResult, type NewAnalysisResult } from "@shared/db-schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env file
config({ path: resolve(process.cwd(), '.env') });

if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not found - database features will be disabled");
  console.warn("   Run 'node setup-database-enhanced.js' to set up the database");
}

// Initialize database connection only if DATABASE_URL is available
let sql, db;

if (process.env.DATABASE_URL) {
  try {
    sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql);
  } catch (error) {
    console.error("❌ Failed to initialize database connection:", error);
    console.warn("   Database features will be disabled");
  }
} else {
  console.warn("⚠️  No DATABASE_URL provided - database features disabled");
}

// History operations
export class HistoryService {
  private static checkDatabase() {
    if (!db) {
      throw new Error("Database not available - please set up DATABASE_URL");
    }
  }

  static async createEntry(entry: NewHistoryEntry): Promise<HistoryEntry> {
    this.checkDatabase();
    
    try {
      const [newEntry] = await db.insert(historyEntries).values(entry).returning();
      
      if (!newEntry) {
        throw new Error("Failed to create entry - no data returned");
      }
      
      return newEntry;
    } catch (error) {
      console.error('Database create entry error:', error);
      throw error;
    }
  }

  static async getEntries(limit: number = 50, offset: number = 0): Promise<HistoryEntry[]> {
    this.checkDatabase();
    return await db
      .select()
      .from(historyEntries)
      .orderBy(desc(historyEntries.createdAt))
      .limit(limit)
      .offset(offset);
  }

  static async getEntryById(id: string): Promise<HistoryEntry | null> {
    this.checkDatabase();
    const [entry] = await db
      .select()
      .from(historyEntries)
      .where(eq(historyEntries.id, id))
      .limit(1);
    return entry || null;
  }

  static async updateEntry(id: string, updates: Partial<NewHistoryEntry>): Promise<HistoryEntry | null> {
    this.checkDatabase();
    const [updatedEntry] = await db
      .update(historyEntries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(historyEntries.id, id))
      .returning();
    return updatedEntry || null;
  }

  static async deleteEntry(id: string): Promise<boolean> {
    this.checkDatabase();
    const result = await db
      .delete(historyEntries)
      .where(eq(historyEntries.id, id));
    return result.rowCount > 0;
  }

  static async getEntriesByDateRange(startDate: Date, endDate: Date): Promise<HistoryEntry[]> {
    this.checkDatabase();
    return await db
      .select()
      .from(historyEntries)
      .where(
        and(
          gte(historyEntries.date, startDate),
          lte(historyEntries.date, endDate)
        )
      )
      .orderBy(desc(historyEntries.createdAt));
  }

  static async getEntriesByVerdict(verdict: "Safe" | "Warning" | "High Risk"): Promise<HistoryEntry[]> {
    this.checkDatabase();
    return await db
      .select()
      .from(historyEntries)
      .where(eq(historyEntries.verdict, verdict))
      .orderBy(desc(historyEntries.createdAt));
  }

  static async clearAllEntries(): Promise<number> {
    this.checkDatabase();
    const result = await db.delete(historyEntries);
    return result.rowCount;
  }

  static async getEntryCount(): Promise<number> {
    this.checkDatabase();
    const result = await db
      .select({ count: historyEntries.id })
      .from(historyEntries);
    return result.length;
  }
}

// Analysis results operations
export class AnalysisService {
  private static checkDatabase() {
    if (!db) {
      throw new Error("Database not available - please set up DATABASE_URL");
    }
  }

  static async createResult(result: NewAnalysisResult): Promise<AnalysisResult> {
    this.checkDatabase();
    const [newResult] = await db.insert(analysisResults).values(result).returning();
    return newResult;
  }

  static async getResultById(id: string): Promise<AnalysisResult | null> {
    this.checkDatabase();
    const [result] = await db
      .select()
      .from(analysisResults)
      .where(eq(analysisResults.id, id))
      .limit(1);
    return result || null;
  }

  static async getResultByUrl(url: string): Promise<AnalysisResult | null> {
    this.checkDatabase();
    const [result] = await db
      .select()
      .from(analysisResults)
      .where(eq(analysisResults.url, url))
      .orderBy(desc(analysisResults.createdAt))
      .limit(1);
    return result || null;
  }
}
