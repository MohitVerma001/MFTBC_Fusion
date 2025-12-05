#!/bin/bash

# FUSION Database Migration Script
# FUSO Brand Theme: PostgreSQL only - Never use Supabase

set -e

echo "🗄️  FUSION Database Migration"
echo "============================"

# Load environment variables
if [ -f "backend/.env" ]; then
    export $(cat backend/.env | grep -v '^#' | xargs)
else
    echo "❌ backend/.env not found. Please run setup.sh first."
    exit 1
fi

# Check if database exists
if ! psql -h "$DB_HOST" -U "$DB_USER" -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    echo "⚠️  Database $DB_NAME does not exist."
    read -p "Create database? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        createdb -h "$DB_HOST" -U "$DB_USER" "$DB_NAME"
        echo "✓ Database created"
    else
        exit 1
    fi
fi

# Run migrations
echo ""
echo "📦 Running migrations..."

if [ -f "backend/fusion_schema.sql" ]; then
    echo "Applying fusion_schema.sql..."
    psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -f backend/fusion_schema.sql
    echo "✓ Schema applied"
fi

# Run individual migration files if they exist
if [ -d "backend/migrations" ]; then
    for migration in backend/migrations/*.sql; do
        if [ -f "$migration" ]; then
            echo "Applying $(basename $migration)..."
            psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -f "$migration"
        fi
    done
fi

echo ""
echo "✅ Migrations complete!"
