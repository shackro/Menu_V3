#!/bin/bash
# Quick start script for local development

echo "🚀 Starting Savanna Grill Menu App..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check for .env.local
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Creating from template..."
fi

echo "✅ Dependencies ready"
echo ""
echo "🔧 Starting dev server on http://localhost:5173"
echo "Press Ctrl+C to stop"
echo ""

npm run dev
