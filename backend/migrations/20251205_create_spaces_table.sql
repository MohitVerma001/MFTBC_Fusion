/*
  # Create Spaces Table

  1. New Tables
    - `spaces`
      - `id` (serial, primary key)
      - `business_key` (text, business space identifier)
      - `language` (text, language code)
      - `name` (text, space name)
      - `description` (text, space description)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Indexes
    - Unique constraint on (business_key, language) combination
    - Index on business_key for filtering
    - Index on language for filtering
    - Index on is_active for filtering active spaces

  3. Security
    - No RLS required as this is a lookup table for internal use
*/

CREATE TABLE IF NOT EXISTS spaces (
  id SERIAL PRIMARY KEY,
  business_key TEXT NOT NULL,
  language TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_business_key_language UNIQUE (business_key, language)
);

CREATE INDEX IF NOT EXISTS idx_spaces_business_key ON spaces(business_key);
CREATE INDEX IF NOT EXISTS idx_spaces_language ON spaces(language);
CREATE INDEX IF NOT EXISTS idx_spaces_is_active ON spaces(is_active);

CREATE OR REPLACE FUNCTION update_spaces_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS update_spaces_updated_at
BEFORE UPDATE ON spaces
FOR EACH ROW
EXECUTE FUNCTION update_spaces_updated_at();
