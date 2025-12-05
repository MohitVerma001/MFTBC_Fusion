/*
  # Seed Bilingual Spaces

  1. Creates default business spaces with EN/JA language pairs
    - MFTBC (EN, JA)
    - DTA (EN, JA)
    - HR (EN, JA)
    - IT (EN, JA)

  2. Each space has:
    - Unique business_key + language combination
    - Descriptive name and description
    - is_active flag set to true
*/

INSERT INTO spaces (business_key, language, name, description, is_active, created_at, updated_at)
VALUES
  ('MFTBC', 'EN', 'MFTBC (English)', 'MFTBC space for English content', true, NOW(), NOW()),
  ('MFTBC', 'JA', 'MFTBC (日本語)', 'MFTBC space for Japanese content', true, NOW(), NOW()),
  ('DTA', 'EN', 'DTA (English)', 'DTA space for English content', true, NOW(), NOW()),
  ('DTA', 'JA', 'DTA (日本語)', 'DTA space for Japanese content', true, NOW(), NOW()),
  ('HR', 'EN', 'HR (English)', 'HR space for English content', true, NOW(), NOW()),
  ('HR', 'JA', 'HR (日本語)', 'HR space for Japanese content', true, NOW(), NOW()),
  ('IT', 'EN', 'IT (English)', 'IT space for English content', true, NOW(), NOW()),
  ('IT', 'JA', 'IT (日本語)', 'IT space for Japanese content', true, NOW(), NOW())
ON CONFLICT (business_key, language) DO NOTHING;
