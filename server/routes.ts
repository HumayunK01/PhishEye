import type { Express } from "express";
import { createServer, type Server } from "http";
import { analyzeRequestSchema, historyEntrySchema } from "@shared/schema";
import { spawn } from "child_process";
import path from "path";
import { HistoryService, AnalysisService } from "./db";

export async function registerRoutes(app: Express): Promise<Server> {
  // URL Analysis endpoint
  app.post("/api/analyze", async (req, res) => {
    let responseSent = false;
    
    try {
      const validatedData = analyzeRequestSchema.parse(req.body);
      
      // Call Python OSINT analysis service
      const pythonProcess = spawn('python', [
        path.join(process.cwd(), 'server', 'app.py'),
        'analyze',
        validatedData.url
      ]);

      let result = '';
      let error = '';

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (responseSent) return; // Prevent multiple responses
        
        if (code !== 0) {
          console.error('Python process error:', error);
          responseSent = true;
          return res.status(500).json({ 
            message: "Analysis failed", 
            error: error || "Unknown error occurred" 
          });
        }

        try {
          const analysisResult = JSON.parse(result);
          responseSent = true;
          res.json(analysisResult);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          responseSent = true;
          res.status(500).json({ 
            message: "Failed to parse analysis results",
            error: "Invalid response format"
          });
        }
      });

      // Set timeout for analysis
      setTimeout(() => {
        if (responseSent) return; // Prevent multiple responses
        
        pythonProcess.kill();
        responseSent = true;
        res.status(408).json({ 
          message: "Analysis timeout", 
          error: "Request took too long to complete" 
        });
      }, 60000); // 60 second timeout

    } catch (error) {
      console.error('Analysis request error:', error);
      res.status(400).json({ 
        message: "Invalid request", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // History endpoints
  app.get("/api/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const entries = await HistoryService.getEntries(limit, offset);
      res.json(entries);
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({ 
        message: "Failed to fetch history", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/history/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await HistoryService.getEntryById(id);
      
      if (!entry) {
        return res.status(404).json({ message: "History entry not found" });
      }
      
      res.json(entry);
    } catch (error) {
      console.error('Get history entry error:', error);
      res.status(500).json({ 
        message: "Failed to fetch history entry", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.post("/api/history", async (req, res) => {
    try {
      const validatedData = historyEntrySchema.parse(req.body);
      
      // Convert date string to Date object
      const entryData = {
        ...validatedData,
        date: new Date(validatedData.date),
      };
      
      const entry = await HistoryService.createEntry(entryData);
      res.status(201).json(entry);
    } catch (error) {
      console.error('Create history entry error:', error);
      res.status(400).json({ 
        message: "Failed to create history entry", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.put("/api/history/:id", async (req, res) => {
    try {
      const { id } = req.params;
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
    } catch (error) {
      console.error('Update history entry error:', error);
      res.status(500).json({ 
        message: "Failed to update history entry", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.delete("/api/history/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await HistoryService.deleteEntry(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "History entry not found" });
      }
      
      res.json({ message: "History entry deleted successfully" });
    } catch (error) {
      console.error('Delete history entry error:', error);
      res.status(500).json({ 
        message: "Failed to delete history entry", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.delete("/api/history", async (req, res) => {
    try {
      const deletedCount = await HistoryService.clearAllEntries();
      res.json({ 
        message: "All history entries deleted successfully",
        deletedCount 
      });
    } catch (error) {
      console.error('Clear history error:', error);
      res.status(500).json({ 
        message: "Failed to clear history", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/history/stats", async (req, res) => {
    try {
      const totalCount = await HistoryService.getEntryCount();
      const safeEntries = await HistoryService.getEntriesByVerdict("Safe");
      const warningEntries = await HistoryService.getEntriesByVerdict("Warning");
      const riskEntries = await HistoryService.getEntriesByVerdict("High Risk");
      
      res.json({
        totalEntries: totalCount,
        safeCount: safeEntries.length,
        warningCount: warningEntries.length,
        riskCount: riskEntries.length,
      });
    } catch (error) {
      console.error('Get history stats error:', error);
      res.status(500).json({ 
        message: "Failed to fetch history statistics", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
