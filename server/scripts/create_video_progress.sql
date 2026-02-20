-- Create user_video_progress table
CREATE TABLE IF NOT EXISTS "user_video_progress" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  youtube_url TEXT NOT NULL,
  category_id TEXT NOT NULL,
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, youtube_url)
);

-- Enable Row Level Security
ALTER TABLE "user_video_progress" ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see their own progress
DROP POLICY IF EXISTS "Users can view own progress" ON "user_video_progress";
CREATE POLICY "Users can view own progress" ON "user_video_progress"
    FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to insert their own progress
DROP POLICY IF EXISTS "Users can record own progress" ON "user_video_progress";
CREATE POLICY "Users can record own progress" ON "user_video_progress"
    FOR INSERT WITH CHECK (auth.uid() = user_id);
