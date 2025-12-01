# Cloud Watchlist Setup Guide

Your watchlist now syncs automatically to Supabase! Here's what you need to do to enable it.

## Database Setup

### 1. Create the Watchlist Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tmdb_id INTEGER NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
  item_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tmdb_id)
);

-- Create index for faster queries
CREATE INDEX idx_watchlist_user_id ON watchlist(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Create policy: users can only access their own watchlist
CREATE POLICY "Users can manage their own watchlist" ON watchlist
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 2. Verify in Supabase Dashboard

1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Paste the SQL above and click **Run**
4. Go to **Table Editor** and verify the `watchlist` table exists

## How It Works

### Adding to Watchlist
- User clicks "Add to Watchlist" → item is added locally → automatically synced to Supabase

### Removing from Watchlist
- User clicks remove button → item is deleted locally → automatically synced to Supabase

### Loading Watchlist
- When user visits `/watchlist` → loads from Supabase (if logged in) → falls back to local storage
- Data persists across devices and browsers (for logged-in users)

### Offline Support
- If Supabase sync fails or user isn't logged in → data still saves to local storage
- When user logs in → cloud data is loaded automatically

## Features

✅ **Automatic Sync** - Changes sync to Supabase instantly
✅ **Multi-Device Support** - Access watchlist from any device after login
✅ **Offline Fallback** - Local storage backup if cloud is unavailable
✅ **Permanent Storage** - Data never expires (only if user clears browser data)
✅ **Secure** - Row-level security ensures users only see their own watchlist

## Troubleshooting

### Watchlist not syncing?
- Check browser console for errors
- Verify user is logged in (check `useAuthStore().user`)
- Ensure Supabase credentials are correct in `.env.local`

### Lost watchlist after clearing browser data?
- If user is logged in, watchlist will be restored from Supabase on next login
- For non-logged-in users, watchlist is local-only and will be lost

### Database policy errors?
- Make sure Row Level Security (RLS) policies are enabled
- Run the SQL setup again to ensure policies are created
