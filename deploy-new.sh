#!/bin/bash

# Deploy IcePulse Player App as a NEW Vercel project

echo "🚀 Deploying IcePulse Player App as NEW project..."
echo ""

# Make sure we're in the right directory
cd "/Users/williamdoss/IcePulse Player App"

# Remove any existing Vercel link
if [ -d ".vercel" ]; then
    echo "🗑️  Removing existing .vercel link..."
    rm -rf .vercel
fi

echo "📦 Deploying as NEW project: icepulse-player-app"
echo ""

# Deploy with explicit project name
vercel --name icepulse-player-app --yes

echo ""
echo "✨ Deployment initiated!"
echo ""
echo "To deploy to production, run:"
echo "   vercel --prod"

