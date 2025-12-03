/*
  # Blog System Schema

  ## Overview
  Complete blog system with categories, tags, places, images, and attachments.

  ## Tables Created

  ### 1. categories
  - `id` (uuid, primary key)
  - `name` (text, unique) - Category name (e.g., "Benefits", "Training")
  - `slug` (text, unique) - URL-friendly version
  - `description` (text) - Category description
  - `parent_category` (text) - Main category (News, HR, IT)
  - `created_at` (timestamptz)

  ### 2. places
  - `id` (uuid, primary key)
  - `name` (text) - Place name
  - `description` (text)
  - `type` (text) - Type of place (department, team, etc.)
  - `created_at` (timestamptz)

  ### 3. tags
  - `id` (uuid, primary key)
  - `name` (text, unique) - Tag name
  - `slug` (text, unique)
  - `created_at` (timestamptz)

  ### 4. blogs
  - `id` (uuid, primary key)
  - `title` (text, required)
  - `content` (text, required) - HTML content from React-Quill
  - `publish_to` (text, required) - News, HR, IT
  - `category_id` (uuid, FK) - Links to categories
  - `place_id` (uuid, FK) - Links to places
  - `restricted_comments` (boolean) - Comment restriction
  - `is_place_blog` (boolean) - Whether it's a place-specific blog
  - `author_id` (uuid, required)
  - `status` (text) - draft, published, archived
  - `published_at` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. blog_tags (junction table)
  - `blog_id` (uuid, FK)
  - `tag_id` (uuid, FK)
  - Primary key on (blog_id, tag_id)

  ### 6. images
  - `id` (uuid, primary key)
  - `blog_id` (uuid, FK)
  - `url` (text, required) - Image URL
  - `filename` (text)
  - `size` (integer) - File size in bytes
  - `uploaded_at` (timestamptz)

  ### 7. attachments
  - `id` (uuid, primary key)
  - `blog_id` (uuid, FK)
  - `url` (text, required) - File URL
  - `filename` (text)
  - `size` (integer) - File size in bytes
  - `mime_type` (text)
  - `uploaded_at` (timestamptz)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies for authenticated users to create/read/update their own content
  - Public read access for published blogs
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  parent_category text NOT NULL CHECK (parent_category IN ('News', 'HR', 'IT')),
  created_at timestamptz DEFAULT now()
);

-- Create places table
CREATE TABLE IF NOT EXISTS places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  type text,
  created_at timestamptz DEFAULT now()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  publish_to text NOT NULL CHECK (publish_to IN ('News', 'HR', 'IT')),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  place_id uuid REFERENCES places(id) ON DELETE SET NULL,
  restricted_comments boolean DEFAULT false,
  is_place_blog boolean DEFAULT false,
  author_id uuid NOT NULL,
  status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_tags junction table
CREATE TABLE IF NOT EXISTS blog_tags (
  blog_id uuid REFERENCES blogs(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_id, tag_id)
);

-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id uuid REFERENCES blogs(id) ON DELETE CASCADE,
  url text NOT NULL,
  filename text,
  size integer,
  uploaded_at timestamptz DEFAULT now()
);

-- Create attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id uuid REFERENCES blogs(id) ON DELETE CASCADE,
  url text NOT NULL,
  filename text,
  size integer,
  mime_type text,
  uploaded_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- Categories Policies
CREATE POLICY "Everyone can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Places Policies
CREATE POLICY "Everyone can view places"
  ON places FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create places"
  ON places FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Tags Policies
CREATE POLICY "Everyone can view tags"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create tags"
  ON tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Blogs Policies
CREATE POLICY "Everyone can view published blogs"
  ON blogs FOR SELECT
  USING (status = 'published');

CREATE POLICY "Users can create blogs"
  ON blogs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own blogs"
  ON blogs FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete own blogs"
  ON blogs FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Blog Tags Policies
CREATE POLICY "Everyone can view blog tags"
  ON blog_tags FOR SELECT
  USING (true);

CREATE POLICY "Blog authors can manage tags"
  ON blog_tags FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM blogs
      WHERE blogs.id = blog_tags.blog_id
      AND blogs.author_id = auth.uid()
    )
  );

-- Images Policies
CREATE POLICY "Everyone can view images"
  ON images FOR SELECT
  USING (true);

CREATE POLICY "Blog authors can manage images"
  ON images FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM blogs
      WHERE blogs.id = images.blog_id
      AND blogs.author_id = auth.uid()
    )
  );

-- Attachments Policies
CREATE POLICY "Everyone can view attachments"
  ON attachments FOR SELECT
  USING (true);

CREATE POLICY "Blog authors can manage attachments"
  ON attachments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM blogs
      WHERE blogs.id = attachments.blog_id
      AND blogs.author_id = auth.uid()
    )
  );

-- Insert sample categories for HR
INSERT INTO categories (name, slug, description, parent_category) VALUES
  ('Benefits & Compensation', 'benefits-compensation', 'Information about employee benefits and compensation', 'HR'),
  ('Training & Development', 'training-development', 'Training programs and professional development', 'HR'),
  ('Policies & Procedures', 'policies-procedures', 'Company policies and HR procedures', 'HR'),
  ('Employee Wellness', 'employee-wellness', 'Health and wellness programs', 'HR'),
  ('Recruitment', 'recruitment', 'Job openings and recruitment news', 'HR')
ON CONFLICT (name) DO NOTHING;

-- Insert sample places
INSERT INTO places (name, description, type) VALUES
  ('Engineering Department', 'Software and hardware engineering teams', 'department'),
  ('Sales Department', 'Sales and business development teams', 'department'),
  ('Marketing Department', 'Marketing and communications teams', 'department'),
  ('Human Resources', 'HR and people operations', 'department'),
  ('Product Team', 'Product management and design', 'team'),
  ('Customer Success', 'Customer support and success', 'team')
ON CONFLICT DO NOTHING;

-- Insert sample tags
INSERT INTO tags (name, slug) VALUES
  ('announcement', 'announcement'),
  ('update', 'update'),
  ('policy', 'policy'),
  ('training', 'training'),
  ('benefits', 'benefits'),
  ('health', 'health'),
  ('remote-work', 'remote-work'),
  ('career', 'career')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_publish_to ON blogs(publish_to);
CREATE INDEX IF NOT EXISTS idx_blogs_category_id ON blogs(category_id);
CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON blogs(author_id);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_tags_blog_id ON blog_tags(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_tags_tag_id ON blog_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_images_blog_id ON images(blog_id);
CREATE INDEX IF NOT EXISTS idx_attachments_blog_id ON attachments(blog_id);
