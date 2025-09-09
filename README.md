# 🛡️ PhishEye

**OSINT-Based Real-Time Scam & Phishing Website Detection Framework**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?logo=express&logoColor=white)](https://expressjs.com/)

A comprehensive, modern web application for detecting and analyzing potential scam and phishing websites using advanced OSINT (Open Source Intelligence) techniques. Built with React, TypeScript, and Express.js, PhishEye provides real-time threat detection, bulk analysis capabilities, and an intuitive user interface.

## ✨ Features

### 🔍 **Advanced URL Analysis**
- **Single URL Analysis**: Deep analysis of individual URLs with comprehensive risk assessment
- **Bulk Analysis**: Process up to 50 URLs simultaneously with progress tracking
- **Real-time Results**: Instant feedback with detailed risk scoring and evidence
- **Multiple OSINT Sources**: Cross-reference data from various threat intelligence feeds

### 📊 **Comprehensive Dashboard**
- **Real-time Statistics**: Track total analyses, threat detections, and system health
- **Threat Level Monitoring**: Visual indicators for current threat landscape
- **Quick Actions**: Fast access to all major features
- **Recent Activity Feed**: Monitor latest analyses and threats

### 🚨 **Real-Time Threat Monitoring**
- **Live Threat Detection**: Simulated real-time threat monitoring system
- **Alert System**: Configurable notifications for different threat levels
- **Threat Intelligence Feed**: Stay updated with latest security threats
- **System Health Monitoring**: Track API status and performance

### ⚙️ **Advanced Settings & Customization**
- **Appearance Settings**: Theme, font size, compact mode, animations
- **Notification Preferences**: Browser, sound, email, and vibration alerts
- **Analysis Configuration**: Timeout settings, retry attempts, deep scan options
- **Security & Privacy**: Data encryption, anonymization, retention policies
- **Data Management**: Export/import, storage monitoring, organization branding

### 📱 **Modern User Experience**
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Themes**: Multiple theme options with system preference detection
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Accessibility**: Keyboard navigation and screen reader support
- **Progressive Web App**: Installable with offline capabilities

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

### Frontend (React + TypeScript)
```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── analyzer/        # Analysis-specific components
│   │   ├── layout/          # Navigation, footer, etc.
│   │   ├── monitoring/      # Threat monitoring components
│   │   └── ui/             # Base UI components (shadcn/ui)
│   ├── pages/              # Main application pages
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and helpers
│   └── types/              # TypeScript type definitions
```

### Backend (Express.js + TypeScript)
```
server/
├── services/               # Core business logic
│   ├── osint.py           # OSINT data collection
│   └── risk_scorer.py     # Risk assessment algorithms
├── routes.ts              # API route definitions
├── app.py                 # Main application setup
└── storage.ts             # Data persistence layer
```

### Shared
```
shared/
└── schema.ts              # Shared TypeScript types and schemas
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

### Single URL Analysis

1. Navigate to the **Analyzer** page
2. Enter the URL you want to analyze
3. Click **Analyze** to start the process
4. View detailed results including:
   - Risk score (0-100)
   - Verdict (Safe/Suspicious/Dangerous)
   - Evidence from multiple OSINT sources
   - Detailed reasoning for the assessment

### Bulk Analysis

1. Go to the **Analyzer** page
2. Switch to the **Bulk Analysis** tab
3. Enter multiple URLs (one per line, up to 50)
4. Click **Analyze URLs** to start batch processing
5. Monitor progress and export results as CSV

### Real-Time Monitoring

1. Navigate to the **Monitoring** page
2. Click **Start Monitoring** to begin real-time threat detection
3. Configure notification preferences
4. View live threat alerts and system health

### Dashboard Overview

1. The **Dashboard** provides a comprehensive overview of:
   - Analysis statistics and trends
   - Recent activity and threats
   - Quick access to all features
   - System health and API status

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
Analyze a single URL for potential threats.

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
  "reasons": [
    "Domain has valid SSL certificate",
    "No suspicious patterns detected"
  ],
  "sources": {
    "virustotal": { "status": "clean" },
    "phishtank": { "status": "clean" }
  }
}
```

#### GET `/api/health`
Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

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
- [ ] **Machine Learning Integration**: AI-powered threat detection
- [ ] **API Rate Limiting**: Prevent abuse and ensure fair usage
- [ ] **User Authentication**: Multi-user support with role-based access
- [ ] **Advanced Reporting**: Custom report templates and scheduling
- [ ] **Threat Intelligence Feeds**: Integration with more OSINT sources
- [ ] **Mobile App**: Native iOS and Android applications
- [ ] **Enterprise Features**: Team collaboration and centralized management

### Performance Improvements
- [ ] **Caching Layer**: Redis for improved response times
- [ ] **CDN Integration**: Global content delivery
- [ ] **Database Optimization**: Query performance improvements
- [ ] **Lazy Loading**: On-demand component loading

---

**Built with ❤️ for cybersecurity professionals and privacy-conscious users**

*PhishEye - Your first line of defense against online threats*
