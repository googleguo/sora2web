-- Create video_history table to store user generated videos
CREATE TABLE IF NOT EXISTS public.video_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('text-to-video', 'image-to-video')),
  prompt TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER NOT NULL,
  aspect_ratio VARCHAR(20) NOT NULL,
  model VARCHAR(50) NOT NULL,
  image_url TEXT,
  video_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_video_history_user_id ON public.video_history(user_id);
CREATE INDEX IF NOT EXISTS idx_video_history_created_at ON public.video_history(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.video_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own video history
CREATE POLICY "video_history_select_own"
  ON public.video_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "video_history_insert_own"
  ON public.video_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "video_history_delete_own"
  ON public.video_history FOR DELETE
  USING (auth.uid() = user_id);
