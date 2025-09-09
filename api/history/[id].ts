import type { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { historyEntries, type HistoryEntry, type NewHistoryEntry } from "@shared/db-schema";
import { eq } from "drizzle-orm";
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
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  try {
    if (req.method === 'GET') {
      const entry = await HistoryService.getEntryById(id);
      
      if (!entry) {
        return res.status(404).json({ message: "History entry not found" });
      }
      
      res.json(entry);
    } else if (req.method === 'PUT') {
      const updates = req.body;
      
      // Convert date string to Date object if present
      if (updates.date && typeof updates.date === 'string') {
        updates.date = new Date(updates.date);
      }
      
      const updatedEntry = await HistoryService.updateEntry(id, updates);
      
      if (!updatedEntry) {
        return res.status(404).json({ message: "History entry not found" });
      }
      
      res.json(updatedEntry);
    } else if (req.method === 'DELETE') {
      const deleted = await HistoryService.deleteEntry(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "History entry not found" });
      }
      
      res.json({ message: "History entry deleted successfully" });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('History entry API error:', error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}
