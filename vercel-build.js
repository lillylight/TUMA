const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create .env file with required environment variables
const envPath = path.join(__dirname, '.env');
const envVars = {
  VITE_PUBLIC_ONCHAINKIT_API_KEY: process.env.VITE_PUBLIC_ONCHAINKIT_API_KEY,
  VITE_PUBLIC_PRODUCT_ID: process.env.VITE_PUBLIC_PRODUCT_ID,
  VITE_COINBASE_COMMERCE_API_KEY: process.env.VITE_COINBASE_COMMERCE_API_KEY,
  ARWEAVE_JWK_JSON: process.env.ARWEAVE_JWK_JSON
};

// Write environment variables to .env file
let envContent = '';
for (const [key, value] of Object.entries(envVars)) {
  if (value) {
    envContent += `${key}=${value}\n`;
  }
}

fs.writeFileSync(envPath, envContent);

// Run the build
console.log('Running build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully');
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
