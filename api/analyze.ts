import type { VercelRequest, VercelResponse } from '@vercel/node';
import { spawn } from 'child_process';
import path from 'path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    // Call Python OSINT analysis service
    const pythonProcess = spawn('python', [
      path.join(process.cwd(), 'server', 'app.py'),
      'analyze',
      url
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
      if (code !== 0) {
        console.error('Python process error:', error);
        return res.status(500).json({ 
          message: "Analysis failed", 
          error: error || "Unknown error occurred" 
        });
      }

      try {
        const analysisResult = JSON.parse(result);
        res.json(analysisResult);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        res.status(500).json({ 
          message: "Failed to parse analysis results",
          error: "Invalid response format"
        });
      }
    });

    // Set timeout for analysis
    setTimeout(() => {
      pythonProcess.kill();
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
}
