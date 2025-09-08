# Database Setup Guide

This guide covers setting up the Neon database for PhishEye to store analysis history and results persistently.

## Prerequisites

1. **Neon Account**: Sign up at [neon.tech](https://neon.tech)
2. **Database URL**: Get your connection string from the Neon console
3. **Environment Variables**: Set up your `.env` file

## Quick Setup

### 1. Create Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy the connection string (it looks like: `postgresql://username:password@hostname/database?sslmode=require`)

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"

# API Configuration (optional)
VITE_API_URL="http://localhost:5000/api"
```

### 3. Run Database Migration

```bash
# Install dependencies (if not already done)
npm install

# Run the migration to create tables
npm run db:migrate
```

### 4. Start the Application

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## Database Schema

### Tables Created

#### `history_entries`
Stores analysis history with full data preservation:

- `id` (TEXT, PRIMARY KEY): Unique identifier
- `url` (TEXT): Original URL analyzed
- `date` (TIMESTAMP): When analysis was performed
- `score` (INTEGER): Risk score (0-100)
- `verdict` (TEXT): Safe/Warning/High Risk
- `snapshot` (JSONB): Quick summary data
- `full_analysis` (JSONB): Complete analysis data
- `created_at` (TIMESTAMP): Record creation time
- `updated_at` (TIMESTAMP): Last update time

#### `analysis_results`
Caches analysis results for performance:

- `id` (TEXT, PRIMARY KEY): Unique identifier
- `url` (TEXT): Original URL
- `normalized_url` (TEXT): Normalized URL
- `timestamp` (TIMESTAMP): Analysis timestamp
- `score` (INTEGER): Risk score
- `verdict` (TEXT): Analysis verdict
- `reasons` (JSONB): Risk reasons array
- `sources` (JSONB): OSINT sources data
- `analysis_time` (INTEGER): Analysis duration
- `created_at` (TIMESTAMP): Record creation time

### Indexes

For optimal performance, the following indexes are created:

- `idx_history_entries_date`: Sorted by date (DESC)
- `idx_history_entries_verdict`: Filtered by verdict
- `idx_analysis_results_url`: Lookup by URL
- `idx_analysis_results_timestamp`: Sorted by timestamp (DESC)

## API Endpoints

### History Management

- `GET /api/history` - Get history entries (with pagination)
- `GET /api/history/:id` - Get specific history entry
- `POST /api/history` - Create new history entry
- `PUT /api/history/:id` - Update history entry
- `DELETE /api/history/:id` - Delete specific entry
- `DELETE /api/history` - Clear all history
- `GET /api/history/stats` - Get history statistics

### Query Parameters

#### GET /api/history
- `limit` (number): Number of entries to return (default: 50)
- `offset` (number): Number of entries to skip (default: 0)

## Error Handling

The application includes comprehensive error handling:

1. **Database Connection Errors**: Graceful fallback to localStorage
2. **API Errors**: User-friendly error messages
3. **Validation Errors**: Proper error responses
4. **Network Errors**: Retry mechanisms and fallbacks

## Migration from localStorage

The application automatically migrates existing localStorage data:

1. **Hybrid Approach**: Tries database first, falls back to localStorage
2. **Data Migration**: Converts old entries to new format
3. **Backward Compatibility**: Maintains existing functionality

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check DATABASE_URL format
   - Verify Neon database is active
   - Check network connectivity

2. **Migration Fails**
   - Ensure DATABASE_URL is set
   - Check database permissions
   - Verify Neon project is active

3. **Data Not Persisting**
   - Check API endpoints are working
   - Verify database connection
   - Check browser console for errors

### Debug Mode

Enable debug logging by setting:

```bash
NODE_ENV=development
```

This will show detailed database queries and API calls in the console.

## Performance Considerations

1. **Pagination**: Use limit/offset for large datasets
2. **Indexing**: Indexes are automatically created for optimal performance
3. **Caching**: Analysis results are cached to avoid re-analysis
4. **Connection Pooling**: Neon handles connection pooling automatically

## Security

1. **Environment Variables**: Never commit DATABASE_URL to version control
2. **SSL**: All connections use SSL by default
3. **Validation**: All inputs are validated using Zod schemas
4. **Error Handling**: Sensitive information is not exposed in error messages

## Backup and Recovery

1. **Neon Backups**: Neon provides automatic backups
2. **Point-in-Time Recovery**: Available in Neon Pro plans
3. **Export Functionality**: Built-in history export to JSON
4. **Import Functionality**: Restore from exported JSON files

## Monitoring

Monitor your database usage in the Neon console:

1. **Query Performance**: View slow queries
2. **Connection Usage**: Monitor active connections
3. **Storage Usage**: Track database size
4. **Error Logs**: View database errors

## Support

For database-related issues:

1. **Neon Documentation**: [docs.neon.tech](https://docs.neon.tech)
2. **Neon Support**: Available in Neon console
3. **Project Issues**: Check GitHub issues for known problems
