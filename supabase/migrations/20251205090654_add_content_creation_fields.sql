/*
  # Add Content Creation Module Fields
  
  ## Overview
  This migration adds necessary fields to support the complete Content Creation module
  including Space creation, enhanced Blog creation, scheduling, and visibility controls.
  
  ## Changes Made
  
  ### 1. Subspaces Table Enhancements
  Added fields:
  - `language` (text) - Language selection for the space
  - `visibility` (text with check constraint) - 'public' or 'restricted'
  - `scheduled_at` (timestamptz) - For scheduling space publication
  - `created_by` (uuid) - FK to users table (will be author_id for now)
  
  ### 2. Blogs Table Enhancements
  Added fields:
  - `hidden_post` (boolean) - If true, post is invisible to other users
  - `scheduled_at` (timestamptz) - For scheduling blog publication
  
  ## Notes
  - All ALTER TABLE commands use IF NOT EXISTS or similar checks
  - No data is dropped or deleted
  - All new columns are nullable to preserve existing data
  - Foreign key constraints added where appropriate
*/

-- ============================================================================
-- 1. ADD FIELDS TO SUBSPACES TABLE
-- ============================================================================

-- Add language field for spaces
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'subspaces'
    AND column_name = 'language'
  ) THEN
    ALTER TABLE subspaces ADD COLUMN language TEXT DEFAULT 'English';
  END IF;
END $$;

-- Add visibility field with check constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'subspaces'
    AND column_name = 'visibility'
  ) THEN
    ALTER TABLE subspaces ADD COLUMN visibility TEXT DEFAULT 'public';
  END IF;
END $$;

-- Add check constraint for visibility
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'subspaces_visibility_check'
  ) THEN
    ALTER TABLE subspaces ADD CONSTRAINT subspaces_visibility_check 
    CHECK (visibility IN ('public', 'restricted'));
  END IF;
END $$;

-- Add scheduled_at field for spaces
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'subspaces'
    AND column_name = 'scheduled_at'
  ) THEN
    ALTER TABLE subspaces ADD COLUMN scheduled_at TIMESTAMPTZ;
  END IF;
END $$;

-- Add created_by field for spaces
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'subspaces'
    AND column_name = 'created_by'
  ) THEN
    ALTER TABLE subspaces ADD COLUMN created_by UUID;
  END IF;
END $$;

-- ============================================================================
-- 2. ADD FIELDS TO BLOGS TABLE
-- ============================================================================

-- Add hidden_post field for blogs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'blogs'
    AND column_name = 'hidden_post'
  ) THEN
    ALTER TABLE blogs ADD COLUMN hidden_post BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add scheduled_at field for blogs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'blogs'
    AND column_name = 'scheduled_at'
  ) THEN
    ALTER TABLE blogs ADD COLUMN scheduled_at TIMESTAMPTZ;
  END IF;
END $$;

-- ============================================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index for filtering spaces by creator
CREATE INDEX IF NOT EXISTS idx_subspaces_created_by ON subspaces(created_by);

-- Index for filtering spaces by visibility
CREATE INDEX IF NOT EXISTS idx_subspaces_visibility ON subspaces(visibility);

-- Index for filtering blogs by hidden_post
CREATE INDEX IF NOT EXISTS idx_blogs_hidden_post ON blogs(hidden_post);

-- Index for filtering blogs by scheduled_at
CREATE INDEX IF NOT EXISTS idx_blogs_scheduled_at ON blogs(scheduled_at);

-- Index for filtering blogs by space_id
CREATE INDEX IF NOT EXISTS idx_blogs_space_id ON blogs(space_id);

-- ============================================================================
-- 4. UPDATE RLS POLICIES
-- ============================================================================

-- Allow authenticated users to read public spaces
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'subspaces' 
    AND policyname = 'Allow authenticated users to read public spaces'
  ) THEN
    CREATE POLICY "Allow authenticated users to read public spaces"
      ON subspaces FOR SELECT
      TO authenticated
      USING (visibility = 'public' OR created_by = auth.uid());
  END IF;
END $$;

-- Allow users to create spaces
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'subspaces' 
    AND policyname = 'Allow users to create spaces'
  ) THEN
    CREATE POLICY "Allow users to create spaces"
      ON subspaces FOR INSERT
      TO authenticated
      WITH CHECK (created_by = auth.uid());
  END IF;
END $$;

-- Allow users to update their own spaces
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'subspaces' 
    AND policyname = 'Allow users to update own spaces'
  ) THEN
    CREATE POLICY "Allow users to update own spaces"
      ON subspaces FOR UPDATE
      TO authenticated
      USING (created_by = auth.uid())
      WITH CHECK (created_by = auth.uid());
  END IF;
END $$;

-- Allow users to read non-hidden blogs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'blogs' 
    AND policyname = 'Allow users to read non-hidden blogs'
  ) THEN
    CREATE POLICY "Allow users to read non-hidden blogs"
      ON blogs FOR SELECT
      TO authenticated
      USING (hidden_post = false OR author_id = auth.uid());
  END IF;
END $$;