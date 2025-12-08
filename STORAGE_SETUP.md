# Supabase Storage Setup Guide

To enable image uploads for the video generation feature, you need to create a storage bucket in Supabase.

## Steps to set up storage:

1. **Go to Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard/project/YOUR_PROJECT_ID/storage/buckets

2. **Create a new bucket**
   - Click "New bucket"
   - Bucket name: `video-images`
   - Set it as **Public** (so uploaded images can be accessed via URL)
   - Click "Create bucket"

3. **Set up bucket policies (Optional but recommended)**
   - Go to the bucket settings
   - Add policies to control who can upload/read files
   - For development, you can allow public uploads and reads

## Default Policy Example:

To allow anyone to upload and read images:

\`\`\`sql
-- Allow public uploads
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'video-images');

-- Allow public reads
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'video-images');
\`\`\`

## Security Note:

For production, you should implement proper authentication and authorization:
- Require users to be logged in to upload images
- Limit file sizes (max 10MB for images)
- Validate file types (only allow images)
- Consider adding RLS (Row Level Security) policies

## Testing:

After creating the bucket, try uploading an image through the application. The upload API will:
1. Accept the image file
2. Upload it to Supabase Storage bucket `video-images`
3. Return a public URL like: `https://YOUR_PROJECT.supabase.co/storage/v1/object/public/video-images/uploads/1234567890-abc123.jpg`
