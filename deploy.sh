#!/bin/bash

# Quick Vercel Deployment Script for IcePulse Player App

echo "🚀 Deploying IcePulse Player App to Vercel..."
echo ""

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "📝 Please login to Vercel first:"
    echo "   vercel login"
    exit 1
fi

echo "✅ Logged in to Vercel"
echo ""
echo "📦 Deploying to Vercel..."
echo ""

# Deploy
vercel

echo ""
echo "✨ Deployment complete!"
echo ""
echo "To deploy to production, run:"
echo "   vercel --prod"

