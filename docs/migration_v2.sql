-- Run this in your Supabase SQL Editor

-- 1. Extend decisions table
ALTER TABLE decisions 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General',
ADD COLUMN IF NOT EXISTS outcome TEXT,
ADD COLUMN IF NOT EXISTS success_rating INTEGER CHECK (success_rating >= 1 AND success_rating <= 10);

-- 2. Ensure RLS allows updates for outcomes
CREATE POLICY "Users can update their own decisions" 
ON decisions FOR UPDATE 
USING (auth.uid() = user_id);
