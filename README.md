# 🛡️ ScamSentinel

**OSINT-Based Real-Time Scam & Phishing Website Detection Framework**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?logo=express&logoColor=white)](https://expressjs.com/)

A comprehensive, modern web application for detecting and analyzing potential scam and phishing websites using advanced OSINT (Open Source Intelligence) techniques. Built with React, TypeScript, and Express.js, ScamSentinel provides real-time threat detection, bulk analysis capabilities, comprehensive reporting, and an intuitive user interface with 11 distinct pages covering all aspects of security analysis.

## ✨ Features

### 🔍 **Advanced URL Analysis**
- **Single URL Analysis**: Deep analysis of individual URLs with comprehensive risk assessment
- **Bulk Analysis**: Process up to 50 URLs simultaneously with progress tracking
- **Real-time Results**: Instant feedback with detailed risk scoring and evidence
- **Multiple OSINT Sources**: Cross-reference data from 6+ threat intelligence feeds
- **Risk Meter Visualization**: Interactive donut charts showing threat levels
- **Evidence Cards**: Detailed source-by-source analysis results

### 📊 **Comprehensive Dashboard**
- **Real-time Statistics**: Track total analyses, threat detections, and system health
- **Threat Level Monitoring**: Visual indicators for current threat landscape
- **Quick Actions**: Fast access to all major features
- **Recent Activity Feed**: Monitor latest analyses and threats
- **API Status Monitoring**: Live health checks and performance metrics
- **Threat Intelligence Feed**: Simulated real-time security updates

### 🚨 **Real-Time Threat Monitoring**
- **Live Threat Detection**: Simulated real-time threat monitoring system
- **Alert System**: Configurable notifications for different threat levels
- **Threat Intelligence Feed**: Stay updated with latest security threats
- **System Health Monitoring**: Track API status and performance
- **Interactive Monitoring Interface**: Start/stop monitoring with visual feedback

### 📋 **Comprehensive Reporting System**
- **Detailed Analysis Reports**: Multi-tab reports with risk analysis, OSINT sources, and technical details
- **PDF Export**: Professional branded reports with charts and evidence
- **Report Sharing**: Copy links and share analysis results
- **Historical Report Access**: View and export past analysis reports
- **Raw Data Access**: Complete JSON data for technical users

### 📚 **Analysis History Management**
- **Complete History Tracking**: Store and manage all analysis results
- **Advanced Filtering**: Search by URL, risk level, and time period
- **Pagination**: Efficient browsing of large analysis histories
- **Bulk Operations**: Export all history, clear data, import/export functionality
- **Individual Entry Management**: Delete specific analyses

### ⚙️ **Advanced Settings & Customization**
- **Appearance Settings**: Theme, font size, compact mode, animations
- **Notification Preferences**: Browser, sound, email, and vibration alerts
- **Analysis Configuration**: Timeout settings, retry attempts, deep scan options
- **Security & Privacy**: Data encryption, anonymization, retention policies
- **Data Management**: Export/import, storage monitoring, organization branding
- **Real-time Settings Updates**: Changes apply immediately without restart

### 📖 **Comprehensive Documentation**
- **Risk Scoring Algorithm**: Transparent explanation of scoring methodology
- **OSINT Sources Guide**: Detailed information about each data source
- **Privacy & Limitations**: Clear explanation of service capabilities and limitations
- **Interactive Documentation**: User-friendly guides and explanations

### 🔒 **Legal & Compliance Pages**
- **Privacy Policy**: Comprehensive data protection and privacy information
- **Terms of Service**: Complete terms and conditions for service usage
- **Cookie Policy**: Detailed cookie usage and management information
- **Disclaimer**: Important limitations and professional advice disclaimers

### 📱 **Modern User Experience**
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Themes**: Multiple theme options with system preference detection
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Accessibility**: Keyboard navigation and screen reader support
- **Progressive Web App**: Installable with offline capabilities
- **Glass-morphism Design**: Modern UI with subtle transparency effects

## 📄 Application Pages

ScamSentinel features 11 comprehensive pages covering all aspects of security analysis:

### 🏠 **Dashboard** (`/` or `/dashboard`)
- **Overview**: Central hub with real-time statistics and quick actions
- **Features**: 
  - Live analysis statistics (total analyses, high risk detected, safe URLs, average score)
  - API health monitoring with status indicators
  - Threat level assessment (low/medium/high)
  - Quick action buttons for all major features
  - Recent activity feed with analysis history
  - Threat intelligence feed with simulated security updates
- **Navigation**: Primary landing page with access to all other features

### 🔍 **Analyzer** (`/analyzer`)
- **Overview**: Main analysis interface for URL threat detection
- **Features**:
  - Single URL analysis with real-time processing
  - Bulk analysis mode for processing up to 50 URLs
  - Interactive risk meter with donut chart visualization
  - Evidence cards showing results from each OSINT source
  - Risk analysis reasoning with detailed explanations
  - Action buttons: View Report, Re-Analyze, Save to History, Export PDF
- **Modes**: Toggle between single and bulk analysis modes

### 📊 **Report** (`/report`)
- **Overview**: Detailed analysis reports with comprehensive data
- **Features**:
  - Multi-tab interface: Risk Analysis, OSINT Sources, Technical Details, Raw Data
  - Risk summary with score, verdict, and metadata
  - Source-by-source analysis results with status indicators
  - Technical details including analysis metadata and source status
  - Raw JSON data access for technical users
  - PDF export and sharing capabilities
- **Access**: Via analysis results or direct URL with analysis ID

### 📚 **History** (`/history`)
- **Overview**: Complete analysis history management system
- **Features**:
  - Paginated list of all previous analyses
  - Advanced filtering: search by URL, filter by risk level, time period
  - Individual entry management with delete functionality
  - Bulk operations: export all, clear history, import/export
  - Detailed entry cards with quick actions
  - Storage usage monitoring
- **Pagination**: Efficient browsing of large analysis histories

### 🚨 **Monitoring** (`/monitoring`)
- **Overview**: Real-time threat monitoring and alert system
- **Features**:
  - Interactive threat monitoring interface
  - Start/stop monitoring with visual feedback
  - Real-time threat detection simulation
  - Alert system configuration
  - System health monitoring
  - Threat intelligence feed integration
- **Purpose**: Continuous security monitoring and threat detection

### ⚙️ **Settings** (`/settings`)
- **Overview**: Comprehensive application configuration and preferences
- **Features**:
  - **Appearance**: Theme selection, font size, compact mode, animations
  - **Notifications**: Browser, sound, email, vibration preferences
  - **Analysis**: Auto-start, bulk mode, deep scan, timeout settings
  - **Security**: Data encryption, anonymization, retention policies
  - **Data Management**: Storage monitoring, export/import, organization settings
- **Tabs**: 5-tab interface for organized settings management

### 📖 **Documentation** (`/documentation`)
- **Overview**: Comprehensive user guide and technical documentation
- **Features**:
  - Risk scoring algorithm explanation with transparent methodology
  - OSINT sources guide with detailed descriptions
  - Privacy and limitations information
  - Interactive documentation with examples
  - External links to data source websites
- **Purpose**: User education and technical reference

### 🔒 **Privacy Policy** (`/privacy`)
- **Overview**: Comprehensive data protection and privacy information
- **Features**:
  - Information collection and usage policies
  - Data storage and security measures
  - User rights and data management
  - Third-party service information
  - Contact information for privacy concerns
- **Compliance**: GDPR and privacy regulation compliance

### 📋 **Terms of Service** (`/terms`)
- **Overview**: Complete terms and conditions for service usage
- **Features**:
  - Service description and user responsibilities
  - Prohibited uses and limitations
  - Intellectual property rights
  - Limitation of liability and indemnification
  - Termination and changes policies
- **Legal**: Comprehensive legal framework for service usage

### 🍪 **Cookie Policy** (`/cookies`)
- **Overview**: Detailed cookie usage and management information
- **Features**:
  - Cookie types and purposes explanation
  - Detailed cookie table with names, purposes, and durations
  - Third-party cookie information
  - Cookie management instructions
  - Browser-specific settings guidance
- **Compliance**: Cookie law compliance and transparency

### ⚠️ **Disclaimer** (`/disclaimer`)
- **Overview**: Important limitations and professional advice disclaimers
- **Features**:
  - General service disclaimers
  - Analysis results limitations
  - Third-party data source disclaimers
  - Professional advice disclaimers
  - Limitation of liability information
- **Purpose**: Legal protection and user awareness

## 🔌 APIs by Category

### Threat Intelligence
- **Phishing**
  - Google Safe Browsing API - Malicious website detection and reputation
  - VirusTotal API - Multi-engine malware detection and analysis platform

- **IOC Tools**
  - VirusTotal API - Multi-engine malware detection and analysis platform

- **TTPs**
  - VirusTotal API - Multi-engine malware detection and analysis platform

- **IBM X-Force Exchange**
  - VirusTotal API - Multi-engine malware detection and analysis platform

- **Malware Information Sharing Platform**
  - VirusTotal API - Multi-engine malware detection and analysis platform

- **Malware Patrol**
  - VirusTotal API - Multi-engine malware detection and analysis platform

- **AlienVault OTX**
  - VirusTotal API - Multi-engine malware detection and analysis platform

- **FireHOL IP Lists**
  - VirusTotal API - Multi-engine malware detection and analysis platform

- **Maltiverse**
  - VirusTotal API - Multi-engine malware detection and analysis platform

- **Malpedia**
  - VirusTotal API - Multi-engine malware detection and analysis platform

- **Project Honey Pot**
  - VirusTotal API - Multi-engine malware detection and analysis platform

### Domain Name
- **Whois Records**
  - RDAP/WHOIS API - Domain registration information lookup service

- **Certificate Search**
  - Certificate Transparency (crt.sh) - Certificate transparency log search

- **Reputation**
  - Google Safe Browsing API - Malicious website detection and reputation
  - VirusTotal API - Multi-engine malware detection and analysis platform

- **Domain Blacklists**
  - Google Safe Browsing API - Malicious website detection and reputation
  - VirusTotal API - Multi-engine malware detection and analysis platform

- **Typosquatting**
  - Custom Risk Scoring Algorithm - Pattern detection for suspicious domain names

- **PassiveDNS**
  - DNS over HTTPS (Cloudflare) - DNS record analysis (A/AAAA/CNAME/MX/TXT records)

- **Discovery**
  - URLScan.io API - Website scanning and threat analysis

### Malicious File Analysis
- **Hosted Automated Analysis**
  - VirusTotal - Multi-engine malware detection and analysis platform
  - VirusTotal API - Multi-engine malware detection and analysis platform

### Tools
- **OSINT Automation**
  - Risk Scoring Algorithm - Custom risk assessment tool for URL analysis
  - Bulk Analysis Engine - Batch processing tool for multiple URLs

- **Pentesting Recon**
  - URLScan.io API - Website scanning and threat analysis

- **Overview**
  - PDF Report Generator - Automated report creation tool

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HumayunK01/PhishEye.git
   cd PhishEye
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## 🏗️ Architecture

### Frontend (React + TypeScript + Vite)
```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── analyzer/        # Analysis-specific components
│   │   │   ├── bulk-analyzer.tsx      # Bulk analysis interface
│   │   │   ├── evidence-card.tsx      # OSINT source results
│   │   │   ├── loading-skeleton.tsx   # Loading states
│   │   │   └── risk-meter.tsx         # Risk visualization
│   │   ├── history/         # History management components
│   │   │   └── history-entry.tsx      # Individual history items
│   │   ├── layout/          # Navigation and layout
│   │   │   ├── footer.tsx             # Footer component
│   │   │   └── navigation.tsx         # Main navigation
│   │   ├── monitoring/      # Threat monitoring components
│   │   │   └── threat-monitor.tsx     # Real-time monitoring
│   │   └── ui/             # Base UI components (shadcn/ui)
│   │       ├── accordion.tsx          # Collapsible content
│   │       ├── alert-dialog.tsx       # Modal dialogs
│   │       ├── button.tsx             # Button components
│   │       ├── card.tsx               # Card layouts
│   │       ├── form.tsx               # Form components
│   │       ├── input.tsx              # Input fields
│   │       ├── select.tsx             # Dropdown selects
│   │       ├── tabs.tsx               # Tab interfaces
│   │       └── [40+ more components]  # Complete UI library
│   ├── pages/              # Main application pages (11 pages)
│   │   ├── dashboard.tsx              # Main dashboard
│   │   ├── analyzer.tsx               # URL analysis interface
│   │   ├── history.tsx                # Analysis history
│   │   ├── report.tsx                 # Detailed reports
│   │   ├── monitoring.tsx             # Threat monitoring
│   │   ├── settings.tsx               # Application settings
│   │   ├── documentation.tsx          # User documentation
│   │   ├── privacy.tsx                # Privacy policy
│   │   ├── terms.tsx                  # Terms of service
│   │   ├── cookies.tsx                # Cookie policy
│   │   ├── disclaimer.tsx             # Service disclaimer
│   │   └── not-found.tsx              # 404 error page
│   ├── contexts/           # React contexts
│   │   └── SettingsContext.tsx        # Global settings state
│   ├── hooks/              # Custom React hooks
│   │   ├── use-local-storage.tsx      # Local storage management
│   │   ├── use-mobile.tsx             # Mobile detection
│   │   ├── use-theme.tsx              # Theme management
│   │   └── use-toast.ts               # Toast notifications
│   ├── lib/                # Utility functions and services
│   │   ├── encryption-service.ts      # Data encryption
│   │   ├── history-manager-db.ts      # History management
│   │   ├── notification-service.ts    # Notification system
│   │   ├── pdf-export.ts              # PDF generation
│   │   ├── queryClient.ts             # API client
│   │   └── risk-calculator.ts         # Risk scoring
│   └── types/              # TypeScript type definitions
│       └── analysis.ts                # Analysis data types
```

### Backend (Express.js + TypeScript + Python)
```
server/
├── services/               # Core business logic
│   ├── osint.py           # OSINT data collection (Python)
│   └── risk_scorer.py     # Risk assessment algorithms (Python)
├── api/                   # API route definitions
│   ├── analyze.ts         # URL analysis endpoint
│   ├── health.ts          # Health check endpoint
│   └── history/           # History management endpoints
│       ├── [id].ts        # Individual history entries
│       └── index.ts       # History list operations
├── routes.ts              # Main route configuration
├── app.py                 # Python Flask application
├── index.ts               # Express.js server entry
├── db.ts                  # Database configuration
├── storage.ts             # Data persistence layer
└── migrate.ts             # Database migration scripts
```

### Shared Components
```
shared/
├── db-schema.ts           # Database schema definitions
└── schema.ts              # Shared TypeScript types and schemas
```

### Configuration Files
```
├── package.json           # Node.js dependencies and scripts
├── pyproject.toml         # Python dependencies
├── vite.config.ts         # Vite build configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── drizzle.config.ts      # Database ORM configuration
├── vercel.json            # Vercel deployment configuration
└── components.json        # shadcn/ui component configuration
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (if using external DB)
DATABASE_URL=your_database_url

# API Keys (for external OSINT services)
VIRUSTOTAL_API_KEY=your_virustotal_key
PHISHTANK_API_KEY=your_phishtank_key

# Security
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
```

### Settings

The application includes comprehensive settings that can be configured through the UI:

- **Appearance**: Theme, font size, compact mode, animations
- **Notifications**: Browser, sound, email, vibration preferences
- **Analysis**: Timeout settings, retry attempts, deep scan options
- **Security**: Data encryption, anonymization, retention policies
- **Data Management**: Storage limits, export/import, organization branding

## 📖 Usage

### Getting Started

1. **Access the Application**: Navigate to the ScamSentinel web application
2. **Dashboard Overview**: Start at the dashboard to see system status and quick actions
3. **Configure Settings**: Visit Settings to customize your experience (optional)

### Single URL Analysis

1. Navigate to the **Analyzer** page
2. Enter the URL you want to analyze in the input field
3. Click **Analyze** to start the process
4. View comprehensive results including:
   - Interactive risk meter with score (0-100)
   - Verdict (Safe/Warning/High Risk)
   - Evidence cards from 6+ OSINT sources
   - Detailed reasoning for the assessment
   - Action buttons for further operations

### Bulk Analysis

1. Go to the **Analyzer** page
2. Switch to the **Bulk Analysis** tab
3. Enter multiple URLs (one per line, up to 50)
4. Click **Analyze URLs** to start batch processing
5. Monitor progress with real-time updates
6. Export results as CSV or view individual reports

### Viewing Detailed Reports

1. After analysis, click **View Report** or access via **History**
2. Explore the multi-tab report interface:
   - **Risk Analysis**: Detailed reasoning and factors
   - **OSINT Sources**: Source-by-source analysis results
   - **Technical Details**: Metadata and system information
   - **Raw Data**: Complete JSON data for technical users
3. Export as PDF or share the report link

### Managing Analysis History

1. Navigate to the **History** page
2. Use filters to find specific analyses:
   - Search by URL
   - Filter by risk level (Safe/Warning/High Risk)
   - Filter by time period (24h, 7d, 30d, all time)
3. Perform bulk operations:
   - Export all history as JSON
   - Import previous history data
   - Clear all history
4. Manage individual entries:
   - View detailed reports
   - Delete specific analyses
   - Export individual reports

### Real-Time Monitoring

1. Navigate to the **Monitoring** page
2. Click **Start Monitoring** to begin real-time threat detection
3. Configure notification preferences in Settings
4. View live threat alerts and system health
5. Monitor threat intelligence feed updates

### Customizing Settings

1. Navigate to the **Settings** page
2. Configure across 5 categories:
   - **Appearance**: Theme, font size, compact mode, animations
   - **Notifications**: Browser, sound, email, vibration alerts
   - **Analysis**: Auto-start, bulk mode, deep scan, timeout settings
   - **Security**: Data encryption, anonymization, retention policies
   - **Data Management**: Storage monitoring, export/import, organization settings
3. Changes apply immediately without restart

### Understanding Results

1. Visit the **Documentation** page for detailed explanations
2. Learn about the risk scoring algorithm
3. Understand each OSINT source and its purpose
4. Review privacy and limitation information
5. Access external links to data source websites

### Legal and Compliance

1. Review **Privacy Policy** for data protection information
2. Check **Terms of Service** for usage guidelines
3. Understand **Cookie Policy** for tracking information
4. Read **Disclaimer** for important limitations and disclaimers

## 🔒 Security Features

### Data Protection
- **Local Storage Only**: All data stored locally in your browser
- **No Server Storage**: Analysis data never leaves your device
- **Encryption Options**: Optional local data encryption
- **Anonymization**: Remove identifying information from data

### Privacy
- **No Tracking**: No analytics or user tracking
- **Open Source**: Fully transparent codebase
- **Self-Hosted**: Run on your own infrastructure

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run check        # TypeScript type checking
npm run lint         # ESLint code linting
npm run format       # Prettier code formatting

# Database
npm run db:push      # Push database schema changes
```

### Project Structure

The project follows a monorepo structure with clear separation of concerns:

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Shared**: Common types and utilities
- **UI Components**: shadcn/ui based component library

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📊 API Documentation

### Analysis Endpoints

#### POST `/api/analyze`
Analyze a single URL for potential threats using multiple OSINT sources.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "id": "analysis_123",
  "url": "https://example.com",
  "normalizedUrl": "example.com",
  "score": 25,
  "verdict": "Safe",
  "timestamp": "2024-01-15T10:30:00Z",
  "analysisTime": 1250,
  "reasons": [
    "Domain has valid SSL certificate",
    "No suspicious patterns detected",
    "Clean reputation across all sources"
  ],
  "sources": {
    "whoisRdap": { 
      "status": "success", 
      "data": { "domain": "example.com", "registrar": "Example Corp" }
    },
    "virustotal": { 
      "status": "success", 
      "data": { "detections": 0, "engines": 80 }
    },
    "urlscan": { 
      "status": "success", 
      "data": { "verdict": "clean", "screenshot": "https://..." }
    },
    "googleSafeBrowsing": { 
      "status": "success", 
      "data": { "threats": [] }
    },
    "certificateTransparency": { 
      "status": "success", 
      "data": { "certificates": 1, "valid": true }
    },
    "dnsAnalysis": { 
      "status": "success", 
      "data": { "records": ["A", "AAAA", "MX"], "spf": true }
    }
  }
}
```

#### GET `/api/health`
Check API health status and system information.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "uptime": 3600,
  "services": {
    "virustotal": "operational",
    "urlscan": "operational",
    "googleSafeBrowsing": "operational"
  }
}
```

### History Management Endpoints

#### GET `/api/history`
Retrieve analysis history with optional pagination and filtering.

**Query Parameters:**
- `limit` (optional): Number of entries to return (default: 50)
- `offset` (optional): Number of entries to skip (default: 0)
- `riskLevel` (optional): Filter by risk level (safe, warning, high-risk)
- `timeRange` (optional): Filter by time range (24h, 7d, 30d)

**Response:**
```json
{
  "entries": [
    {
      "id": "analysis_123",
      "url": "https://example.com",
      "date": "2024-01-15T10:30:00Z",
      "score": 25,
      "verdict": "Safe",
      "snapshot": {
        "reasons": ["Domain has valid SSL certificate"],
        "brief": "Safe - 6 sources checked"
      }
    }
  ],
  "total": 150,
  "hasMore": true
}
```

#### GET `/api/history/[id]`
Retrieve a specific analysis entry by ID.

**Response:**
```json
{
  "id": "analysis_123",
  "url": "https://example.com",
  "date": "2024-01-15T10:30:00Z",
  "score": 25,
  "verdict": "Safe",
  "fullAnalysis": {
    // Complete analysis result object
  }
}
```

#### DELETE `/api/history/[id]`
Delete a specific analysis entry from history.

**Response:**
```json
{
  "success": true,
  "message": "Analysis deleted successfully"
}
```

### Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Common Error Codes:**
- `INVALID_URL`: The provided URL is invalid or malformed
- `ANALYSIS_FAILED`: The analysis process encountered an error
- `RATE_LIMITED`: Too many requests, please try again later
- `SERVICE_UNAVAILABLE`: One or more OSINT services are unavailable
- `NOT_FOUND`: The requested resource was not found

## 🎨 UI Components

The application uses a modern component library based on shadcn/ui:

- **Cards**: Glass-morphism design with subtle transparency
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth transitions
- **Themes**: CSS variables for consistent theming
- **Responsive**: Mobile-first design approach

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Make your changes
5. Run tests: `npm test`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [React Hook Form](https://react-hook-form.com/) for form management
- [Zod](https://zod.dev/) for schema validation
- [Lucide React](https://lucide.dev/) for icons

## 📞 Support

- **Documentation**: [Wiki](https://github.com/your-username/phish-eye/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/phish-eye/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/phish-eye/discussions)
- **Email**: support@phish-eye.com

## 🔮 Roadmap

### Upcoming Features
- [ ] **Machine Learning Integration**: AI-powered threat detection and pattern recognition
- [ ] **API Rate Limiting**: Prevent abuse and ensure fair usage with user quotas
- [ ] **User Authentication**: Multi-user support with role-based access control
- [ ] **Advanced Reporting**: Custom report templates, scheduling, and automated delivery
- [ ] **Threat Intelligence Feeds**: Integration with additional OSINT sources and threat feeds
- [ ] **Mobile App**: Native iOS and Android applications with offline capabilities
- [ ] **Enterprise Features**: Team collaboration, centralized management, and admin dashboards
- [ ] **API Webhooks**: Real-time notifications for threat detection events
- [ ] **Custom Risk Rules**: User-defined risk scoring rules and thresholds
- [ ] **Integration APIs**: RESTful APIs for third-party integrations

### Performance Improvements
- [ ] **Caching Layer**: Redis for improved response times and reduced API calls
- [ ] **CDN Integration**: Global content delivery for faster loading
- [ ] **Database Optimization**: Query performance improvements and indexing
- [ ] **Lazy Loading**: On-demand component loading for better performance
- [ ] **Service Workers**: Offline functionality and background processing
- [ ] **Image Optimization**: WebP support and responsive image delivery

### Security Enhancements
- [ ] **Rate Limiting**: Advanced rate limiting with IP-based and user-based controls
- [ ] **Input Validation**: Enhanced input sanitization and validation
- [ ] **Audit Logging**: Comprehensive audit trails for security events
- [ ] **Penetration Testing**: Regular security assessments and vulnerability scanning

## 📈 Version History

### v1.0.0 (Current)
- ✅ Complete 11-page application with comprehensive features
- ✅ Advanced URL analysis with 6+ OSINT sources
- ✅ Bulk analysis capabilities for up to 50 URLs
- ✅ Comprehensive reporting system with PDF export
- ✅ Complete history management with filtering and pagination
- ✅ Real-time threat monitoring interface
- ✅ Advanced settings with 5 configuration categories
- ✅ Complete documentation and legal compliance pages
- ✅ Modern UI with glass-morphism design and animations
- ✅ Responsive design for all device types
- ✅ Local storage with data encryption options
- ✅ Professional PDF report generation
- ✅ Complete API documentation

## 🤝 Contributing

We welcome contributions from the cybersecurity community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see Configuration section)
4. Start development server: `npm run dev`
5. Make your changes
6. Run tests: `npm test`
7. Submit a pull request

### Areas for Contribution

- **New OSINT Sources**: Add integration with additional threat intelligence feeds
- **UI/UX Improvements**: Enhance the user interface and user experience
- **Performance Optimization**: Improve application performance and loading times
- **Security Enhancements**: Strengthen security measures and add new features
- **Documentation**: Improve documentation and add examples
- **Testing**: Add comprehensive test coverage
- **Mobile Optimization**: Enhance mobile experience and responsiveness

## 📞 Support

- **Documentation**: [Wiki](https://github.com/HumayunK01/ScamSentinel/wiki)
- **Issues**: [GitHub Issues](https://github.com/HumayunK01/ScamSentinel/issues)
- **Discussions**: [GitHub Discussions](https://github.com/HumayunK01/ScamSentinel/discussions)
- **Email**: humayunk.pvt@gmail.com
- **Website**: https://devhumayun.me

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [React Hook Form](https://react-hook-form.com/) for form management
- [Zod](https://zod.dev/) for schema validation
- [Lucide React](https://lucide.dev/) for icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for fast development and building
- [Express.js](https://expressjs.com/) for the backend API
- [Python](https://python.org/) for OSINT data collection
- All the OSINT data providers for their valuable threat intelligence

---

**Built with ❤️ for cybersecurity professionals and privacy-conscious users**

*ScamSentinel - Your comprehensive defense against online threats*

**Mumbai, India** | **2024**
