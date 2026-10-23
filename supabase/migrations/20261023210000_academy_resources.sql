-- Academy Resources Table for Shia & Sunni Dynamic Resource Management
CREATE TABLE IF NOT EXISTS academy_resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  category TEXT NOT NULL,
  sect TEXT NOT NULL DEFAULT 'universal' CHECK (sect IN ('universal', 'shia', 'sunni')),
  file_size TEXT NOT NULL,
  description TEXT,
  file_data_url TEXT,
  uploaded_by TEXT DEFAULT 'Super Admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE academy_resources ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all published academy resources
CREATE POLICY "Public Read Access on academy_resources"
  ON academy_resources FOR SELECT
  USING (true);

-- Allow authenticated users / service role full write access
CREATE POLICY "Admin All Access on academy_resources"
  ON academy_resources FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes for category and sectarian filtering
CREATE INDEX IF NOT EXISTS idx_academy_resources_sect ON academy_resources(sect);
CREATE INDEX IF NOT EXISTS idx_academy_resources_category ON academy_resources(category);
