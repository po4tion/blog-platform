-- ============================================
-- Add Social Links to Profiles
-- ============================================
-- This migration adds social link columns to the profiles table

-- Add social link columns
ALTER TABLE profiles
ADD COLUMN github_url TEXT,
ADD COLUMN linkedin_url TEXT,
ADD COLUMN website_url TEXT;

-- Add comments
COMMENT ON COLUMN profiles.github_url IS 'GitHub profile URL';
COMMENT ON COLUMN profiles.linkedin_url IS 'LinkedIn profile URL';
COMMENT ON COLUMN profiles.website_url IS 'Personal website or company URL';
