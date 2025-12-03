# MFTBC-FUSION Blog System

Complete full-stack blog management system with React frontend and Node.js backend.

## 📁 Project Structure

```
MFTBC-FUSION/
├── backend/                      # Node.js + Express API
│   ├── src/
│   │   ├── models/              # Database models
│   │   ├── controllers/         # Business logic
│   │   ├── routes/              # API routes
│   │   ├── middleware/          # Custom middleware
│   │   ├── services/            # Business services
│   │   └── utils/               # Utility functions
│   ├── uploads/                 # File storage
│   ├── app.js                   # Express app configuration
│   ├── server.js                # Server entry point
│   ├── database.js              # Supabase connection
│   └── package.json
│
└── frontend/                     # React Application
    ├── src/
    │   ├── components/          # Reusable UI components
    │   ├── pages/               # Page components
    │   ├── forms/               # Form components
    │   ├── api/                 # API integration
    │   ├── hooks/               # Custom React hooks
    │   └── utils/               # Utility functions
    ├── index.html
    ├── src/index.jsx            # React entry point
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account
- PostgreSQL database (via Supabase)

### Backend Setup

```bash
cd MFTBC-FUSION/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your Supabase credentials
nano .env

# Start development server
npm run dev
```

Backend runs on: **http://localhost:5000**

### Frontend Setup

```bash
cd MFTBC-FUSION/frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with API URL
nano .env

# Start development server
npm run dev
```

Frontend runs on: **http://localhost:3000**

## 🗄️ Database Schema

The system uses PostgreSQL (via Supabase) with the following tables:

- **blogs** - Main blog posts table
- **categories** - Blog categories (HR-specific)
- **places** - Organizational places/departments
- **tags** - Searchable tags
- **blog_tags** - Many-to-many blog-tag relationships
- **images** - Blog images
- **attachments** - File attachments

Database migration is already applied via Supabase.

## 📡 API Endpoints

### Blogs
- `POST /api/blogs` - Create blog post
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get blog by ID
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog

### Categories
- `GET /api/categories` - Get categories
- `GET /api/categories?parentCategory=HR` - Filter by parent

### Tags
- `GET /api/tags` - Get all tags
- `GET /api/tags?search=query` - Search tags
- `POST /api/tags` - Create new tag

### Places
- `GET /api/places` - Get all places

## 🎨 Features

### Frontend
- ✅ Dynamic HR category loading
- ✅ Searchable tag system with autocomplete
- ✅ Create new tags on-the-fly
- ✅ React-Quill rich text editor
- ✅ Multi-file image upload with preview
- ✅ Multi-file attachment upload
- ✅ Advanced options (restricted comments, place blog)
- ✅ Form validation
- ✅ Success animation
- ✅ Bootstrap 5 UI with custom animations

### Backend
- ✅ RESTful API
- ✅ File upload handling (Multer)
- ✅ PostgreSQL with Supabase
- ✅ Row Level Security (RLS)
- ✅ Proper error handling
- ✅ CORS enabled
- ✅ Environment configuration

## 🔒 Security

- Row Level Security (RLS) policies on all tables
- File type and size validation
- SQL injection protection
- Authenticated user checks
- Secure file storage

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- Supabase (PostgreSQL)
- Multer (file uploads)
- CORS
- dotenv

**Frontend:**
- React 18
- React Router
- Bootstrap 5
- React-Quill (rich text)
- Vite (build tool)

## 📚 Documentation

Detailed documentation available in:
- Backend API: See `backend/README.md`
- Integration Guide: See root `INTEGRATION_GUIDE.md`

## 🐛 Troubleshooting

**Backend won't start:**
- Check `.env` file exists
- Verify Supabase credentials
- Ensure PORT 5000 is available

**Frontend can't connect:**
- Check backend is running
- Verify `VITE_API_URL` in frontend `.env`
- Check browser console for errors

**File uploads fail:**
- Check `uploads/` directory exists
- Verify file size under 10MB
- Check allowed file types

## 📄 License

ISC

## 👥 Authors

MFTBC Development Team
