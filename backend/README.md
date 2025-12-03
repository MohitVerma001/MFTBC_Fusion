# MFTBC Blog System Backend

Node.js + Express + PostgreSQL (Supabase) backend for the MFTBC Blog System.

## Features

- RESTful API for blog management
- File upload handling (images & attachments)
- PostgreSQL database with proper relationships
- Row Level Security (RLS) policies
- Tag management with search
- Category and Place management
- Multi-file upload support

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

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

### 3. Database Setup

The database schema is already applied via Supabase migrations. Tables created:

- `categories` - Blog categories (HR-specific)
- `places` - Organizational places/departments
- `tags` - Blog tags
- `blogs` - Main blog posts table
- `blog_tags` - Junction table for blog-tag relationships
- `images` - Blog images
- `attachments` - Blog file attachments

### 4. Start Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Blogs

**Create Blog Post**
```
POST /api/blogs
Content-Type: multipart/form-data

Form Data:
- title: string (required)
- content: string (required, HTML from React-Quill)
- publishTo: string (required, one of: News, HR, IT)
- categoryId: uuid (required if publishTo = HR)
- placeId: uuid (optional, required if isPlaceBlog = true)
- restrictedComments: boolean
- isPlaceBlog: boolean
- authorId: uuid (required)
- tagIds: JSON array of tag UUIDs
- images: files (max 10)
- attachments: files (max 5)

Response:
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

**Get All Blogs**
```
GET /api/blogs?publishTo=News&categoryId=uuid

Response:
{
  "success": true,
  "data": [...]
}
```

**Get Blog by ID**
```
GET /api/blogs/:id

Response:
{
  "success": true,
  "data": {
    "id": "...",
    "title": "...",
    "tags": [...],
    "images": [...],
    "attachments": [...]
  }
}
```

**Update Blog**
```
PUT /api/blogs/:id
Content-Type: application/json

Body:
{
  "title": "...",
  "content": "..."
}
```

**Delete Blog**
```
DELETE /api/blogs/:id
```

### Categories

**Get Categories**
```
GET /api/categories?parentCategory=HR

Response:
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

### Tags

**Get Tags**
```
GET /api/tags?search=training

Response:
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

**Create Tag**
```
POST /api/tags
Content-Type: application/json

Body:
{
  "name": "New Tag"
}

Response:
{
  "success": true,
  "message": "Tag created successfully",
  "data": {
    "id": "uuid",
    "name": "New Tag",
    "slug": "new-tag"
  }
}
```

### Places

**Get Places**
```
GET /api/places

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Engineering Department",
      "description": "...",
      "type": "department"
    }
  ]
}
```

## File Uploads

Files are stored locally in the `uploads` directory:
- Images: `uploads/images/`
- Attachments: `uploads/attachments/`

File URLs are returned as `/uploads/{type}/{filename}` and served statically.

### Supported File Types

**Images:**
- All image MIME types (image/*)

**Attachments:**
- PDF (application/pdf)
- Word (application/msword, .docx)
- Excel (application/vnd.ms-excel, .xlsx)
- Text (text/plain)

**File Size Limit:** 10MB per file

## Database Schema

### blogs table
```sql
- id: uuid (PK)
- title: text
- content: text (HTML)
- publish_to: text (News, HR, IT)
- category_id: uuid (FK → categories)
- place_id: uuid (FK → places)
- restricted_comments: boolean
- is_place_blog: boolean
- author_id: uuid
- status: text (draft, published, archived)
- published_at: timestamptz
- created_at: timestamptz
- updated_at: timestamptz
```

### Relationships
```
blogs 1:N images
blogs 1:N attachments
blogs N:M tags (via blog_tags)
blogs N:1 categories
blogs N:1 places
```

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only create/update/delete their own blogs
- Published blogs are publicly viewable
- File upload validation (type and size)
- SQL injection protection via parameterized queries

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Health Check

```
GET /health

Response:
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-12-03T..."
}
```

## Sample Data

The migration includes sample data:

**Categories (HR):**
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
- announcement
- update
- policy
- training
- benefits
- health
- remote-work
- career

## Development

```bash
# Watch mode with auto-restart
npm run dev

# Check logs
# All errors are logged to console with timestamps
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Configure proper CORS origins
3. Set up reverse proxy (nginx/Apache)
4. Enable HTTPS
5. Set appropriate file size limits
6. Configure proper backup strategy for uploads folder

## Tech Stack

- Node.js (ES Modules)
- Express.js
- Supabase (PostgreSQL)
- Multer (file uploads)
- CORS
- dotenv

## License

ISC
