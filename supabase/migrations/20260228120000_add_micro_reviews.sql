-- Add micro_reviews table for short user reviews with credibility scoring

CREATE TABLE IF NOT EXISTS micro_reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    film_id integer NOT NULL,
    content varchar(280) NOT NULL,
    credibility_score real DEFAULT 0,
    helpful_count integer DEFAULT 0,
    unhelpful_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_micro_reviews_film ON micro_reviews(film_id);
CREATE INDEX IF NOT EXISTS idx_micro_reviews_user ON micro_reviews(user_id);
