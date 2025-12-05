#!/bin/bash

# FUSION Project Setup Script
# FUSO Brand Theme: PostgreSQL + Express + React (Vite)
# Never use Supabase

set -e

echo "🚀 FUSION Project Setup"
echo "========================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js version: $(node -v)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL client not found. Please ensure PostgreSQL is installed."
fi

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create .env files if they don't exist
echo ""
echo "📝 Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env from template..."
    cat > backend/.env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=fusion_db

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# JWT (optional)
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRES_IN=7d
EOF
    echo "⚠️  Please edit backend/.env with your database credentials"
fi

if [ ! -f "frontend/.env" ]; then
    echo "Creating frontend/.env from template..."
    cat > frontend/.env << EOF
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
EOF
fi

# Update frontend/public/env.js
echo "window.__ENV = { VITE_API_BASE_URL: 'http://localhost:5000' };" > frontend/public/env.js

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your PostgreSQL credentials"
echo "2. Create the database: createdb fusion_db"
echo "3. Run migrations: ./scripts/migrate.sh"
echo "4. Start backend: cd backend && npm run dev"
echo "5. Start frontend: cd frontend && npm run dev"
