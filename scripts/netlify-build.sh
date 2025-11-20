#!/bin/bash

# Netlify build script
# This script runs during Netlify build process

echo "🏗️ Starting Netlify build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npm run install:browsers

# Run tests and generate report
echo "🧪 Running tests and generating report..."
npm run test:qa

# Generate Allure report
echo "📊 Generating Allure report..."
npm run test:generate-report

# Verify report was generated
if [ ! -d "allure-report" ]; then
    echo "❌ Error: Allure report was not generated"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Report ready for deployment: allure-report/"
