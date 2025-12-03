/*
  # Update Categories Table for Link Support

  1. Changes
    - Add `type` column (Category or Link)
    - Add `image_url` column for category images
    - Add `link_url` column for links
    - Add `link_icon_url` column for link icons
    - Add `is_published` column for publication control
    - Add `updated_at` column for tracking updates
    - Add `created_by` column for user tracking

  2. Data Migration
    - Set existing records to type 'Category'
    - Set existing records to published by default

  3. Security
    - Update RLS policies for new functionality
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'type'
  ) THEN
    ALTER TABLE categories ADD COLUMN type text NOT NULL DEFAULT 'Category';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE categories ADD COLUMN image_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'link_url'
  ) THEN
    ALTER TABLE categories ADD COLUMN link_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'link_icon_url'
  ) THEN
    ALTER TABLE categories ADD COLUMN link_icon_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'is_published'
  ) THEN
    ALTER TABLE categories ADD COLUMN is_published boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE categories ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE categories ADD COLUMN created_by uuid;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
CREATE INDEX IF NOT EXISTS idx_categories_published ON categories(is_published);

DROP POLICY IF EXISTS "Anyone can view published categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can create categories" ON categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON categories;

CREATE POLICY "Anyone can view published categories"
  ON categories
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users can create categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (created_by IS NULL OR auth.uid() = created_by)
  WITH CHECK (created_by IS NULL OR auth.uid() = created_by);

CREATE POLICY "Users can delete their own categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (created_by IS NULL OR auth.uid() = created_by);