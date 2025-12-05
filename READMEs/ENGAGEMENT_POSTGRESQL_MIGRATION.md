# Engagement Features Migration to PostgreSQL

## Overview
Migrated Like, Comment, and Bookmark functionality from Supabase to PostgreSQL backend with Node.js.

## Changes Made

### Backend Changes

#### 1. Database Migration
Created `/backend/migrations/20251205_create_engagement_tables.sql` with three tables:

**blog_likes**
- id (SERIAL PRIMARY KEY)
- blog_id (INTEGER, FK to blogs)
- user_id (VARCHAR)
- created_at (TIMESTAMP)
- Unique constraint on (blog_id, user_id)

**blog_comments**
- id (SERIAL PRIMARY KEY)
- blog_id (INTEGER, FK to blogs)
- user_id (VARCHAR)
- user_name (VARCHAR)
- comment (TEXT)
- parent_comment_id (INTEGER, FK to blog_comments for nested comments)
- created_at, updated_at (TIMESTAMP)

**blog_bookmarks**
- id (SERIAL PRIMARY KEY)
- blog_id (INTEGER, FK to blogs)
- user_id (VARCHAR)
- created_at (TIMESTAMP)
- Unique constraint on (blog_id, user_id)

#### 2. Backend API Endpoints
Created `/backend/src/controllers/engagement.controller.js` with:
- toggleLike() - Add/remove like
- getLikeCount() - Get total likes for a blog
- checkUserLiked() - Check if user liked a blog
- addComment() - Add new comment
- getComments() - Get all comments for a blog
- deleteComment() - Delete a comment
- toggleBookmark() - Add/remove bookmark
- checkUserBookmarked() - Check if user bookmarked a blog

Created `/backend/src/routes/engagement.routes.js` with routes:
- POST /api/engagement/blogs/:blogId/like
- GET /api/engagement/blogs/:blogId/like/count
- GET /api/engagement/blogs/:blogId/like/check
- POST /api/engagement/blogs/:blogId/comments
- GET /api/engagement/blogs/:blogId/comments
- DELETE /api/engagement/comments/:commentId
- POST /api/engagement/blogs/:blogId/bookmark
- GET /api/engagement/blogs/:blogId/bookmark/check

Updated `/backend/app.js`:
- Added engagement routes
- Updated API documentation endpoint

### Frontend Changes

#### 1. Removed Supabase
- Uninstalled @supabase/supabase-js package
- Deleted `/frontend/src/lib/supabase.js`
- Removed Supabase environment variables

#### 2. Updated Engagement API
Rewrote `/frontend/src/services/engagement.api.js` to use backend API:
- Uses fetch API to call backend endpoints
- Maintains anonymous user ID in localStorage
- Sends user ID via x-user-id header and request body
- Same interface as before (no changes needed in components)

#### 3. Component Updates
No changes needed! The following components continue to work with the new backend:
- LikeButton.jsx
- Comments.jsx
- NewsDetail.jsx (bookmark functionality)

All components use the engagement API service which was updated to use the backend.

## Database Migration

To apply the migration, run:

```bash
cd backend
npm install
node run-migration.js
```

Or manually run the SQL file:
```bash
psql -U postgres -d FusionDev -f migrations/20251205_create_engagement_tables.sql
```

## Anonymous User Support

The system supports anonymous users by:
1. Generating a unique anonymous user ID on first interaction
2. Storing it in localStorage (`anonymous_user_id`)
3. Sending it with all engagement requests
4. Backend accepts any user ID (no authentication required)

This allows users to interact without logging in while maintaining their engagement state across sessions.

## API Usage Examples

### Toggle Like
```javascript
POST /api/engagement/blogs/1/like
Headers:
  x-user-id: anon_1234567890_abc123
Body: { userId: "anon_1234567890_abc123" }

Response: { success: true, liked: true, likeCount: 5 }
```

### Add Comment
```javascript
POST /api/engagement/blogs/1/comments
Headers:
  x-user-id: anon_1234567890_abc123
Body: {
  userId: "anon_1234567890_abc123",
  comment: "Great article!",
  userName: "John Doe"
}

Response: { success: true, data: { id: 1, comment: "...", ... } }
```

### Toggle Bookmark
```javascript
POST /api/engagement/blogs/1/bookmark
Headers:
  x-user-id: anon_1234567890_abc123
Body: { userId: "anon_1234567890_abc123" }

Response: { success: true, bookmarked: true }
```

## Testing

1. Start the backend:
```bash
cd backend
npm install
npm start
```

2. Start the frontend:
```bash
cd frontend
npm install
npm run dev
```

3. Navigate to a news article and test:
   - Like button (should increment/decrement count)
   - Comments section (add, view, delete comments)
   - Bookmark button (in sidebar quick actions)

## Environment Configuration

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=FusionDev
PORT=5000
```

### Frontend (.env or public/env.js)
```
VITE_API_URL=http://localhost:5000/api
```

## Benefits

1. **No External Dependencies**: All data stored in your own PostgreSQL database
2. **Better Control**: Full control over data and queries
3. **Cost Effective**: No Supabase subscription needed
4. **Unified Backend**: All APIs in one place (blogs, categories, engagement, etc.)
5. **Flexible Authentication**: Easy to add authentication later
6. **Better Performance**: Direct database queries without external API calls

## Future Enhancements

1. Add authentication middleware for logged-in users
2. Implement comment threading (nested replies)
3. Add comment editing functionality
4. Implement notification system for likes/comments
5. Add rate limiting for spam prevention
6. Implement comment moderation features
