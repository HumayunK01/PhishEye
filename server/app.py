#!/usr/bin/env python3

import sys
import json
import os
from dotenv import load_dotenv
from services.osint import OSINTAnalyzer
from services.risk_scorer import RiskScorer

# Load environment variables from .env file
load_dotenv()

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python app.py analyze <url>"}))
        sys.exit(1)
    
    command = sys.argv[1]
    url = sys.argv[2]
    
    if command != "analyze":
        print(json.dumps({"error": "Unknown command"}))
        sys.exit(1)
    
    try:
        # Initialize analyzers
        osint_analyzer = OSINTAnalyzer()
        risk_scorer = RiskScorer()
        
        # Perform OSINT analysis
        analysis_data = osint_analyzer.analyze_url(url)
        
        # Calculate risk score
        score, verdict, reasons = risk_scorer.calculate_risk_score(analysis_data)
        
        # Prepare final response
        timestamp_clean = analysis_data['timestamp'].replace(':', '').replace('-', '').replace('T', '').replace('.', '')
        result = {
            "id": f"analysis_{timestamp_clean[:16]}",
            "url": url,
            "normalizedUrl": analysis_data['normalizedUrl'],
            "timestamp": analysis_data['timestamp'],
            "score": score,
            "verdict": verdict,
            "reasons": reasons,
            "sources": analysis_data['sources'],
            "analysisTime": analysis_data['analysisTime']
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            "error": "Analysis failed",
            "message": str(e),
            "url": url,
            "timestamp": "2024-01-01T00:00:00.000Z"
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    main()
