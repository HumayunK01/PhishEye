# Database Setup Guide

## Quick Fix for "Database Error"

If you're seeing the error "Failed to load history from database. Please try again.", follow these steps:

### Option 1: Quick Setup (Recommended)

Run the enhanced setup script:

```bash
npm run setup:db:enhanced
```

This will guide you through:
1. Setting up a Neon database (free)
2. Configuring your environment variables
3. Running database migrations
4. Testing the connection

### Option 2: Manual Setup

1. **Create a Neon Database**:
   - Go to [console.neon.tech](https://console.neon.tech)
   - Sign up for a free account
   - Create a new project
   - Copy the connection string

2. **Create .env file**:
   ```bash
   # Create .env file in project root
   echo 'DATABASE_URL="your_neon_connection_string_here"' > .env
   ```

3. **Run Migration**:
   ```bash
   npm run db:migrate
   ```

4. **Start the App**:
   ```bash
   npm run dev
   ```

### Option 3: Use Without Database

The app will work without a database using localStorage, but history won't persist between sessions.

## Troubleshooting

### Common Issues

1. **"DATABASE_URL not found"**
   - Make sure you have a `.env` file in the project root
   - Check that the DATABASE_URL is properly formatted

2. **"Migration failed"**
   - Verify your Neon database is active
   - Check your connection string format
   - Ensure you have the required dependencies: `npm install`

3. **"Connection refused"**
   - Check your internet connection
   - Verify the Neon database is not paused
   - Try regenerating the connection string

### Getting Help

- Check the console for detailed error messages
- Run `npm run setup:db:enhanced` for guided setup
- Refer to [docs/DATABASE.md](docs/DATABASE.md) for detailed documentation

## What's Fixed

✅ Graceful fallback to localStorage when database is unavailable  
✅ Better error messages and setup guidance  
✅ Enhanced setup script with multiple options  
✅ Database connection validation  
✅ Automatic migration handling  

The app will now work even without a database, using localStorage as a fallback!
