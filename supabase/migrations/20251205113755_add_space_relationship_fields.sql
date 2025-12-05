/*
  # Add Space Relationship and Navigation Fields

  ## Changes Made
  1. New Columns Added to `subspaces` table:
    - `parent_space_id` (integer, nullable) - Links to parent space for hierarchy
    - `is_root_space` (boolean) - Identifies top-level spaces like MFTBC
    - `navigation_items` (jsonb) - Stores array of navigation menu items
    - `language` (varchar) - Language setting (en/ja)
    - `visibility` (varchar) - Access level (public/private/restricted)
    - `created_by` (uuid) - User who created the space
    - `scheduled_at` (timestamp, nullable) - For scheduled publishing

  2. Indexes
    - Index on parent_space_id for faster hierarchy queries
    - Index on is_root_space for root space filtering
    - Index on created_by for user's spaces filtering

  3. Default Root Space
    - Inserts MFTBC as the default root space if not exists

  ## Notes
  - Uses IF NOT EXISTS to safely add columns
  - All new columns are nullable or have defaults
  - No existing data is affected
*/

-- Add parent_space_id column for hierarchical relationships
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subspaces' AND column_name = 'parent_space_id'
  ) THEN
    ALTER TABLE subspaces ADD COLUMN parent_space_id INTEGER REFERENCES subspaces(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add is_root_space flag
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subspaces' AND column_name = 'is_root_space'
  ) THEN
    ALTER TABLE subspaces ADD COLUMN is_root_space BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add navigation_items as JSONB array
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subspaces' AND column_name = 'navigation_items'
  ) THEN
    ALTER TABLE subspaces ADD COLUMN navigation_items JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add language field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subspaces' AND column_name = 'language'
  ) THEN
    ALTER TABLE subspaces ADD COLUMN language VARCHAR(10) DEFAULT 'en';
  END IF;
END $$;

-- Add visibility field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subspaces' AND column_name = 'visibility'
  ) THEN
    ALTER TABLE subspaces ADD COLUMN visibility VARCHAR(50) DEFAULT 'public';
  END IF;
END $$;

-- Add created_by field (using varchar as UUID string for compatibility)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subspaces' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE subspaces ADD COLUMN created_by VARCHAR(255);
  END IF;
END $$;

-- Add scheduled_at for scheduled publishing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subspaces' AND column_name = 'scheduled_at'
  ) THEN
    ALTER TABLE subspaces ADD COLUMN scheduled_at TIMESTAMP;
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subspaces_parent_id ON subspaces(parent_space_id);
CREATE INDEX IF NOT EXISTS idx_subspaces_is_root ON subspaces(is_root_space);
CREATE INDEX IF NOT EXISTS idx_subspaces_created_by ON subspaces(created_by);

-- Insert default MFTBC root space if it doesn't exist
INSERT INTO subspaces (
  name, 
  description, 
  content_html, 
  is_root_space, 
  is_published, 
  navigation_items,
  language,
  visibility,
  created_by
)
SELECT 
  'MFTBC',
  'Mitsubishi FUSO Truck and Bus Corporation - Main Corporate Space',
  '<p>Welcome to the MFTBC corporate intranet space. Access all company resources, news, and collaboration tools.</p>',
  true,
  true,
  '["News", "HR", "Activity", "Content", "IT", "People", "Spaces", "Calendar", "CEO Message"]'::jsonb,
  'en',
  'public',
  '00000000-0000-0000-0000-000000000001'
WHERE NOT EXISTS (
  SELECT 1 FROM subspaces WHERE name = 'MFTBC' AND is_root_space = true
);