#!/bin/bash

# Deploy Allure reports to Netlify
# This script generates the Allure report and prepares it for Netlify deployment

echo "🚀 Starting Netlify deployment process..."

# Check if required environment variables are set
if [ -z "$ALIQUOT_BASE_URL_QA" ]; then
    echo "❌ Error: ALIQUOT_BASE_URL_QA environment variable is not set"
    exit 1
fi

if [ -z "$ALIQUOT_USERNAME_QA" ]; then
    echo "❌ Error: ALIQUOT_USERNAME_QA environment variable is not set"
    exit 1
fi

if [ -z "$ALIQUOT_PASSWORD_QA" ]; then
    echo "❌ Error: ALIQUOT_PASSWORD_QA environment variable is not set"
    exit 1
fi

echo "✅ Environment variables are set"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npm run install:browsers

# Run tests
echo "🧪 Running tests..."
npm run test:qa

# Generate Allure report
echo "📊 Generating Allure report..."
npm run test:generate-report

# Check if report was generated
if [ ! -d "allure-report" ]; then
    echo "❌ Error: Allure report was not generated"
    exit 1
fi

echo "✅ Allure report generated successfully"
echo "📁 Report location: allure-report/"
echo "🌐 Ready for Netlify deployment!"

# Optional: Start local server to preview
if [ "$1" = "--preview" ]; then
    echo "🔍 Starting local preview server..."
    npm run test:report
fi
