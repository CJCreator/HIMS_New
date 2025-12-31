#!/bin/bash

# HIMS Deployment Script
# This script handles local deployment testing and validation

set -e

echo "🚀 HIMS Deployment Script"
echo "========================="

# Parse command line arguments
ENVIRONMENT=${1:-staging}
DRY_RUN=${2:-false}

echo "Environment: $ENVIRONMENT"
echo "Dry Run: $DRY_RUN"

# Validate environment
if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    echo "❌ Error: Environment must be 'staging' or 'production'"
    exit 1
fi

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run tests
echo "🧪 Running tests..."
npm run test:run
npm run lint
npx tsc --noEmit

# Build application
echo "🏗️ Building application for $ENVIRONMENT..."
if [[ "$ENVIRONMENT" == "staging" ]]; then
    npm run build:staging
else
    npm run build:production
fi

# Validate build
echo "✅ Validating build..."
if [ ! -d "dist" ]; then
    echo "❌ Build directory not found"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "❌ index.html not found in build"
    exit 1
fi

# Check bundle size
BUNDLE_SIZE=$(du -sh dist | cut -f1)
echo "📊 Bundle size: $BUNDLE_SIZE"

# Run security checks
echo "🔒 Running security checks..."
npm audit --audit-level=moderate

# Deploy (if not dry run)
if [[ "$DRY_RUN" == "false" ]]; then
    echo "🚀 Deploying to $ENVIRONMENT..."
    
    if [[ "$ENVIRONMENT" == "staging" ]]; then
        # Deploy to staging
        aws s3 sync dist/ s3://hims-staging-frontend --delete
        aws cloudfront create-invalidation --distribution-id E1234567890ABC --paths "/*"
        
        # Wait for deployment
        sleep 30
        
        # Health check
        echo "🏥 Running health check..."
        if curl -f https://staging.hims.arocord.com/health; then
            echo "✅ Health check passed"
        else
            echo "❌ Health check failed"
            exit 1
        fi
        
    else
        echo "⚠️ Production deployment should be done via GitHub Actions"
        echo "Use: git push origin main"
    fi
else
    echo "🔍 Dry run completed - no deployment performed"
fi

echo "🎉 Deployment script completed successfully!"