
-- Create profiles table for user information
CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  email VARCHAR(255),
  password_hash VARCHAR(255),
  background_info JSON,
  avatar_url VARCHAR(255),
  preferences JSON,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create journal_entries table
CREATE TABLE public.journal_entries (
  journal_entry_id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  entry_date DATE DEFAULT CURRENT_DATE,
  text TEXT,
  sentiment_score REAL,
  ai_suggestion JSON,
  chat_log JSON,
  status VARCHAR(50) DEFAULT 'active',
  word_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_prompt_id BIGINT
);

-- Create prompts table
CREATE TABLE public.prompts (
  prompt_id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  difficulty_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_prompts table (junction table)
CREATE TABLE public.user_prompts (
  user_prompt_id BIGSERIAL PRIMARY KEY,
  prompt_id BIGINT REFERENCES public.prompts(prompt_id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create streaks table
CREATE TABLE public.streaks (
  streak_id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_entry_date DATE
);

-- Create badges table
CREATE TABLE public.badges (
  badges_id BIGSERIAL PRIMARY KEY,
  description TEXT,
  condition_type VARCHAR(255),
  condition_value INTEGER,
  image_url VARCHAR(255)
);

-- Create user_badges table (junction table)
CREATE TABLE public.user_badges (
  user_badges_id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  badges_id INTEGER REFERENCES public.badges(badges_id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for user_prompt_id in journal_entries
ALTER TABLE public.journal_entries 
ADD CONSTRAINT fk_journal_entries_user_prompts 
FOREIGN KEY (user_prompt_id) REFERENCES public.user_prompts(user_prompt_id);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for journal_entries
CREATE POLICY "Users can view own journal entries" ON public.journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own journal entries" ON public.journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries" ON public.journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries" ON public.journal_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_prompts
CREATE POLICY "Users can view own prompts" ON public.user_prompts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own prompt completions" ON public.user_prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompt completions" ON public.user_prompts
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for streaks
CREATE POLICY "Users can view own streaks" ON public.streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own streaks" ON public.streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" ON public.streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for user_badges
CREATE POLICY "Users can view own badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can earn badges" ON public.user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Make prompts and badges readable by all authenticated users
CREATE POLICY "Authenticated users can view prompts" ON public.prompts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view badges" ON public.badges
  FOR SELECT TO authenticated USING (true);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'full_name'),
    NEW.email
  );
  
  -- Initialize streak record for new user
  INSERT INTO public.streaks (user_id, current_streak, longest_streak, last_entry_date)
  VALUES (NEW.id, 0, 0, NULL);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample prompts
INSERT INTO public.prompts (title, description, difficulty_score) VALUES
('Daily Reflection', 'Write about your day and what you learned from it.', 1),
('Gratitude Practice', 'List three things you are grateful for today.', 1),
('Future Goals', 'Describe where you see yourself in 5 years.', 3),
('Overcoming Challenges', 'Write about a recent challenge and how you overcame it.', 2),
('Mindfulness Moment', 'Describe a moment today when you felt fully present.', 2);

-- Insert some sample badges
INSERT INTO public.badges (description, condition_type, condition_value, image_url) VALUES
('First Entry', 'entries_count', 1, '/badges/first-entry.png'),
('Week Warrior', 'streak_days', 7, '/badges/week-warrior.png'),
('Month Master', 'streak_days', 30, '/badges/month-master.png'),
('Prolific Writer', 'entries_count', 50, '/badges/prolific-writer.png'),
('Consistent Chronicler', 'streak_days', 100, '/badges/consistent-chronicler.png');
