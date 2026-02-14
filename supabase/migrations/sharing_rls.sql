-- Enable RLS (already enabled likely, but for safety)
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- 1. Ensure columns exist (just in case)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookmarks' AND column_name='is_public') THEN
        ALTER TABLE bookmarks ADD COLUMN is_public BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookmarks' AND column_name='slug') THEN
        ALTER TABLE bookmarks ADD COLUMN slug TEXT UNIQUE;
    END IF;
END $$;

-- 2. Create Policy for Public Read Access
-- This correctly allows anyone (even not logged in) to view a bookmark if is_public is true
CREATE POLICY "Allow public read access for shared bookmarks"
  ON bookmarks
  FOR SELECT
  USING (is_public = true);

-- 3. Ensure an index exists for performance on slug lookups
CREATE INDEX IF NOT EXISTS idx_bookmarks_slug ON bookmarks(slug);
