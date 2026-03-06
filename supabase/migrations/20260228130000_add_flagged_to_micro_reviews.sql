-- Add is_flagged column to micro_reviews table for moderation

ALTER TABLE micro_reviews
ADD COLUMN IF NOT EXISTS is_flagged boolean DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_micro_reviews_flagged ON micro_reviews(is_flagged);