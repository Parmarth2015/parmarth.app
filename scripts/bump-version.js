#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function bumpVersion(type = 'patch') {
  // Try multiple possible paths for EAS build environment
  const possiblePaths = [
    path.join(__dirname, '..', 'package.json'),
    path.join(process.cwd(), 'package.json'),
    './package.json'
  ];
  
  const possibleAppPaths = [
    path.join(__dirname, '..', 'app.json'),
    path.join(process.cwd(), 'app.json'),
    './app.json'
  ];
  
  let packageJsonPath, appJsonPath;
  
  // Find package.json
  for (const pkgPath of possiblePaths) {
    if (fs.existsSync(pkgPath)) {
      packageJsonPath = pkgPath;
      break;
    }
  }
  
  // Find app.json
  for (const appPath of possibleAppPaths) {
    if (fs.existsSync(appPath)) {
      appJsonPath = appPath;
      break;
    }
  }
  
  if (!packageJsonPath || !appJsonPath) {
    throw new Error('Could not find package.json or app.json');
  }
  
  console.log(`Using package.json: ${packageJsonPath}`);
  console.log(`Using app.json: ${appJsonPath}`);
  
  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Read app.json
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  
  // Get current version
  const currentVersion = packageJson.version;
  console.log(`Current version: ${currentVersion}`);
  
  // Parse version components
  const versionParts = currentVersion.split('.').map(Number);
  let [major, minor, patch] = versionParts;
  
  // Bump version based on type
  switch (type) {
    case 'major':
      major += 1;
      minor = 0;
      patch = 0;
      break;
    case 'minor':
      minor += 1;
      patch = 0;
      break;
    case 'patch':
    default:
      patch += 1;
      break;
  }
  
  const newVersion = `${major}.${minor}.${patch}`;
  console.log(`New version: ${newVersion}`);
  
  // Update package.json
  packageJson.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  
  // Update app.json
  appJson.expo.version = newVersion;
  
  // Update Android versionCode if it exists
  if (appJson.expo.android && appJson.expo.android.versionCode) {
    appJson.expo.android.versionCode += 1;
    console.log(`✅ Android versionCode bumped to ${appJson.expo.android.versionCode}`);
  }
  
  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');
  
  console.log(`✅ Version bumped to ${newVersion} in both package.json and app.json`);
  
  return newVersion;
}

// Get version bump type from command line arguments
const bumpType = process.argv[2] || 'patch';
const validTypes = ['major', 'minor', 'patch'];

if (!validTypes.includes(bumpType)) {
  console.error(`❌ Invalid bump type: ${bumpType}`);
  console.error(`Valid types: ${validTypes.join(', ')}`);
  process.exit(1);
}

try {
  bumpVersion(bumpType);
} catch (error) {
  console.error('❌ Error bumping version:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}