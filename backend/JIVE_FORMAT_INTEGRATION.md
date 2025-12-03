# Jive Format Integration - Complete

## Overview

The FUSION backend now returns blog posts in Jive-compatible JSON format while maintaining PostgreSQL schema internally.

---

## Jive JSON Response Format

When creating or updating a blog, the API returns:

```json
{
  "id": "192240",
  "subject": "Blog Title Here",
  "content": {
    "text": "<body>...HTML content...</body>"
  },
  "published": "2025-11-14T06:23:00.263+0000",
  "updated": "2025-11-14T06:23:00.263+0000",
  "author": {
    "id": "728212",
    "displayName": "Author Name",
    "type": "person"
  },
  "tags": ["tag1", "tag2"],
  "likeCount": 0,
  "followerCount": 0,
  "viewCount": 0,
  "attachments": [
    {
      "id": "123",
      "name": "document.pdf",
      "url": "/uploads/file.pdf",
      "size": 1024,
      "contentType": "application/pdf"
    }
  ],
  "contentImages": [
    {
      "id": "456",
      "ref": "/uploads/image.jpg",
      "name": "image.jpg"
    }
  ],
  "parentPlace": {
    "id": "6220",
    "name": "MFTBC",
    "type": "blog"
  },
  "question": false,
  "restrictReplies": false,
  "type": "post"
}
```

---

## Field Mappings

### Database → Jive Format

| Database Column | Jive Field | Transformation |
|----------------|------------|----------------|
| `id` | `id` | String |
| `title` | `subject` | Direct |
| `content_html` | `content.text` | Wrapped in `<body>` |
| `published_at` | `published` | ISO 8601 |
| `updated_at` | `updated` | ISO 8601 |
| `author_id` | `author` | Object with id, displayName, type |
| `tags` (junction) | `tags` | Array of tag names |
| `blog_images` | `contentImages` | Array with id, ref, name |
| `blog_attachments` | `attachments` | Array with id, name, url, size, contentType |
| `place_id` | `parentPlace` | Object with id, name, type (defaults to MFTBC) |
| `restricted_comments` | `restrictReplies` | Boolean |
| `like_count` | `likeCount` | Number (default 0) |
| `view_count` | `viewCount` | Number (default 0) |
| - | `followerCount` | Always 0 |
| - | `question` | Always false |
| - | `type` | Always "post" |

---

## API Endpoints

### Create Blog (Returns Jive Format)

```
POST /api/blogs
Content-Type: application/json

{
  "subject": "Blog Title",
  "content": "Blog content",
  "contentHtml": "<body>Blog content</body>",
  "publishTo": "News",
  "tags": ["tag1", "tag2"],
  "contentImages": ["url1", "url2"],
  "attachments": [
    {
      "url": "/uploads/file.pdf",
      "name": "document.pdf",
      "size": 1024,
      "contentType": "application/pdf"
    }
  ],
  "restrictReplies": false,
  "categoryId": 1,
  "placeId": null
}
```

**Response:** Jive format JSON (as shown above)

### Get All Blogs

**Default Format (with success wrapper):**
```
GET /api/blogs?publishTo=News
```

Returns:
```json
{
  "success": true,
  "data": [...]
}
```

**Jive Format (array only):**
```
GET /api/blogs?publishTo=News&jiveFormat=true
```

Returns:
```json
[
  { "id": "1", "subject": "...", ... },
  { "id": "2", "subject": "...", ... }
]
```

### Get Single Blog

**Default Format:**
```
GET /api/blogs/:id
```

Returns:
```json
{
  "success": true,
  "data": { ... }
}
```

**Jive Format:**
```
GET /api/blogs/:id?jiveFormat=true
```

Returns: Jive format JSON directly

### Update Blog (Returns Jive Format)

```
PUT /api/blogs/:id
Content-Type: application/json

{
  "subject": "Updated Title",
  "restrictReplies": true
}
```

**Response:** Jive format JSON

---

## Backend Implementation

### blog.model.js

Added transformation functions:

1. **`getAuthor(authorId)`** - Fetches user and formats as Jive author object
2. **`transformToJiveFormat(blog, tags, images, attachments, author, place)`** - Converts DB format to Jive format

### blog.controller.js

Updated all endpoints:

1. **`createBlog`** - Returns Jive format directly
2. **`getAllBlogs`** - Supports `jiveFormat=true` query parameter
3. **`getBlogById`** - Supports `jiveFormat=true` query parameter
4. **`updateBlog`** - Returns Jive format directly

### Key Features

- **Accepts both formats:** `subject` or `title`, `restrictReplies` or `restrictedComments`
- **Content wrapping:** Automatically wraps content in `<body>` tags
- **Tag name arrays:** Converts tag objects to simple string arrays
- **Default parentPlace:** Uses MFTBC (id: 6220) when no place selected
- **Author lookup:** Fetches user from `users` table
- **Image mapping:** Converts `blog_images` to `contentImages` format
- **Attachment mapping:** Converts `blog_attachments` to Jive attachment format

---

## Frontend Integration

### CreateBlog.jsx Changes

1. **Upload files first:** Images and attachments uploaded via `/api/upload/single`
2. **Build Jive payload:**
   ```javascript
   const blogPayload = {
     subject: formData.title,
     content: formData.content,
     contentHtml: wrappedContent,
     publishTo: formData.publishTo,
     restrictReplies: formData.restrictedComments,
     tags: formData.tags.map(t => t.name),
     contentImages: imageUrls,
     attachments: attachmentData
   };
   ```
3. **Send as JSON:** Uses `Content-Type: application/json`
4. **Detect success:** Checks for `result.id` (Jive format) instead of `result.success`

---

## Business Rules

### Default Values

- **parentPlace.id:** `"6220"` (MFTBC)
- **parentPlace.name:** `"MFTBC"`
- **parentPlace.type:** `"blog"`
- **type:** `"post"`
- **question:** `false`
- **followerCount:** `0`
- **likeCount:** `blog.like_count || 0`
- **viewCount:** `blog.view_count || 0`

### Place Selection

- If `placeId` is provided, uses that place
- If `placeId` is null/undefined, uses MFTBC default
- Place is **never mandatory**

### Publishing Rules

- **News:** No category required, placeId optional
- **HR:** Category required, placeId optional
- **IT:** No category required, placeId optional

---

## Database Schema

No changes to PostgreSQL schema. All transformations happen at the response level.

**Tables remain unchanged:**
- `blogs` (title, content, content_html, publish_to, etc.)
- `blog_tags` (junction table)
- `blog_images` (image_url)
- `blog_attachments` (file_url, file_name, file_size, mime_type)
- `tags` (name, slug)
- `places` (name, description)
- `users` (id, display_name, email)

---

## Testing

### Create Blog Test

```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test Blog",
    "content": "Test content",
    "publishTo": "News",
    "tags": ["test", "demo"],
    "contentImages": [],
    "attachments": []
  }'
```

Expected response: Jive format JSON

### Get Blogs (News) Test

```bash
curl http://localhost:5000/api/blogs?publishTo=News&jiveFormat=true
```

Expected response: Array of Jive format blogs

---

## Migration Notes

### For Frontend Developers

1. **Response format changed:** No more `{success: true, data: {...}}`
2. **Direct Jive JSON:** Response is the blog object directly
3. **Field names:** Use `subject` instead of `title`, `restrictReplies` instead of `restrictedComments`
4. **Content wrapper:** Content automatically wrapped in `<body>` tags
5. **Tags:** Send as array of strings, not objects

### For API Consumers

1. **Backward compatibility:** Add `?jiveFormat=false` to get old format (with success wrapper)
2. **Default behavior:** POST/PUT returns Jive format always
3. **GET endpoints:** Use `?jiveFormat=true` for Jive format, default includes success wrapper

---

## Examples

### Example 1: Create News Blog

**Request:**
```json
POST /api/blogs
{
  "subject": "Company Update",
  "content": "<p>We are excited to announce...</p>",
  "publishTo": "News",
  "tags": ["announcement", "company-news"],
  "restrictReplies": false
}
```

**Response:**
```json
{
  "id": "1",
  "subject": "Company Update",
  "content": {
    "text": "<body><p>We are excited to announce...</p></body>"
  },
  "published": "2025-12-03T12:00:00.000Z",
  "updated": "2025-12-03T12:00:00.000Z",
  "author": {
    "id": "1",
    "displayName": "Anonymous User",
    "type": "person"
  },
  "tags": ["announcement", "company-news"],
  "likeCount": 0,
  "followerCount": 0,
  "viewCount": 0,
  "attachments": [],
  "contentImages": [],
  "parentPlace": {
    "id": "6220",
    "name": "MFTBC",
    "type": "blog"
  },
  "question": false,
  "restrictReplies": false,
  "type": "post"
}
```

### Example 2: Create HR Blog with Category

**Request:**
```json
POST /api/blogs
{
  "subject": "New HR Policy",
  "content": "<p>Please review the updated policy...</p>",
  "publishTo": "HR",
  "categoryId": 2,
  "tags": ["hr", "policy"],
  "restrictReplies": true
}
```

**Response:** Same Jive format with appropriate fields

### Example 3: Get News Blogs

**Request:**
```
GET /api/blogs?publishTo=News&jiveFormat=true
```

**Response:**
```json
[
  {
    "id": "1",
    "subject": "Company Update",
    ...
  },
  {
    "id": "2",
    "subject": "Product Launch",
    ...
  }
]
```

---

## Build Status

```
npm run build
✓ 183 modules transformed
✓ built in 5.55s
```

All changes complete. Backend and frontend fully integrated with Jive format.

---

## Summary

- ✅ Backend returns Jive-compatible JSON
- ✅ Database schema unchanged (PostgreSQL)
- ✅ Transformation happens at response level
- ✅ Frontend updated to send Jive format
- ✅ Backward compatibility available via query param
- ✅ Default parentPlace (MFTBC) implemented
- ✅ All field mappings complete
- ✅ Build successful with no errors

The FUSION Intranet now generates Jive-style JSON responses while maintaining PostgreSQL database schema internally.
