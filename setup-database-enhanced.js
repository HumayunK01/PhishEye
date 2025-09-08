#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

console.log('🚀 Setting up PhishEye Database...\n');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function setupDatabase() {
  try {
    // Check if .env file exists
    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      console.log('✅ .env file already exists');
      envContent = fs.readFileSync(envPath, 'utf8');
    } else {
      console.log('📝 Creating .env file...');
    }

    // Check if DATABASE_URL is already set
    if (envContent.includes('DATABASE_URL=') && !envContent.includes('DATABASE_URL=""')) {
      console.log('✅ DATABASE_URL is already configured');
      
      const proceed = await askQuestion('Do you want to reconfigure the database? (y/N): ');
      if (proceed.toLowerCase() !== 'y' && proceed.toLowerCase() !== 'yes') {
        console.log('Skipping database configuration...');
        rl.close();
        return;
      }
    }

    console.log('\n🔗 Database Setup Options:');
    console.log('1. Use Neon Database (Recommended)');
    console.log('2. Use local PostgreSQL');
    console.log('3. Skip database setup (use localStorage only)');
    
    const choice = await askQuestion('\nSelect an option (1-3): ');

    let databaseUrl = '';

    switch (choice) {
      case '1':
        console.log('\n📋 Neon Database Setup:');
        console.log('1. Go to https://console.neon.tech');
        console.log('2. Create a new project');
        console.log('3. Copy the connection string');
        console.log('4. Paste it below (it should look like: postgresql://username:password@hostname/database?sslmode=require)');
        
        databaseUrl = await askQuestion('\nEnter your Neon DATABASE_URL: ');
        break;
        
      case '2':
        console.log('\n📋 Local PostgreSQL Setup:');
        console.log('Make sure PostgreSQL is running locally');
        
        const host = await askQuestion('Host (default: localhost): ') || 'localhost';
        const port = await askQuestion('Port (default: 5432): ') || '5432';
        const database = await askQuestion('Database name: ');
        const username = await askQuestion('Username: ');
        const password = await askQuestion('Password: ');
        
        databaseUrl = `postgresql://${username}:${password}@${host}:${port}/${database}`;
        break;
        
      case '3':
        console.log('\n⚠️  Skipping database setup - will use localStorage only');
        console.log('Note: History will not persist between sessions');
        rl.close();
        return;
        
      default:
        console.log('❌ Invalid option. Exiting...');
        rl.close();
        return;
    }

    // Validate DATABASE_URL format
    if (databaseUrl && !databaseUrl.startsWith('postgresql://')) {
      console.log('❌ Invalid DATABASE_URL format. Must start with postgresql://');
      rl.close();
      return;
    }

    // Update or create .env file
    const newEnvContent = `# Database Configuration
DATABASE_URL="${databaseUrl}"

# API Configuration (optional)
VITE_API_URL="http://localhost:5000/api"
`;

    fs.writeFileSync(envPath, newEnvContent);
    console.log('✅ .env file updated!');

    if (databaseUrl) {
      // Test database connection
      console.log('\n🔍 Testing database connection...');
      
      try {
        // Set the DATABASE_URL for the migration
        process.env.DATABASE_URL = databaseUrl;
        
        console.log('🗄️  Running database migration...');
        execSync('npm run db:migrate', { stdio: 'inherit' });
        console.log('✅ Database migration completed!');
        
        console.log('\n🎉 Database setup complete!');
        console.log('\nNext steps:');
        console.log('1. Start the development server: npm run dev');
        console.log('2. Open http://localhost:5000 in your browser');
        console.log('3. Your analysis history will now be saved to the database!');
        
      } catch (error) {
        console.error('❌ Database migration failed:', error.message);
        console.log('\nTroubleshooting:');
        console.log('1. Check your DATABASE_URL is correct');
        console.log('2. Ensure your database is accessible');
        console.log('3. Verify you have the required dependencies installed');
        console.log('4. Try running: npm install');
        
        // Ask if user wants to continue without database
        const continueWithoutDb = await askQuestion('\nDo you want to continue without database? (y/N): ');
        if (continueWithoutDb.toLowerCase() === 'y' || continueWithoutDb.toLowerCase() === 'yes') {
          console.log('⚠️  Continuing without database - will use localStorage only');
        } else {
          process.exit(1);
        }
      }
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setupDatabase();
