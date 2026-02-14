# 🪺 PrivateNest

A smart, private bookmark manager built with **Next.js 15**, **Supabase**, and **Tailwind CSS**.

> Your bookmarks. Your nest. Private and organized.

---

## ✨ Features

### Core
- **Google OAuth** — Sign in securely with your Google account
- **Add / Edit / Delete bookmarks** — Full CRUD with inline editing
- **Private by design** — Row Level Security ensures each user sees only their own data
- **Real-time sync** — Open two tabs; add a bookmark in one, it appears in the other

### Smart Features
- **Auto-fetch metadata** — Paste a URL and the title, description, and favicon fill automatically
- **Tags** — Organize bookmarks with tags, filter by clicking any tag
- **Search** — Instant client-side search across titles, URLs, descriptions, and tags
- **Sort** — Newest, oldest, A→Z, Z→A
- **Duplicate detection** — Warning popup when adding the same URL twice
- **Read/Unread toggle** — Track what you've already read
- **Export** — Download bookmarks as JSON or browser-importable HTML

### Polish
- **Dark/Light mode** — Toggle or auto-detect system preference
- **Stats bar** — Total, read/unread, weekly additions, top tags
- **Keyboard shortcuts** — `Ctrl+K` to add, `/` to search
- **Responsive** — Works on mobile and desktop
- **Smooth animations** — Slide-in forms, fade-in cards

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org) (App Router) | React framework, SSR, API routes |
| [Supabase](https://supabase.com) | Auth (Google OAuth), PostgreSQL database, Realtime |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [`@supabase/ssr`](https://github.com/supabase/auth-helpers) | Cookie-based session management |
| [`next-themes`](https://github.com/pacocoursey/next-themes) | Dark/light mode |
| [`lucide-react`](https://lucide.dev) | Icons |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)
- A Google Cloud OAuth app ([console.cloud.google.com](https://console.cloud.google.com))

### 1. Clone & Install

```bash
git clone https://github.com/ironsupr/PrivateNest.git
cd PrivateNest
npm install
```

### 2. Configure Supabase

Follow the detailed guide in [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) to:
1. Create a Supabase project
2. Enable Google OAuth
3. Run the SQL to create the `bookmarks` table with RLS
4. Copy your credentials

### 3. Set Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the login page.

---

## 🧩 Project Structure

```
src/
├── app/
│   ├── api/metadata/     # Server-side URL metadata fetcher
│   ├── auth/callback/    # OAuth callback handler
│   ├── dashboard/        # Main bookmark dashboard
│   ├── login/            # Login page
│   ├── layout.tsx        # Root layout + fonts
│   └── page.tsx          # Redirect to dashboard/login
├── components/
│   ├── bookmarks/        # AddBookmarkForm, BookmarkCard, BookmarkList, etc.
│   ├── tags/             # TagBadge, TagFilter
│   ├── ui/               # Header, ThemeToggle, StatsBar, ExportButton
│   └── providers/        # ThemeProvider
├── hooks/
│   ├── useBookmarks.ts   # CRUD + realtime subscription
│   └── useKeyboardShortcuts.ts
├── lib/supabase/         # Client, server, middleware helpers
└── types/                # TypeScript interfaces
```

---

## 🐛 Problems & Solutions

### 1. Supabase Realtime + RLS not delivering events
**Problem:** After adding a bookmark, other tabs didn't update. Supabase Realtime with Row Level Security doesn't always deliver `postgres_changes` events to the same client.

**Solution:** Implemented a two-layer approach:
- **Optimistic local state updates** — after insert/delete/update succeeds, immediately update React state
- **`visibilitychange` + `focus` listeners** — refetch bookmarks when a tab regains focus, ensuring data is always fresh

### 2. CORS when fetching URL metadata
**Problem:** Fetching `<title>` and `<meta>` tags from external URLs in the browser triggers CORS errors.

**Solution:** Created a Next.js API route (`/api/metadata`) that fetches the URL server-side and parses the HTML with regex. The browser only talks to our own API.

### 3. Metadata not ready when user clicks "Add" immediately
**Problem:** If the user pastes a URL and immediately clicks "Add Bookmark" before the debounced metadata fetch completes, the bookmark would save without a title.

**Solution:** The submit handler checks if metadata was fetched. If not, it performs a synchronous fetch before saving, so the bookmark always has a proper title.

### 4. `create-next-app` rejecting capital letters in path
**Problem:** `create-next-app` failed because the parent directory `Smart Bookmark App` contained uppercase letters, which npm package naming rules reject.

**Solution:** Created the project in a subdirectory (`privatenest/`) with a lowercase name.

### 5. Placeholder env vars causing build failures
**Problem:** Running `next build` with placeholder Supabase env vars (`your-project-url`) caused the root page to fail because `createServerClient` tried to make real HTTP requests during static generation.

**Solution:** Added `export const dynamic = 'force-dynamic'` to the root page to skip static prerendering.

---

## 📦 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Update the **Google OAuth redirect URI** in the Supabase dashboard to include your Vercel domain
5. Deploy

---

## 📄 License

MIT
