-- Create table for feature flags

CREATE TABLE IF NOT EXISTS feature_flags (
  name text PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT false,
  percentage integer,
  allowed_users text[],
  force_off boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON feature_flags(enabled);
CREATE INDEX IF NOT EXISTS idx_feature_flags_percentage ON feature_flags(percentage);
