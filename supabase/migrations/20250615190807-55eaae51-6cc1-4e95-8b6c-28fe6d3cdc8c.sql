
-- Add sentiment analysis columns to journal_entries if they don't exist
ALTER TABLE journal_entries 
ADD COLUMN IF NOT EXISTS sentiment_label VARCHAR(20),
ADD COLUMN IF NOT EXISTS confidence_score REAL;

-- Create a table to store detailed sentiment analysis results
CREATE TABLE IF NOT EXISTS sentiment_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journal_entry_id BIGINT REFERENCES journal_entries(journal_entry_id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sentiment_label VARCHAR(20) NOT NULL, -- 'positive', 'neutral', 'negative'
  confidence_score REAL NOT NULL, -- 0.0 to 1.0
  emotions JSONB, -- detailed emotion breakdown
  keywords TEXT[], -- key words/phrases identified
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for sentiment_analysis table
ALTER TABLE sentiment_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sentiment_analysis
CREATE POLICY "Users can view their own sentiment analysis" 
  ON sentiment_analysis FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sentiment analysis" 
  ON sentiment_analysis FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sentiment analysis" 
  ON sentiment_analysis FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_sentiment_analysis_user_id ON sentiment_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_sentiment_analysis_journal_entry_id ON sentiment_analysis(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_sentiment_analysis_analyzed_at ON sentiment_analysis(analyzed_at);
