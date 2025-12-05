/*
  # Add Navigation Items and Hierarchy to Spaces
  
  ## Overview
  This migration adds support for customizable navigation items per space
  and establishes proper space hierarchy with parent-child relationships.
  
  ## Changes Made
  
  ### 1. Subspaces Table Enhancements
  Added fields:
  - `navigation_items` (jsonb) - Array of navigation items enabled for this space
    Available items: News, HR, Activity, Content, IT, People, Spaces, Calendar, CEO Message
  - `parent_space_id` (uuid) - FK to parent space for hierarchy
  - `display_order` (integer) - Order for displaying spaces in hierarchy
  - `is_root_space` (boolean) - Identifies top-level spaces like MFTBC
  
  ## Notes
  - navigation_items stores an array like ["News", "HR", "Activity"]
  - Default navigation items include all options
  - parent_space_id creates hierarchical space structure
  - All new columns are nullable to preserve existing data
*/

-- Add navigation_items field to store selected navigation options
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'subspaces'
    AND column_name = 'navigation_items'
  ) THEN
    ALTER TABLE subspaces ADD COLUMN navigation_items JSONB DEFAULT '["News", "HR", "Activity", "Content", "IT", "People", "Spaces", "Calendar", "CEO Message"]'::jsonb;
  END IF;
END $$;

-- Add parent_space_id for hierarchy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'subspaces'
    AND column_name = 'parent_space_id'
  ) THEN
    ALTER TABLE subspaces ADD COLUMN parent_space_id UUID;
  END IF;
END $$;

-- Add foreign key constraint for parent_space_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'subspaces_parent_space_id_fkey'
  ) THEN
    ALTER TABLE subspaces ADD CONSTRAINT subspaces_parent_space_id_fkey 
    FOREIGN KEY (parent_space_id) REFERENCES subspaces(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add display_order field for ordering spaces
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'subspaces'
    AND column_name = 'display_order'
  ) THEN
    ALTER TABLE subspaces ADD COLUMN display_order INTEGER DEFAULT 0;
  END IF;
END $$;

-- Add is_root_space field to identify top-level spaces
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'subspaces'
    AND column_name = 'is_root_space'
  ) THEN
    ALTER TABLE subspaces ADD COLUMN is_root_space BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subspaces_navigation_items ON subspaces USING gin(navigation_items);
CREATE INDEX IF NOT EXISTS idx_subspaces_display_order ON subspaces(display_order);
CREATE INDEX IF NOT EXISTS idx_subspaces_parent_space ON subspaces(parent_space_id);
CREATE INDEX IF NOT EXISTS idx_subspaces_is_root ON subspaces(is_root_space);

-- Ensure MFTBC exists as root space
DO $$
DECLARE
  mftbc_id UUID;
BEGIN
  -- Check if MFTBC exists
  SELECT id INTO mftbc_id FROM subspaces WHERE name = 'MFTBC' LIMIT 1;
  
  -- If MFTBC exists, mark it as root space
  IF mftbc_id IS NOT NULL THEN
    UPDATE subspaces 
    SET is_root_space = true,
        navigation_items = '["News", "HR", "Activity", "Content", "IT", "People", "Spaces", "Calendar", "CEO Message"]'::jsonb,
        display_order = 0,
        parent_space_id = NULL
    WHERE id = mftbc_id;
  ELSE
    -- Create MFTBC as root space if it doesn't exist
    INSERT INTO subspaces (
      name, description, content_html, is_published, 
      is_root_space, parent_space_id, navigation_items, 
      display_order, visibility, language, created_at, updated_at
    ) VALUES (
      'MFTBC',
      'Mitsubishi FUSO Truck and Bus Corporation - Main Space',
      '<p>Welcome to the MFTBC collaborative workspace</p>',
      true,
      true,
      NULL,
      '["News", "HR", "Activity", "Content", "IT", "People", "Spaces", "Calendar", "CEO Message"]'::jsonb,
      0,
      'public',
      'English',
      NOW(),
      NOW()
    );
  END IF;
END $$;