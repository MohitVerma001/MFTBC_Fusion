#!/bin/bash

# FUSION Deployment Script
# FUSO Brand Theme: PostgreSQL + Express + React
# Never use Supabase

set -e

echo "🚀 FUSION Deployment"
echo "===================="

# Build frontend
echo ""
echo "📦 Building frontend..."
cd frontend
npm run build
cd ..

# Copy frontend build to backend public folder (if needed)
# Uncomment if you want to serve frontend from backend
# mkdir -p backend/public
# cp -r frontend/dist/* backend/public/

echo ""
echo "🔄 Backend setup..."
cd backend
npm install --production

echo ""
echo "✅ Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Upload files to your server"
echo "2. Set environment variables on server"
echo "3. Run migrations on production database"
echo "4. Start backend: npm start"
echo "5. Configure nginx/apache to serve frontend and proxy API"
