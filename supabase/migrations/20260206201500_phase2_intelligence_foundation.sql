-- FilmRitz Phase 2: Intelligence Foundation Database Schema
-- Migration: 002_phase2_intelligence_foundation
-- Corrected and Enhanced

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- create extension if not exists "pgcrypto"; -- For gen_random_uuid if needed, but uuid-ossp covers uuid_generate_v4

-- =====================================================
-- TABLE: user_events
-- =====================================================
CREATE TABLE IF NOT EXISTS user_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  film_id INTEGER NOT NULL, -- TMDB ID
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'save', 'skip', 'finish')),
  watch_duration INTEGER DEFAULT 0, -- in seconds
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_events_user ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_film ON user_events(film_id);
CREATE INDEX IF NOT EXISTS idx_user_events_type ON user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_timestamp ON user_events(timestamp DESC);

-- Enable Row Level Security
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_events
DROP POLICY IF EXISTS "Users can view their own events" ON user_events;
CREATE POLICY "Users can view their own events"
  ON user_events FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own events" ON user_events;
CREATE POLICY "Users can insert their own events"
  ON user_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- TABLE: film_attributes
-- =====================================================
CREATE TABLE IF NOT EXISTS film_attributes (
  film_id INTEGER PRIMARY KEY, -- TMDB ID
  runtime INTEGER, -- in minutes
  complexity_score DECIMAL(3,2) CHECK (complexity_score >= 0 AND complexity_score <= 10),
  mood_tags TEXT[] DEFAULT '{}'::TEXT[], -- array of mood tags
  pacing_score DECIMAL(3,2) CHECK (pacing_score >= 0 AND pacing_score <= 10),
  visual_style_tags TEXT[] DEFAULT '{}'::TEXT[], -- array of visual style tags
  dominant_colors JSONB, -- dominant color palette
  cinematography_style TEXT[] DEFAULT '{}'::TEXT[], -- cinematography style tags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for film_attributes
CREATE INDEX IF NOT EXISTS idx_film_attributes_complexity ON film_attributes(complexity_score);
CREATE INDEX IF NOT EXISTS idx_film_attributes_pacing ON film_attributes(pacing_score);
CREATE INDEX IF NOT EXISTS idx_film_attributes_mood ON film_attributes USING GIN(mood_tags);
CREATE INDEX IF NOT EXISTS idx_film_attributes_visual ON film_attributes USING GIN(visual_style_tags);
CREATE INDEX IF NOT EXISTS idx_film_attributes_cinematography ON film_attributes USING GIN(cinematography_style);
CREATE INDEX IF NOT EXISTS idx_film_attributes_colors ON film_attributes USING GIN(dominant_colors);

-- Enable RLS (public read, admin write)
ALTER TABLE film_attributes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view film attributes" ON film_attributes;
CREATE POLICY "Anyone can view film attributes"
  ON film_attributes FOR SELECT
  USING (true);

-- =====================================================
-- TABLE: user_context_profiles
-- =====================================================
CREATE TABLE IF NOT EXISTS user_context_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  avg_watch_time INTEGER DEFAULT 0, -- average watch time in minutes
  preferred_complexity DECIMAL(3,2) CHECK (preferred_complexity >= 0 AND preferred_complexity <= 10),
  dominant_moods TEXT[] DEFAULT '{}'::TEXT[], -- array of dominant mood tags
  session_patterns JSONB DEFAULT '{}'::JSONB, -- flexible storage for session patterns
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for user_context_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_complexity ON user_context_profiles(preferred_complexity);
CREATE INDEX IF NOT EXISTS idx_user_profiles_moods ON user_context_profiles USING GIN(dominant_moods);

-- Enable RLS
ALTER TABLE user_context_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_context_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON user_context_profiles;
CREATE POLICY "Users can view their own profile"
  ON user_context_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON user_context_profiles;
CREATE POLICY "Users can insert their own profile"
  ON user_context_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_context_profiles;
CREATE POLICY "Users can update their own profile"
  ON user_context_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- TABLE: collaboration_edges
-- =====================================================
CREATE TABLE IF NOT EXISTS collaboration_edges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_a_id INTEGER NOT NULL, -- TMDB person ID
  person_b_id INTEGER NOT NULL, -- TMDB person ID
  collaboration_weight DECIMAL(5,2) DEFAULT 1.0, -- weight based on frequency, success, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure person_a_id < person_b_id to avoid duplicates
  CHECK (person_a_id < person_b_id),
  UNIQUE(person_a_id, person_b_id)
);

-- Indexes for collaboration_edges
CREATE INDEX IF NOT EXISTS idx_collaboration_a ON collaboration_edges(person_a_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_b ON collaboration_edges(person_b_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_weight ON collaboration_edges(collaboration_weight DESC);

-- Enable RLS (public read)
ALTER TABLE collaboration_edges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view collaboration edges" ON collaboration_edges;
CREATE POLICY "Anyone can view collaboration edges"
  ON collaboration_edges FOR SELECT
  USING (true);

-- =====================================================
-- FUNCTIONS FOR INTELLIGENCE
-- =====================================================

-- Logic function to update user context profile
CREATE OR REPLACE FUNCTION update_user_context_profile_logic(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  total_watch_time INTEGER;
  avg_complexity DECIMAL(3,2);
  mood_counts JSONB;
  dominant_moods TEXT[];
BEGIN
  -- Calculate average watch time from finished events
  SELECT COALESCE(AVG(watch_duration), 0)::INTEGER INTO total_watch_time
  FROM user_events
  WHERE user_id = p_user_id AND event_type = 'finish';

  -- Calculate preferred complexity from finished films
  SELECT COALESCE(AVG(fa.complexity_score), 5.0) INTO avg_complexity
  FROM user_events ue
  JOIN film_attributes fa ON ue.film_id = fa.film_id
  WHERE ue.user_id = p_user_id AND ue.event_type = 'finish';

  -- Calculate dominant moods (top 5 by count)
  SELECT jsonb_object_agg(mood, count) INTO mood_counts
  FROM (
    SELECT unnest(fa.mood_tags) as mood, COUNT(*) as count
    FROM user_events ue
    JOIN film_attributes fa ON ue.film_id = fa.film_id
    WHERE ue.user_id = p_user_id AND ue.event_type = 'finish'
    GROUP BY mood
    ORDER BY count DESC
    LIMIT 5
  ) sub;

  -- Extract top 3 moods
  IF mood_counts IS NOT NULL THEN
    SELECT array_agg(key) INTO dominant_moods
    FROM (
      SELECT key
      FROM jsonb_each_text(mood_counts)
      ORDER BY value::int DESC
      LIMIT 3
    ) sub;
  ELSE
    dominant_moods := '{}';
  END IF;

  -- Upsert the profile
  INSERT INTO user_context_profiles (user_id, avg_watch_time, preferred_complexity, dominant_moods, updated_at)
  VALUES (p_user_id, total_watch_time, avg_complexity, COALESCE(dominant_moods, '{}'), NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    avg_watch_time = EXCLUDED.avg_watch_time,
    preferred_complexity = EXCLUDED.preferred_complexity,
    dominant_moods = EXCLUDED.dominant_moods,
    updated_at = NOW();

END;
$$ LANGUAGE plpgsql;

-- Trigger function wrapper
CREATE OR REPLACE FUNCTION trigger_update_user_context_profile()
RETURNS TRIGGER AS $$
DECLARE
  target_user_id UUID;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    target_user_id := OLD.user_id;
  ELSE
    target_user_id := NEW.user_id;
  END IF;
  
  -- Perform the update (blocks the transaction)
  PERFORM update_user_context_profile_logic(target_user_id);
  
  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger definition
DROP TRIGGER IF EXISTS trigger_update_user_profile ON user_events;
CREATE TRIGGER trigger_update_user_profile
AFTER INSERT OR UPDATE OR DELETE ON user_events
FOR EACH ROW EXECUTE FUNCTION trigger_update_user_context_profile();

-- =====================================================
-- TABLE: watchlists
-- =====================================================
CREATE TABLE IF NOT EXISTS watchlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  creation_context JSONB, -- stores the intent/context when created
  dominant_intent JSONB, -- learned dominant intent
  usage_frequency INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for watchlists
CREATE INDEX IF NOT EXISTS idx_watchlists_user ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlists_usage ON watchlists(usage_frequency DESC);
CREATE INDEX IF NOT EXISTS idx_watchlists_last_used ON watchlists(last_used_at DESC);

-- Enable RLS
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;

-- RLS Policies for watchlists
DROP POLICY IF EXISTS "Users can view their own watchlists" ON watchlists;
CREATE POLICY "Users can view their own watchlists"
  ON watchlists FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own watchlists" ON watchlists;
CREATE POLICY "Users can insert their own watchlists"
  ON watchlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own watchlists" ON watchlists;
CREATE POLICY "Users can update their own watchlists"
  ON watchlists FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own watchlists" ON watchlists;
CREATE POLICY "Users can delete their own watchlists"
  ON watchlists FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TABLE: watchlist_items
-- =====================================================
CREATE TABLE IF NOT EXISTS watchlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  watchlist_id UUID NOT NULL REFERENCES watchlists(id) ON DELETE CASCADE,
  film_id INTEGER NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  priority INTEGER DEFAULT 0, -- 0=normal, 1=high, 2=urgent
  watched_at TIMESTAMP WITH TIME ZONE,
  user_rating DECIMAL(2,1) CHECK (user_rating >= 0 AND user_rating <= 5)
);

-- Indexes for watchlist_items
CREATE INDEX IF NOT EXISTS idx_watchlist_items_watchlist ON watchlist_items(watchlist_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_items_film ON watchlist_items(film_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_items_priority ON watchlist_items(priority DESC);
CREATE INDEX IF NOT EXISTS idx_watchlist_items_added ON watchlist_items(added_at DESC);

-- Enable RLS
ALTER TABLE watchlist_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for watchlist_items (inherit from watchlist ownership)
DROP POLICY IF EXISTS "Users can view items in their watchlists" ON watchlist_items;
CREATE POLICY "Users can view items in their watchlists"
  ON watchlist_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM watchlists w
      WHERE w.id = watchlist_items.watchlist_id
      AND w.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage items in their watchlists" ON watchlist_items;
CREATE POLICY "Users can manage items in their watchlists"
  ON watchlist_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM watchlists w
      WHERE w.id = watchlist_items.watchlist_id
      AND w.user_id = auth.uid()
    )
  );

-- =====================================================
-- FUNCTIONS FOR RELATIONSHIP INTELLIGENCE
-- =====================================================

-- Function to get collaborators for a person
CREATE OR REPLACE FUNCTION get_person_collaborators(p_person_id INTEGER, p_limit INTEGER DEFAULT 10)
RETURNS TABLE(
  person_a_id INTEGER,
  person_a_name TEXT,
  person_b_id INTEGER,
  person_b_name TEXT,
  collaboration_weight DECIMAL(5,2),
  collaboration_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE WHEN ce.person_a_id = p_person_id THEN ce.person_a_id ELSE ce.person_b_id END as person_a_id,
    'Person A'::text as person_a_name,
    CASE WHEN ce.person_a_id = p_person_id THEN ce.person_b_id ELSE ce.person_a_id END as person_b_id,
    'Person B'::text as person_b_name,
    ce.collaboration_weight,
    1 as collaboration_count
  FROM collaboration_edges ce
  WHERE ce.person_a_id = p_person_id OR ce.person_b_id = p_person_id
  ORDER BY ce.collaboration_weight DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  RAISE NOTICE 'FilmRitz Phase 2 Intelligence Foundation tables created successfully (Fixed Version)!';
END $$;
