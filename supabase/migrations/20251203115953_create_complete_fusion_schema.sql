/*
  # Create Complete FUSION Schema

  1. New Tables
    - `subspaces` - SubSpace content areas
    - `blog_images` - Images associated with blogs
    - `blog_attachments` - File attachments for blogs
    - Updates to existing `blogs` table

  2. Schema Updates
    - Add missing columns to blogs table
    - Create proper foreign key relationships
    - Add indexes for performance

  3. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

CREATE TABLE IF NOT EXISTS subspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  content_html text,
  image_url text,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id uuid REFERENCES blogs(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id uuid REFERENCES blogs(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_name text,
  file_size integer,
  mime_type text,
  created_at timestamptz DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blogs' AND column_name = 'space_id'
  ) THEN
    ALTER TABLE blogs ADD COLUMN space_id uuid REFERENCES subspaces(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blogs' AND column_name = 'content_html'
  ) THEN
    ALTER TABLE blogs ADD COLUMN content_html text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blogs' AND column_name = 'is_place_blog'
  ) THEN
    ALTER TABLE blogs ADD COLUMN is_place_blog boolean DEFAULT false;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_blogs_space_id ON blogs(space_id);
CREATE INDEX IF NOT EXISTS idx_blogs_publish_to ON blogs(publish_to);
CREATE INDEX IF NOT EXISTS idx_blogs_category_id ON blogs(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_images_blog_id ON blog_images(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_attachments_blog_id ON blog_attachments(blog_id);
CREATE INDEX IF NOT EXISTS idx_subspaces_published ON subspaces(is_published);

ALTER TABLE subspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published subspaces" ON subspaces;
DROP POLICY IF EXISTS "Authenticated users can create subspaces" ON subspaces;
DROP POLICY IF EXISTS "Authenticated users can update subspaces" ON subspaces;
DROP POLICY IF EXISTS "Authenticated users can delete subspaces" ON subspaces;

CREATE POLICY "Anyone can view published subspaces"
  ON subspaces
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users can create subspaces"
  ON subspaces
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update subspaces"
  ON subspaces
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete subspaces"
  ON subspaces
  FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone can view blog images" ON blog_images;
DROP POLICY IF EXISTS "Authenticated users can manage blog images" ON blog_images;

CREATE POLICY "Anyone can view blog images"
  ON blog_images
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage blog images"
  ON blog_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view blog attachments" ON blog_attachments;
DROP POLICY IF EXISTS "Authenticated users can manage blog attachments" ON blog_attachments;

CREATE POLICY "Anyone can view blog attachments"
  ON blog_attachments
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage blog attachments"
  ON blog_attachments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);