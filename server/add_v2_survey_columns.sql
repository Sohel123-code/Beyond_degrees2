-- Add new columns for Enhanced Career Recommendations
ALTER TABLE "USERS" ADD COLUMN IF NOT EXISTS "skills" TEXT;
ALTER TABLE "USERS" ADD COLUMN IF NOT EXISTS "experience_level" TEXT;
ALTER TABLE "USERS" ADD COLUMN IF NOT EXISTS "career_goal" TEXT;
ALTER TABLE "USERS" ADD COLUMN IF NOT EXISTS "preferred_location_country" TEXT;
ALTER TABLE "USERS" ADD COLUMN IF NOT EXISTS "preferred_location_state" TEXT;
