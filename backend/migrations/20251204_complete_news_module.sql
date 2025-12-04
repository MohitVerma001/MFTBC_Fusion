/*
  # Complete News Module Schema

  1. Ensure users table exists with default user
  2. Create blog_likes table
  3. Create blog_comments table
  4. Add indexes for performance
  5. Insert default user if not exists
*/

-- Ensure users table exists (if not already created)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  display_name VARCHAR(200),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'user',
  department VARCHAR(100),
  job_title VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default user if not exists
INSERT INTO users (id, email, password_hash, display_name, first_name, last_name, role, is_active)
VALUES (1, 'default@mftbc.com', 'default_hash', 'Default User', 'Default', 'User', 'user', true)
ON CONFLICT (id) DO NOTHING;

-- Ensure sequence is set correctly
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- Create blog_likes table
CREATE TABLE IF NOT EXISTS blog_likes (
  id SERIAL PRIMARY KEY,
  blog_id INTEGER NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blog_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON blog_likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_user_id ON blog_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_created_at ON blog_likes(created_at DESC);

-- Create blog_comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id SERIAL PRIMARY KEY,
  blog_id INTEGER NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_user_id ON blog_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON blog_comments(created_at DESC);

-- Create or replace trigger function for updated_at
CREATE OR REPLACE FUNCTION update_blog_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_blog_comments_updated_at ON blog_comments;
CREATE TRIGGER trigger_blog_comments_updated_at
  BEFORE UPDATE ON blog_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_comments_updated_at();

-- Add indexes to blogs table for better query performance
CREATE INDEX IF NOT EXISTS idx_blogs_published_date ON blogs(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON blogs(author_id);
CREATE INDEX IF NOT EXISTS idx_blogs_publish_to ON blogs(publish_to);
CREATE INDEX IF NOT EXISTS idx_blogs_is_published ON blogs(is_published);
