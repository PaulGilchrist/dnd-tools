import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Import deployment configuration
const deployConfig = await import('./deploy.config.js').then(m => m.default);

const { batchSize, imageSource, distDir } = deployConfig;

// Get list of all image files in source directory
const imageFiles = fs.readdirSync(imageSource)
  .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp)$/i))
  .map(file => path.join(imageSource, file));

console.log(`Found ${imageFiles.length} monster images to deploy in batches.`);
console.log(`Batch size: ${batchSize}\n`);

// Create batch tracking file
const BATCH_TRACKER_FILE = '.batch-deploy-status.json';
let deployedFiles = [];

if (fs.existsSync(BATCH_TRACKER_FILE)) {
  const status = JSON.parse(fs.readFileSync(BATCH_TRACKER_FILE, 'utf-8'));
  deployedFiles = status.deployed || [];
  console.log(`Previously deployed: ${deployedFiles.length} files`);
}

// Function to deploy a batch of files
function deployBatch(batch, batchNumber) {
  console.log(`\n=== Deploying Batch ${batchNumber} (${batch.length} files) ===`);
  
  try {
    // Build the project
    console.log('Building project...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Clean up any existing gh-pages branch locally before deploying
    console.log('Preparing deployment...');
    execSync('git checkout main 2>/dev/null || git checkout master', { stdio: 'pipe' });
    execSync('git branch -D gh-pages 2>/dev/null || true', { stdio: 'pipe' });

    // Deploy using gh-pages - it will create the branch fresh
    console.log('Deploying to GitHub Pages...');

    // Fetch latest from origin
    execSync('git fetch origin', { stdio: 'pipe' });
    
    // Deploy - gh-pages will create the branch if it doesn't exist
    execSync(`npx gh-pages -d ${distDir}`, { stdio: 'inherit' });

    // Update batch tracker
    const newDeployed = [...deployedFiles, ...batch.map(f => path.basename(f))];
    const status = {
      deployed: newDeployed,
      totalBatches: Math.ceil(imageFiles.length / batchSize),
      currentBatch: batchNumber,
      lastUpdated: new Date().toISOString()
    };

    fs.writeFileSync(BATCH_TRACKER_FILE, JSON.stringify(status, null, 2));

    console.log(`✓ Batch ${batchNumber} deployed successfully!`);
  } catch (error) {
    console.error(`✗ Error deploying batch ${batchNumber}:`, error.message);
    process.exit(1);
  }
}

// Split images into batches
const batches = [];
for (let i = 0; i < imageFiles.length; i += batchSize) {
  batches.push(imageFiles.slice(i, i + batchSize));
}

console.log(`Total batches to deploy: ${batches.length}\n`);

// Deploy all batches
for (let i = 0; i < batches.length; i++) {
  deployBatch(batches[i], i + 1);
}

console.log('\n=== Deployment Complete ===');
console.log(`All ${imageFiles.length} images have been deployed in ${batches.length} batches.`);
console.log('\nYour site is now live on GitHub Pages!');

