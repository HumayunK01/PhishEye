#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up PhishEye Database...\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  const envTemplate = `# Database Configuration
DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"

# API Configuration (optional)
VITE_API_URL="http://localhost:5000/api"
`;
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env file created!');
  console.log('⚠️  Please update DATABASE_URL with your Neon database connection string\n');
} else {
  console.log('✅ .env file already exists\n');
}

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.log('❌ DATABASE_URL not found in environment variables');
  console.log('Please set your Neon database connection string in the .env file');
  console.log('Example: DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"');
  process.exit(1);
}

try {
  console.log('🗄️  Running database migration...');
  execSync('npm run db:migrate', { stdio: 'inherit' });
  console.log('✅ Database migration completed!\n');
  
  console.log('🎉 Database setup complete!');
  console.log('\nNext steps:');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Open http://localhost:5000 in your browser');
  console.log('3. Your analysis history will now be saved to the database!');
  
} catch (error) {
  console.error('❌ Database migration failed:', error.message);
  console.log('\nTroubleshooting:');
  console.log('1. Check your DATABASE_URL is correct');
  console.log('2. Ensure your Neon database is active');
  console.log('3. Verify you have the required dependencies installed');
  process.exit(1);
}
