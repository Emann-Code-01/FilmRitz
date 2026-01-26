-- FilmRitz Rating & Review System Database Schema
-- Run this in your Supabase SQL Editor

-- =====================================================
-- TABLE: ratings
-- =====================================================
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  media_id INTEGER NOT NULL,
  media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('movie', 'tv')),
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one rating per user per media item
  UNIQUE(user_id, media_id, media_type)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ratings_media ON ratings(media_id, media_type);
CREATE INDEX IF NOT EXISTS idx_ratings_user ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_created ON ratings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ratings
DROP POLICY IF EXISTS "Users can view all ratings" ON ratings;
CREATE POLICY "Users can view all ratings"
  ON ratings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own ratings" ON ratings;
CREATE POLICY "Users can insert their own ratings"
  ON ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own ratings" ON ratings;
CREATE POLICY "Users can update their own ratings"
  ON ratings FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own ratings" ON ratings;
CREATE POLICY "Users can delete their own ratings"
  ON ratings FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TABLE: reviews
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  media_id INTEGER NOT NULL,
  media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('movie', 'tv')),
  review_text TEXT NOT NULL CHECK (LENGTH(review_text) >= 10 AND LENGTH(review_text) <= 500),
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,
  is_spoiler BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- One review per user per media
  UNIQUE(user_id, media_id, media_type)
);

-- Indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_media ON reviews(media_id, media_type);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_helpful ON reviews(helpful_count DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at DESC);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
DROP POLICY IF EXISTS "Users can view all reviews" ON reviews;
CREATE POLICY "Users can view all reviews"
  ON reviews FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own reviews" ON reviews;
CREATE POLICY "Users can insert their own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;
CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TABLE: review_helpfulness
-- =====================================================
CREATE TABLE IF NOT EXISTS review_helpfulness (
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL, -- true = helpful, false = not helpful
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  PRIMARY KEY (review_id, user_id)
);

-- Index for review_helpfulness
CREATE INDEX IF NOT EXISTS idx_review_helpfulness_review ON review_helpfulness(review_id);

-- Enable RLS
ALTER TABLE review_helpfulness ENABLE ROW LEVEL SECURITY;

-- RLS Policies for review_helpfulness
DROP POLICY IF EXISTS "Users can view all helpfulness votes" ON review_helpfulness;
CREATE POLICY "Users can view all helpfulness votes"
  ON review_helpfulness FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own votes" ON review_helpfulness;
CREATE POLICY "Users can insert their own votes"
  ON review_helpfulness FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own votes" ON review_helpfulness;
CREATE POLICY "Users can update their own votes"
  ON review_helpfulness FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own votes" ON review_helpfulness;
CREATE POLICY "Users can delete their own votes"
  ON review_helpfulness FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update review helpful counts automatically
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE reviews
    SET 
      helpful_count = (
        SELECT COUNT(*) FROM review_helpfulness 
        WHERE review_id = NEW.review_id AND is_helpful = true
      ),
      not_helpful_count = (
        SELECT COUNT(*) FROM review_helpfulness 
        WHERE review_id = NEW.review_id AND is_helpful = false
      )
    WHERE id = NEW.review_id;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    UPDATE reviews
    SET 
      helpful_count = (
        SELECT COUNT(*) FROM review_helpfulness 
        WHERE review_id = OLD.review_id AND is_helpful = true
      ),
      not_helpful_count = (
        SELECT COUNT(*) FROM review_helpfulness 
        WHERE review_id = OLD.review_id AND is_helpful = false
      )
    WHERE id = OLD.review_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update counts
DROP TRIGGER IF EXISTS trigger_update_review_helpful_count ON review_helpfulness;
CREATE TRIGGER trigger_update_review_helpful_count
AFTER INSERT OR UPDATE OR DELETE ON review_helpfulness
FOR EACH ROW EXECUTE FUNCTION update_review_helpful_count();

-- Function to get average rating for a media item
CREATE OR REPLACE FUNCTION get_media_rating(
  p_media_id INTEGER,
  p_media_type VARCHAR(10)
)
RETURNS TABLE(
  average_rating DECIMAL(2,1),
  total_ratings INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(AVG(rating)::numeric, 1)::DECIMAL(2,1) as average_rating,
    COUNT(*)::INTEGER as total_ratings
  FROM ratings
  WHERE media_id = p_media_id AND media_type = p_media_type;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'FilmRitz Rating & Review System tables created successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Verify tables in Supabase Table Editor';
  RAISE NOTICE '2. Test RLS policies with different users';
  RAISE NOTICE '3. Implement backend services in your Vue app';
END $$;
