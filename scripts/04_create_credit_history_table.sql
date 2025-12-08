-- Create credit_history table to track credit usage and additions
CREATE TABLE IF NOT EXISTS credit_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- positive for additions, negative for usage
  balance_after INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'purchase', 'subscription', 'video_generation', 'refund'
  description TEXT,
  transaction_id TEXT REFERENCES transactions(id),
  video_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE credit_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own credit history
CREATE POLICY "Users can view own credit history"
  ON credit_history FOR SELECT
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS credit_history_user_id_idx ON credit_history(user_id);
CREATE INDEX IF NOT EXISTS credit_history_created_at_idx ON credit_history(created_at DESC);
