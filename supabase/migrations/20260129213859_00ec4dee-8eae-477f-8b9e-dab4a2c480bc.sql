-- Create frames table
CREATE TABLE public.frames (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  reference_code text NOT NULL UNIQUE,
  image_url text NOT NULL,
  category text NOT NULL CHECK (category IN ('Swiss', 'Davisory', 'Bohnke'))
);

-- Enable RLS
ALTER TABLE public.frames ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view the catalog)
CREATE POLICY "Anyone can view frames"
  ON public.frames
  FOR SELECT
  USING (true);

-- Public insert access (for now, can restrict later with auth)
CREATE POLICY "Anyone can insert frames"
  ON public.frames
  FOR INSERT
  WITH CHECK (true);

-- Create storage bucket for frame images
INSERT INTO storage.buckets (id, name, public)
VALUES ('frame-images', 'frame-images', true);

-- Public read access for frame images
CREATE POLICY "Public read access for frame images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'frame-images');

-- Public upload access for frame images
CREATE POLICY "Public upload access for frame images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'frame-images');