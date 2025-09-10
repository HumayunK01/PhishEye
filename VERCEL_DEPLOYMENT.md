# Vercel Deployment Guide for PhishEye

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Neon Database**: Set up your database (already done)

## Deployment Steps

### 1. Environment Variables

In your Vercel dashboard, add these environment variables:

```bash
# Database
DATABASE_URL=postgresql://neondb_owner:your_password@ep-xxx.aws.neon.tech/neondb?sslmode=require

# API Keys
VIRUSTOTAL_API_KEY=your_virustotal_api_key
URLSCAN_API_KEY=your_urlscan_api_key
GSB_API_KEY=your_google_safe_browsing_api_key

# API URL (will be set automatically)
VITE_API_URL=https://your-app.vercel.app/api
```

### 2. Build Configuration

The project is already configured for Vercel with:
- `vercel.json` - Vercel configuration
- `api/` directory - Serverless functions
- `build:vercel` script - Vite build for frontend

### 3. Deploy

1. **Connect to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build:vercel`
   - Output Directory: `client/dist`
   - Install Command: `npm install`

3. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete

### 4. Database Migration

After deployment, run the database migration:

```bash
# In Vercel dashboard, go to Functions tab
# Or run locally with production DATABASE_URL
npm run db:migrate
```

### 5. Update API URL

After deployment, update the `VITE_API_URL` environment variable in Vercel with your actual domain.

## Project Structure for Vercel

```
├── api/                    # Serverless functions
│   ├── analyze.ts         # URL analysis endpoint
│   ├── health.ts          # Health check
│   └── history/           # History management
│       ├── index.ts       # GET/POST/DELETE /api/history
│       └── [id].ts        # GET/PUT/DELETE /api/history/:id
├── client/                # Frontend build output
├── server/                # Python OSINT services
├── shared/                # Shared types and schemas
├── vercel.json           # Vercel configuration
└── package.json          # Build scripts
```

## Features

✅ **Serverless Functions**: All API endpoints as Vercel functions
✅ **Static Frontend**: Built with Vite and served from CDN
✅ **Database Integration**: Neon PostgreSQL with Drizzle ORM
✅ **Environment Variables**: Secure configuration management
✅ **CORS Support**: Proper headers for cross-origin requests
✅ **Error Handling**: Comprehensive error responses

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation passes

2. **Database Connection**:
   - Verify `DATABASE_URL` is correct
   - Check Neon database is active

3. **API Errors**:
   - Check Vercel function logs
   - Verify environment variables are set

4. **Python Dependencies**:
   - Python scripts need to be in the deployment
   - Consider using Vercel's Python runtime if needed

### Performance Optimization

1. **Edge Functions**: Consider using Vercel Edge Functions for better performance
2. **Caching**: Implement Redis caching for analysis results
3. **CDN**: Static assets are automatically served from CDN

## Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Function Logs**: Available in Vercel dashboard
- **Database Monitoring**: Use Neon dashboard

## Security

- **Environment Variables**: Never commit secrets
- **CORS**: Properly configured for your domain
- **Rate Limiting**: Consider implementing for API endpoints
- **Input Validation**: All inputs validated with Zod schemas

## Next Steps

1. Deploy to Vercel
2. Set up custom domain (optional)
3. Configure monitoring and alerts
4. Set up CI/CD for automatic deployments
5. Consider implementing caching for better performance
