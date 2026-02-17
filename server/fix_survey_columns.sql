-- Fix for "invalid input syntax for type bigint" errors
-- This changes the columns to TEXT to accept "2nd Year", "100000", etc.

ALTER TABLE "USERS" ALTER COLUMN "year" TYPE TEXT;
ALTER TABLE "USERS" ALTER COLUMN "salary" TYPE TEXT;
