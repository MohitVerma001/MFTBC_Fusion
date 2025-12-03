# MFTBC FUSION Backend

Complete Node.js + Express + PostgreSQL (Supabase) backend for the MFTBC FUSION project.

## Installation

```bash
cd backend
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

## Running the Server

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Endpoints

### Blogs
- POST /api/blogs - Create blog
- GET /api/blogs - Get all blogs
- GET /api/blogs/:id - Get blog by ID

### Categories
- POST /api/categories - Create category
- GET /api/categories - Get all categories
- GET /api/categories?type=Category - Get categories only
- GET /api/categories?type=Link - Get links only

### Tags
- POST /api/tags - Create tag
- GET /api/tags - Get all tags

### Subspaces
- POST /api/subspaces - Create subspace
- GET /api/subspaces - Get all subspaces

### Upload
- POST /api/upload - Upload single file
- POST /api/upload/multiple - Upload multiple files

## Features

- Full CRUD for blogs, categories, tags, subspaces
- File upload handling
- Image and attachment management
- Tag auto-creation
- Relationship management
- Input validation
- Error handling
