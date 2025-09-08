import type { AnalysisResult } from "@shared/schema";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    html2pdf: any;
  }
}

// Load html2pdf.js dynamically
const loadHtml2Pdf = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (window.html2pdf) {
      resolve(window.html2pdf);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => resolve(window.html2pdf);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const getLogoFromSettings = (): string => {
  // Logo upload feature has been removed
  return '';
};

const getOrganizationFromSettings = (): string => {
  try {
    const settings = localStorage.getItem('phishEyeSettings:v1');
    if (settings) {
      const parsed = JSON.parse(settings);
      return parsed.organizationName || 'Security Analysis Team';
    }
  } catch (error) {
    console.error('Failed to load organization from settings:', error);
  }
  return 'Security Analysis Team';
};

const createPdfContent = (analysis: AnalysisResult): string => {
  const logo = getLogoFromSettings();
  const organization = getOrganizationFromSettings();
  const timestamp = new Date(analysis.timestamp).toLocaleString();
  
  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "Safe": return "#10b981";
      case "Warning": return "#f59e0b";
      case "High Risk": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const verdictColor = getVerdictColor(analysis.verdict);

  const sourceNames: Record<string, string> = {
    whoisRdap: "WHOIS/RDAP",
    virustotal: "VirusTotal",
    urlscan: "URLScan.io",
    googleSafeBrowsing: "Google Safe Browsing",
    certificateTransparency: "Certificate Transparency",
    dnsAnalysis: "DNS Analysis"
  };

  const sourcesTable = Object.entries(analysis.sources || {})
    .map(([key, data]) => {
      const name = sourceNames[key] || key;
      const status = data.status === 'success' ? '✓ Success' : 
                    data.status === 'error' ? '✗ Error' : '⏱ Timeout';
      const statusColor = data.status === 'success' ? '#10b981' : 
                         data.status === 'error' ? '#ef4444' : '#f59e0b';
      
      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: ${statusColor};">${status}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 12px;">
            ${data.status === 'success' ? 'Analysis completed' : data.error || 'Request timeout'}
          </td>
        </tr>
      `;
    }).join('');

  const reasonsList = analysis.reasons.map(reason => 
    `<li style="margin-bottom: 8px; line-height: 1.4;">${reason}</li>`
  ).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>PhishEye Security Analysis Report</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 20px;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .logo {
          max-height: 40px;
          max-width: 150px;
        }
        .org-name {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }
        .generated-by {
          font-size: 12px;
          color: #6b7280;
          text-align: right;
        }
        .title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 30px;
          color: #1f2937;
          text-align: center;
        }
        .risk-summary {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
          text-align: center;
        }
        .risk-score {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 10px;
          color: ${verdictColor};
        }
        .risk-verdict {
          font-size: 18px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 20px;
          display: inline-block;
          background: ${verdictColor}20;
          color: ${verdictColor};
          margin-bottom: 15px;
        }
        .url-info {
          background: #f1f5f9;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 15px;
          word-break: break-all;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
          color: #1f2937;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 5px;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .table th {
          background: #f8fafc;
          padding: 10px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #e5e7eb;
        }
        .reasons-list {
          padding-left: 20px;
          margin: 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
          color: #6b7280;
          text-align: center;
        }
        .meta-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .meta-item {
          background: #f8fafc;
          padding: 10px;
          border-radius: 6px;
        }
        .meta-label {
          font-weight: 600;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        .meta-value {
          font-size: 14px;
          color: #1f2937;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-section">
          ${logo ? `<img src="${logo}" alt="Logo" class="logo">` : ''}
          <div class="org-name">${organization}</div>
        </div>
        <div class="generated-by">
          Generated by PhishEye<br>
          ${timestamp}
        </div>
      </div>

      <h1 class="title">URL Security Analysis Report</h1>

      <div class="risk-summary">
        <div class="risk-score">${analysis.score}</div>
        <div class="risk-verdict">${analysis.verdict}</div>
        <div class="url-info">
          <strong>Analyzed URL:</strong> ${analysis.normalizedUrl}
        </div>
        <div class="meta-info">
          <div class="meta-item">
            <div class="meta-label">ANALYSIS ID</div>
            <div class="meta-value">${analysis.id}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">ANALYSIS TIME</div>
            <div class="meta-value">${analysis.analysisTime}ms</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Risk Analysis Reasoning</h2>
        <ul class="reasons-list">
          ${reasonsList}
        </ul>
      </div>

      <div class="section">
        <h2 class="section-title">OSINT Sources Summary</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            ${sourcesTable}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p><strong>Disclaimer:</strong> This report is generated from public OSINT sources and is for informational purposes only. 
        Results should not be the sole basis for security decisions. False positives and negatives are possible with automated analysis.</p>
        <p>Report generated at ${timestamp} | PhishEye Security Analysis Framework</p>
      </div>
    </body>
    </html>
  `;
};

const createFallbackPdfContent = (analysis: AnalysisResult): string => {
  const timestamp = new Date(analysis.timestamp).toLocaleString();
  
  const sourceNames: Record<string, string> = {
    whoisRdap: "WHOIS/RDAP",
    virustotal: "VirusTotal",
    urlscan: "URLScan.io",
    googleSafeBrowsing: "Google Safe Browsing",
    certificateTransparency: "Certificate Transparency",
    dnsAnalysis: "DNS Analysis"
  };

  const sourcesList = Object.entries(analysis.sources || {})
    .map(([key, data]) => {
      const name = sourceNames[key] || key;
      const status = data.status === 'success' ? '✓ Success' : 
                    data.status === 'error' ? '✗ Error' : '⏱ Timeout';
      return `${name}: ${status}`;
    }).join('\n');

  return `
PHISHEYE SECURITY ANALYSIS REPORT
================================

Generated: ${timestamp}
Analysis ID: ${analysis.id}
Analyzed URL: ${analysis.normalizedUrl}
Analysis Time: ${analysis.analysisTime}ms

RISK ASSESSMENT
===============
Risk Score: ${analysis.score}
Verdict: ${analysis.verdict}

REASONING
=========
${analysis.reasons.map(reason => `• ${reason}`).join('\n')}

OSINT SOURCES SUMMARY
====================
${sourcesList}

DISCLAIMER
==========
This report is generated from public OSINT sources and is for informational purposes only. 
Results should not be the sole basis for security decisions. False positives and negatives 
are possible with automated analysis.

Report generated at ${timestamp} | PhishEye Security Analysis Framework
`;
};

export async function exportToPDF(analysis: AnalysisResult): Promise<void> {
  try {
    // Show loading toast
    toast({
      title: "Generating PDF",
      description: "Creating your security analysis report...",
    });

    // Load html2pdf library
    const html2pdf = await loadHtml2Pdf();
    
    // Debug: Check analysis object structure
    console.log('Analysis object:', {
      id: analysis.id,
      url: analysis.normalizedUrl,
      score: analysis.score,
      verdict: analysis.verdict,
      reasons: analysis.reasons?.length,
      sources: Object.keys(analysis.sources || {})
    });
    
    // Create PDF content
    const htmlContent = createPdfContent(analysis);
    console.log('Generated HTML content length:', htmlContent.length);
    
    // Try a different approach - use the HTML string directly
    const options = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `phisheye-report-${new URL(analysis.normalizedUrl).hostname}-${new Date(analysis.timestamp).toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 1.2,
        useCORS: true,
        letterRendering: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait'
      }
    };

    console.log('Starting PDF generation with direct HTML...');
    console.log('HTML preview:', htmlContent.substring(0, 1000));
    
    // Try using a different approach - create a new window
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use the new window's document for PDF generation
      await html2pdf().set(options).from(newWindow.document.body).save();
      
      newWindow.close();
    } else {
      // Fallback to direct HTML
      await html2pdf().set(options).from(htmlContent).save();
    }
    
    console.log('PDF generation completed');

    toast({
      title: "PDF Generated",
      description: "Your security analysis report has been downloaded.",
    });

  } catch (error) {
    console.error('PDF export failed:', error);
    
    // Try a simpler approach first
    try {
      console.log('Trying simpler PDF approach...');
      
      // Create a very simple HTML structure
      const simpleHtml = `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            .section { margin: 20px 0; }
            .url { background: #f5f5f5; padding: 10px; margin: 10px 0; }
            .verdict { font-size: 24px; font-weight: bold; color: #e74c3c; }
            .score { font-size: 18px; color: #666; }
          </style>
        </head>
        <body>
          <h1>PhishEye Security Analysis Report</h1>
          <div class="section">
            <div class="url"><strong>URL:</strong> ${analysis.normalizedUrl}</div>
            <div class="verdict">Verdict: ${analysis.verdict}</div>
            <div class="score">Risk Score: ${analysis.score}</div>
          </div>
          <div class="section">
            <h2>Analysis Reasons:</h2>
            <ul>
              ${analysis.reasons.map(reason => `<li>${reason}</li>`).join('')}
            </ul>
          </div>
          <div class="section">
            <h2>OSINT Sources:</h2>
            ${Object.entries(analysis.sources || {}).map(([key, data]) => 
              `<div><strong>${key}:</strong> ${data.status === 'success' ? '✓ Success' : '✗ Error'}</div>`
            ).join('')}
          </div>
        </body>
        </html>
      `;
      
      // Try with the simple HTML
      await html2pdf().set({
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `phisheye-report-${new URL(analysis.normalizedUrl).hostname}-${new Date(analysis.timestamp).toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 1, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      }).from(simpleHtml).save();
      
      toast({
        title: "PDF Generated",
        description: "Your security analysis report has been downloaded.",
      });
      
    } catch (simpleError) {
      console.error('Simple PDF approach also failed:', simpleError);
      
      // Final fallback: Create a simple text-based report
      try {
        const fallbackContent = createFallbackPdfContent(analysis);
        const blob = new Blob([fallbackContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `phisheye-report-${new URL(analysis.normalizedUrl).hostname}-${new Date(analysis.timestamp).toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Text Report Generated",
          description: "PDF generation failed, but a text report has been downloaded.",
          variant: "default",
        });
      } catch (fallbackError) {
        console.error('Fallback export also failed:', fallbackError);
        toast({
          title: "Export Failed",
          description: "Failed to generate any report. Please try again.",
          variant: "destructive",
        });
      }
    }
  }
}

export function exportHistoryToPDF(entries: any[]): Promise<void> {
  // This would be a simplified version for bulk export
  // For now, we'll just show a toast
  toast({
    title: "Bulk PDF Export",
    description: "Bulk PDF export functionality would be implemented here.",
  });
  return Promise.resolve();
}
