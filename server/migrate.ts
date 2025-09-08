#!/usr/bin/env tsx

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { historyEntries, analysisResults } from "@shared/db-schema";
import { sql } from "drizzle-orm";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env file
config({ path: resolve(process.cwd(), '.env') });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is required");
  console.error("Make sure you have a .env file with DATABASE_URL set");
  process.exit(1);
}

const client = neon(process.env.DATABASE_URL);
const db = drizzle(client);

async function migrate() {
  try {
    console.log("Starting database migration...");

    // Create history_entries table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS history_entries (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        date TIMESTAMP NOT NULL,
        score INTEGER NOT NULL,
        verdict TEXT CHECK (verdict IN ('Safe', 'Warning', 'High Risk')) NOT NULL,
        snapshot JSONB NOT NULL,
        full_analysis JSONB,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // Create analysis_results table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS analysis_results (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        normalized_url TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        score INTEGER NOT NULL,
        verdict TEXT CHECK (verdict IN ('Safe', 'Warning', 'High Risk')) NOT NULL,
        reasons JSONB NOT NULL,
        sources JSONB NOT NULL,
        analysis_time INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // Create indexes for better performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_history_entries_date ON history_entries(date DESC);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_history_entries_verdict ON history_entries(verdict);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_analysis_results_url ON analysis_results(url);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_analysis_results_timestamp ON analysis_results(timestamp DESC);
    `);

    console.log("✅ Database migration completed successfully!");
    console.log("Tables created:");
    console.log("  - history_entries");
    console.log("  - analysis_results");
    console.log("Indexes created for optimal performance");

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
