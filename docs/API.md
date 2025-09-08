# PhishEye API Documentation

## Overview

The PhishEye API provides endpoints for URL analysis, threat detection, and system monitoring. All endpoints return JSON responses and follow RESTful conventions.

**Base URL**: `http://localhost:5000/api`

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible. Future versions may include API key authentication.

## Rate Limiting

- **Analysis endpoints**: 10 requests per minute per IP
- **Health endpoints**: 60 requests per minute per IP
- **Bulk analysis**: 1 request per minute per IP

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Endpoints

### Analysis

#### POST `/api/analyze`

Analyze a single URL for potential threats.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "analysis_1234567890",
    "url": "https://example.com",
    "normalizedUrl": "example.com",
    "score": 25,
    "verdict": "Safe",
    "timestamp": "2024-01-15T10:30:00Z",
    "reasons": [
      "Domain has valid SSL certificate",
      "No suspicious patterns detected",
      "Domain age is acceptable"
    ],
    "sources": {
      "virustotal": {
        "status": "clean",
        "lastScanned": "2024-01-15T09:00:00Z",
        "detections": 0,
        "totalScans": 65
      },
      "phishtank": {
        "status": "clean",
        "verified": true,
        "lastChecked": "2024-01-15T08:30:00Z"
      },
      "whois": {
        "registrar": "Example Registrar Inc.",
        "creationDate": "2020-01-15T00:00:00Z",
        "expirationDate": "2025-01-15T00:00:00Z",
        "nameservers": ["ns1.example.com", "ns2.example.com"]
      }
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid URL format
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Analysis failed

#### POST `/api/analyze/bulk`

Analyze multiple URLs in batch.

**Request Body:**
```json
{
  "urls": [
    "https://example1.com",
    "https://example2.com",
    "https://example3.com"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "batchId": "batch_1234567890",
    "totalUrls": 3,
    "completed": 3,
    "failed": 0,
    "results": [
      {
        "url": "https://example1.com",
        "status": "completed",
        "analysis": { ... }
      },
      {
        "url": "https://example2.com",
        "status": "completed",
        "analysis": { ... }
      },
      {
        "url": "https://example3.com",
        "status": "completed",
        "analysis": { ... }
      }
    ]
  }
}
```

### System

#### GET `/api/health`

Check API health and status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "timestamp": "2024-01-15T10:30:00Z",
    "uptime": 3600,
    "services": {
      "database": "healthy",
      "osint": "healthy",
      "cache": "healthy"
    }
  }
}
```

#### GET `/api/status`

Get detailed system status information.

**Response:**
```json
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "environment": "production",
    "uptime": 3600,
    "memory": {
      "used": "128MB",
      "total": "512MB",
      "percentage": 25
    },
    "requests": {
      "total": 1250,
      "successful": 1200,
      "failed": 50,
      "rate": "2.5/min"
    },
    "osint": {
      "virustotal": {
        "status": "active",
        "lastCheck": "2024-01-15T10:25:00Z",
        "quota": {
          "used": 45,
          "limit": 1000,
          "reset": "2024-01-16T00:00:00Z"
        }
      },
      "phishtank": {
        "status": "active",
        "lastCheck": "2024-01-15T10:20:00Z"
      }
    }
  }
}
```

### Monitoring

#### GET `/api/threats`

Get recent threat intelligence data.

**Query Parameters:**
- `limit` (optional): Number of threats to return (default: 10, max: 100)
- `severity` (optional): Filter by severity level (`low`, `medium`, `high`)
- `since` (optional): ISO timestamp to filter threats since

**Response:**
```json
{
  "success": true,
  "data": {
    "threats": [
      {
        "id": "threat_123",
        "type": "phishing",
        "severity": "high",
        "title": "Banking Phishing Campaign",
        "description": "New phishing campaign targeting major banks",
        "urls": ["https://fake-bank.com", "https://secure-bank.net"],
        "detectedAt": "2024-01-15T09:00:00Z",
        "sources": ["virustotal", "phishtank"],
        "affectedDomains": 15,
        "status": "active"
      }
    ],
    "total": 1,
    "hasMore": false
  }
}
```

#### GET `/api/stats`

Get analysis statistics.

**Query Parameters:**
- `period` (optional): Time period (`day`, `week`, `month`, `year`)
- `start` (optional): Start date (ISO format)
- `end` (optional): End date (ISO format)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "day",
    "totalAnalyses": 150,
    "highRisk": 12,
    "mediumRisk": 25,
    "lowRisk": 113,
    "averageScore": 35.5,
    "topThreats": [
      {
        "type": "phishing",
        "count": 8,
        "percentage": 5.3
      },
      {
        "type": "malware",
        "count": 4,
        "percentage": 2.7
      }
    ],
    "trends": {
      "analyses": "+15%",
      "threats": "+8%",
      "accuracy": "+2%"
    }
  }
}
```

## Data Models

### Analysis Result

```typescript
interface AnalysisResult {
  id: string;
  url: string;
  normalizedUrl: string;
  score: number; // 0-100
  verdict: 'Safe' | 'Suspicious' | 'Dangerous';
  timestamp: string; // ISO format
  reasons: string[];
  sources: {
    virustotal?: VirusTotalResult;
    phishtank?: PhishTankResult;
    whois?: WhoisResult;
    [key: string]: any;
  };
}
```

### VirusTotal Result

```typescript
interface VirusTotalResult {
  status: 'clean' | 'suspicious' | 'malicious';
  lastScanned: string;
  detections: number;
  totalScans: number;
  scanResults?: {
    [engine: string]: {
      detected: boolean;
      result: string;
    };
  };
}
```

### PhishTank Result

```typescript
interface PhishTankResult {
  status: 'clean' | 'phishing';
  verified: boolean;
  lastChecked: string;
  phishId?: string;
  url?: string;
}
```

### Whois Result

```typescript
interface WhoisResult {
  registrar: string;
  creationDate: string;
  expirationDate: string;
  nameservers: string[];
  country?: string;
  organization?: string;
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_URL` | The provided URL is invalid or malformed |
| `RATE_LIMIT_EXCEEDED` | Too many requests in a short time period |
| `ANALYSIS_FAILED` | The analysis process encountered an error |
| `OSINT_UNAVAILABLE` | One or more OSINT sources are unavailable |
| `INVALID_REQUEST` | The request body is invalid or missing required fields |
| `INTERNAL_ERROR` | An unexpected server error occurred |

## Rate Limiting

Rate limits are applied per IP address:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/analyze` | 10 requests | 1 minute |
| `/api/analyze/bulk` | 1 request | 1 minute |
| `/api/health` | 60 requests | 1 minute |
| `/api/status` | 30 requests | 1 minute |
| `/api/threats` | 20 requests | 1 minute |
| `/api/stats` | 30 requests | 1 minute |

When rate limits are exceeded, the API returns:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 60
  }
}
```

## Examples

### cURL Examples

#### Analyze a single URL
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

#### Check API health
```bash
curl http://localhost:5000/api/health
```

#### Get recent threats
```bash
curl "http://localhost:5000/api/threats?limit=5&severity=high"
```

### JavaScript Examples

#### Using fetch API
```javascript
// Analyze a URL
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com'
  })
});

const result = await response.json();
console.log(result.data);
```

#### Using axios
```javascript
import axios from 'axios';

// Analyze a URL
const response = await axios.post('/api/analyze', {
  url: 'https://example.com'
});

console.log(response.data.data);
```

## Webhooks

Webhooks are not currently supported but are planned for future releases. They will allow you to receive real-time notifications about threat detections and analysis results.

## SDKs and Libraries

Official SDKs are planned for:
- JavaScript/TypeScript
- Python
- Go
- Java

Community-contributed SDKs are welcome. Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## Support

For API support:
- **Documentation**: [GitHub Wiki](https://github.com/your-username/phish-eye/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/phish-eye/issues)
- **Email**: api@phish-eye.com

---

*Last updated: January 15, 2024*
