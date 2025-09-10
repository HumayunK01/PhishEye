# 🛡️ PhishEye

**OSINT-Based Real-Time Scam & Phishing Website Detection Framework**

A modern web application for detecting and analyzing potential scam and phishing websites using advanced OSINT (Open Source Intelligence) techniques.

![PhishEye Preview](public/preview.png)

## ✨ Features

- **URL Analysis**: Single URL and bulk analysis (up to 50 URLs)
- **Real-time Detection**: Multiple OSINT sources for comprehensive threat assessment
- **Detailed Reports**: PDF export and comprehensive analysis reports
- **History Management**: Track and manage all your analyses
- **Modern UI**: Dark/Light themes, responsive design, smooth animations
- **Privacy-First**: All data stored locally in your browser

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

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

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

## 📖 Usage

### Analyze a URL
1. Go to the **Analyzer** page
2. Enter the URL you want to check
3. Click **Analyze** to get results
4. View detailed risk assessment and evidence

### Bulk Analysis
1. Switch to **Bulk Analysis** mode
2. Enter multiple URLs (one per line, up to 50)
3. Click **Analyze URLs** to process all at once

### View Reports
- Click **View Report** after analysis for detailed results
- Export as PDF for sharing
- Access via **History** page

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file for API keys:

```env
# API Keys (optional - app works without them)
VIRUSTOTAL_API_KEY=your_virustotal_key
PHISHTANK_API_KEY=your_phishtank_key
```

### Settings
Configure the app through the **Settings** page:
- **Appearance**: Theme, font size, compact mode
- **Notifications**: Browser alerts and sound preferences
- **Analysis**: Timeout settings and analysis options
- **Security**: Data encryption and privacy settings

## 🏗️ Project Structure

```
├── client/          # React frontend
├── server/          # Express.js backend
├── shared/          # Shared types and schemas
└── docs/           # Documentation
```

## 🛠️ Development

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run check        # TypeScript type checking
npm run lint         # ESLint code linting
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/HumayunK01/PhishEye/issues)
- **Email**: humayunk.pvt@gmail.com

---

**Built with ❤️ for cybersecurity professionals and privacy-conscious users**