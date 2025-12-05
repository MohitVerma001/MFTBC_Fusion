# MFTBC Blog System - Full Stack Integration Guide

Complete guide for the MFTBC Blog System with React frontend and Node.js backend.

## 📁 Project Structure

```
MFTBC-FUSION/
├── frontend/                      # React Application
│   ├── src/
│   │   ├── components/
│   │   │   └── FormComponents/   # Reusable form components
│   │   └── pages/
│   │       └── CreateBlog/       # Blog creation form
│   ├── package.json
│   └── .env
│
└── backend/                       # Node.js + Express API
    ├── config/
    │   └── database.js           # Supabase configuration
    ├── controllers/
    │   └── blog.controller.js    # Blog API logic
    ├── models/
    │   └── blog.model.js         # Database operations
    ├── routes/
    │   └── blog.routes.js        # API routes
    ├── middleware/
    │   └── upload.js             # File upload handling
    ├── uploads/                  # File storage
    │   ├── images/
    │   └── attachments/
    ├── server.js                 # Express server
    ├── package.json
    └── .env
```

## 🗄️ Database Schema (PostgreSQL via Supabase)

### Tables

**1. categories**
```sql
id            uuid PRIMARY KEY
name          text UNIQUE NOT NULL
slug          text UNIQUE NOT NULL
description   text
parent_category text NOT NULL (News, HR, IT)
created_at    timestamptz
```

**2. places**
```sql
id            uuid PRIMARY KEY
name          text NOT NULL
description   text
type          text
created_at    timestamptz
```

**3. tags**
```sql
id            uuid PRIMARY KEY
name          text UNIQUE NOT NULL
slug          text UNIQUE NOT NULL
created_at    timestamptz
```

**4. blogs**
```sql
id                  uuid PRIMARY KEY
title               text NOT NULL
content             text NOT NULL (HTML from React-Quill)
publish_to          text NOT NULL (News, HR, IT)
category_id         uuid FK → categories
place_id            uuid FK → places
restricted_comments boolean DEFAULT false
is_place_blog       boolean DEFAULT false
author_id           uuid NOT NULL
status              text (draft, published, archived)
published_at        timestamptz
created_at          timestamptz
updated_at          timestamptz
```

**5. blog_tags (junction table)**
```sql
blog_id  uuid FK → blogs (CASCADE)
tag_id   uuid FK → tags (CASCADE)
PRIMARY KEY (blog_id, tag_id)
```

**6. images**
```sql
id          uuid PRIMARY KEY
blog_id     uuid FK → blogs (CASCADE)
url         text NOT NULL
filename    text
size        integer (bytes)
uploaded_at timestamptz
```

**7. attachments**
```sql
id          uuid PRIMARY KEY
blog_id     uuid FK → blogs (CASCADE)
url         text NOT NULL
filename    text
size        integer (bytes)
mime_type   text
uploaded_at timestamptz
```

### Sample Data Included

**HR Categories:**
- Benefits & Compensation
- Training & Development
- Policies & Procedures
- Employee Wellness
- Recruitment

**Places:**
- Engineering Department
- Sales Department
- Marketing Department
- Human Resources
- Product Team
- Customer Success

**Tags:**
- announcement, update, policy, training, benefits, health, remote-work, career

## 🚀 Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

**Dependencies:**
- express (^4.18.2)
- @supabase/supabase-js (^2.39.0)
- cors (^2.8.5)
- dotenv (^16.3.1)
- multer (^1.4.5-lts.1)
- express-validator (^7.0.1)

### 2. Configure Environment Variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

### 3. Start Backend Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server runs on: `http://localhost:5000`

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start Frontend

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 📡 API Endpoints

### Create Blog Post

```http
POST /api/blogs
Content-Type: multipart/form-data
```

**Form Data:**
```javascript
{
  title: string (required),
  content: string (required, HTML),
  publishTo: "News" | "HR" | "IT" (required),
  categoryId: uuid (required if publishTo = "HR"),
  placeId: uuid (optional),
  restrictedComments: boolean,
  isPlaceBlog: boolean,
  authorId: uuid (required),
  tagIds: JSON string of uuid array,
  images: File[] (max 10),
  attachments: File[] (max 5)
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "id": "uuid",
    "title": "...",
    "content": "...",
    "tags": [...],
    "images": [...],
    "attachments": [...]
  }
}
```

### Get Categories

```http
GET /api/categories?parentCategory=HR
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Benefits & Compensation",
      "slug": "benefits-compensation",
      "parent_category": "HR"
    }
  ]
}
```

### Get Tags (with Search)

```http
GET /api/tags?search=training
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "training",
      "slug": "training"
    }
  ]
}
```

### Create New Tag

```http
POST /api/tags
Content-Type: application/json

{
  "name": "new-tag"
}
```

### Get Places

```http
GET /api/places
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Engineering Department",
      "type": "department"
    }
  ]
}
```

## 🎯 Frontend Form Flow

### 1. Initial Load
- Fetches all tags
- Fetches all places
- Initializes empty form state

### 2. Publish To Selection
- User selects: News, HR, or IT
- If HR selected → Fetches HR categories dynamically
- Shows category dropdown below

### 3. Tag Management
- **Search:** Type to search existing tags
- **Suggestions:** Shows matching tags in dropdown
- **Create New:** If tag doesn't exist, creates it via API
- **Display:** Shows selected tags as removable badges

### 4. Advanced Options
- **Restricted Comments:** Checkbox to restrict comments
- **Place Blog:** Checkbox to mark as place-specific
  - If checked → Shows places dropdown
  - Validates place selection

### 5. File Uploads
- **Images:** Multiple image files (max 10)
  - Preview thumbnails shown
  - Hover to remove
- **Attachments:** Multiple document files (max 5)
  - Shows file icon, name, and size
  - Click to remove

### 6. Form Submission
1. Validates required fields
2. Creates FormData object
3. Appends all form fields
4. Appends file objects
5. Sends POST request to `/api/blogs`
6. Shows success animation (checkmark)
7. Redirects based on publishTo value

### 7. Success Animation
- Animated green checkmark
- "Blog Published Successfully!" message
- Auto-close after 2 seconds
- Redirects to appropriate page

## 🎨 UI Features

### WOW Animations

**Form Sections:**
- Slide-in animation with staggered delays
- Each section animates 0.1s after previous

**Category/Place Fields:**
- Fade-in when conditions met
- Smooth height transition

**Tag Suggestions:**
- Dropdown with shadow
- Hover effect on items

**Success Animation:**
- Full-screen overlay
- Animated checkmark drawing
- Rotating circle
- Fade out transition

### Styling

**Colors:**
- Primary: #dc2626 (Red)
- Secondary: #2563eb (Blue)
- Success: #22c55e (Green)
- Background: Gradient from #f5f7fa to #e9ecef

**Components:**
- Rounded corners (10-16px)
- Box shadows for depth
- Hover lift effects
- Focus glow states

## 🔒 Security

### Row Level Security (RLS)

**blogs table:**
- Everyone can view published blogs
- Users can create blogs (author_id check)
- Users can update/delete own blogs only

**blog_tags, images, attachments:**
- Accessible only to blog authors
- Cascade delete when blog deleted

### File Upload Security

**Validation:**
- File type checking (images vs attachments)
- File size limit (10MB)
- Sanitized filenames
- Unique naming to prevent conflicts

**Storage:**
- Local filesystem in uploads/ directory
- Served statically via Express
- Separate folders for images and attachments

## 🔄 Data Flow Example

### Creating a Blog Post

```
1. User fills form
   ↓
2. Selects "HR" → Categories loaded dynamically
   ↓
3. Searches "training" tag → Suggestions shown
   ↓
4. Uploads 2 images + 1 PDF
   ↓
5. Clicks "Publish Blog"
   ↓
6. Frontend validates fields
   ↓
7. Creates FormData with:
   - Form fields (title, content, etc.)
   - Tag IDs as JSON array
   - Image files
   - Attachment files
   ↓
8. POST to /api/blogs
   ↓
9. Backend:
   - Validates data
   - Saves files to disk
   - Creates blog record
   - Links tags (blog_tags table)
   - Saves image records with URLs
   - Saves attachment records
   ↓
10. Returns complete blog object
   ↓
11. Frontend shows success animation
   ↓
12. Redirects to News page
```

## 📝 Code Examples

### Frontend: Creating Blog

```javascript
const formDataToSend = new FormData();

formDataToSend.append('title', formData.title);
formDataToSend.append('content', formData.content);
formDataToSend.append('publishTo', formData.publishTo);
formDataToSend.append('categoryId', formData.categoryId);
formDataToSend.append('tagIds', JSON.stringify(tagIds));

images.forEach(img => {
  formDataToSend.append('images', img.file);
});

const response = await fetch(`${API_URL}/blogs`, {
  method: 'POST',
  body: formDataToSend
});
```

### Backend: Handling Upload

```javascript
const blog = await BlogModel.create({
  title,
  content,
  publishTo,
  categoryId,
  authorId
});

// Add tags
await BlogModel.addTags(blog.id, tagIds);

// Add images
const images = req.files.images.map(file => ({
  url: `/uploads/images/${file.filename}`,
  filename: file.originalname,
  size: file.size
}));
await BlogModel.addImages(blog.id, images);
```

## 🐛 Troubleshooting

### Backend Won't Start
- Check `.env` file exists
- Verify Supabase credentials
- Ensure PORT is not in use

### Categories Not Loading
- Check Supabase connection
- Verify categories table has data
- Check console for errors

### File Upload Fails
- Check uploads/ directory exists
- Verify file size under 10MB
- Check file type is allowed

### Tags Not Searchable
- Verify tags table populated
- Check API endpoint response
- Ensure search query formatted correctly

## 🚀 Deployment

### Backend Deployment

1. Set environment to production
2. Configure CORS for frontend URL
3. Set up reverse proxy (nginx)
4. Enable HTTPS
5. Set up PM2 or similar process manager

### Frontend Deployment

1. Build production bundle: `npm run build`
2. Deploy dist/ folder to hosting
3. Configure environment variables
4. Set up CDN for static assets

## 📊 Performance Considerations

- Implement pagination for blog lists
- Add caching for categories/tags
- Optimize image sizes before upload
- Use CDN for uploaded files
- Add database indexes (already included)
- Implement lazy loading for images

## ✅ Testing Checklist

- [ ] Create blog with all fields
- [ ] Create blog with HR category
- [ ] Upload multiple images
- [ ] Upload multiple attachments
- [ ] Search and select existing tags
- [ ] Create new tags
- [ ] Enable place blog and select place
- [ ] Restrict comments
- [ ] Validate required fields
- [ ] Success animation plays
- [ ] Redirects correctly
- [ ] Blog appears in correct section

---

**Version:** 1.0.0
**Last Updated:** 2025-12-03
**Tech Stack:** React, Node.js, Express, PostgreSQL (Supabase), Multer
