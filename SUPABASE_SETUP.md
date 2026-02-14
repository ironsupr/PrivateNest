# PrivateNest — Supabase Setup Guide

Follow these steps to connect your Supabase project to the app.

---

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Choose an organization, set a name (e.g., `privatenest`), set a password, choose your region
3. Wait for the project to be created
4. Go to **Settings → API** and copy:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **anon public** key

5. Paste both into your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://abc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

---

## Step 2: Enable Google OAuth

### In Google Cloud Console:
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client**
4. Choose **Web application**
5. Set **Authorized redirect URI** to:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
   (Replace `<your-project-ref>` with your Supabase project reference ID — visible in the URL when you're in the Supabase dashboard)
6. Copy the **Client ID** and **Client Secret**

### In Supabase Dashboard:
1. Go to **Authentication → Providers → Google**
2. Toggle **Enable** to ON
3. Paste the **Client ID** and **Client Secret** from Google
4. Save

---

## Step 3: Create the Database Table

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this SQL:

```sql
-- Bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  favicon_url TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Users can only see their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own bookmarks
CREATE POLICY "Users can update own bookmarks"
  ON bookmarks FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Enable Realtime for the bookmarks table
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

---

## Step 4: Enable Realtime

1. Go to **Database → Replication** in Supabase Dashboard
2. Under **supabase_realtime**, ensure the `bookmarks` table is listed
   (The SQL above already adds it, but double-check)

---

## Step 5: Run the App

```bash
cd privatenest
npm run dev
```

Open `http://localhost:3000` — you should see the login page!
