-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create memory_palaces table
CREATE TABLE memory_palaces (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  thumbnail_url TEXT,
  current_step INTEGER DEFAULT 1,
  is_completed BOOLEAN DEFAULT FALSE
);

-- Create memory_palace_content table
CREATE TABLE memory_palace_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  memory_palace_id UUID REFERENCES memory_palaces ON DELETE CASCADE NOT NULL,
  step_number INTEGER NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_palaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_palace_content ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Memory palaces policies
CREATE POLICY "Users can view their own memory palaces"
  ON memory_palaces FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own memory palaces"
  ON memory_palaces FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memory palaces"
  ON memory_palaces FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memory palaces"
  ON memory_palaces FOR DELETE
  USING (auth.uid() = user_id);

-- Memory palace content policies
CREATE POLICY "Users can view their own memory palace content"
  ON memory_palace_content FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memory_palaces
      WHERE id = memory_palace_content.memory_palace_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create content for their own memory palaces"
  ON memory_palace_content FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memory_palaces
      WHERE id = memory_palace_content.memory_palace_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update content of their own memory palaces"
  ON memory_palace_content FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM memory_palaces
      WHERE id = memory_palace_content.memory_palace_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete content of their own memory palaces"
  ON memory_palace_content FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM memory_palaces
      WHERE id = memory_palace_content.memory_palace_id
      AND user_id = auth.uid()
    )
  );

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memory_palaces_updated_at
  BEFORE UPDATE ON memory_palaces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memory_palace_content_updated_at
  BEFORE UPDATE ON memory_palace_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
