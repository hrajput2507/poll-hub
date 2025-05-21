/*
  # Initial schema for Social Polling App

  1. New Tables
    - `polls`: Stores poll information
    - `options`: Stores poll options
    - `votes`: Stores user votes

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read, create, and manage their data
*/

-- Create polls table
CREATE TABLE IF NOT EXISTS polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create options table
CREATE TABLE IF NOT EXISTS options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  text TEXT NOT NULL,
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  UNIQUE(user_id, poll_id)
);

-- Enable Row Level Security
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policies for polls table
CREATE POLICY "Anyone can read polls" 
ON polls FOR SELECT 
USING (true);

CREATE POLICY "Users can create polls" 
ON polls FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own polls" 
ON polls FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own polls" 
ON polls FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Policies for options table
CREATE POLICY "Anyone can read options" 
ON options FOR SELECT 
USING (true);

CREATE POLICY "Users can create options for their polls" 
ON options FOR INSERT 
TO authenticated 
WITH CHECK (
  auth.uid() = (SELECT user_id FROM polls WHERE id = poll_id)
);

CREATE POLICY "Users can update options for their polls" 
ON options FOR UPDATE 
TO authenticated 
USING (
  auth.uid() = (SELECT user_id FROM polls WHERE id = poll_id)
);

CREATE POLICY "Users can delete options for their polls" 
ON options FOR DELETE 
TO authenticated 
USING (
  auth.uid() = (SELECT user_id FROM polls WHERE id = poll_id)
);

-- Policies for votes table
CREATE POLICY "Anyone can read votes" 
ON votes FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own votes" 
ON votes FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" 
ON votes FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" 
ON votes FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);