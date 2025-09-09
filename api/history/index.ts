import type { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { historyEntries, type HistoryEntry, type NewHistoryEntry } from "../../shared/db-schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), '.env') });

if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not found - database features will be disabled");
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
class HistoryService {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const entries = await HistoryService.getEntries(limit, offset);
      res.json(entries);
    } else if (req.method === 'POST') {
      const { historyEntrySchema } = await import("../../shared/schema");
      const validatedData = historyEntrySchema.parse(req.body);
      
      // Convert date string to Date object
      const entryData = {
        ...validatedData,
        date: new Date(validatedData.date),
      };
      
      const entry = await HistoryService.createEntry(entryData);
      res.status(201).json(entry);
    } else if (req.method === 'DELETE') {
      const deletedCount = await HistoryService.clearAllEntries();
      res.json({ 
        message: "All history entries deleted successfully",
        deletedCount 
      });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('History API error:', error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}
