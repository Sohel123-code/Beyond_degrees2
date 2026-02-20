-- Create career skills table
CREATE TABLE IF NOT EXISTS "career skills" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT DEFAULT 'Career Skills',
  subcategory TEXT,
  video_number TEXT,
  youtube_url TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE "career skills" ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'career skills' AND policyname = 'Enable read access for all users'
    ) THEN
        CREATE POLICY "Enable read access for all users" ON "career skills"
            FOR SELECT USING (true);
    END IF;
END $$;
