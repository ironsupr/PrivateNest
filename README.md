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

### 1. Duplicate Bookmark Detection (State Sync)
**Problem:** Users reported that even after deleting a bookmark, the "Add" dialog still flagged it as "already exists". This happened because the Dashboard and the Dialog were using separate instances of the `useBookmarks` hook, which weren't sharing state.

**Solution:** Refactored the app to use a centralized `BookmarkProvider`. All components now consume the same `BookmarkContext`, ensuring a single source of truth. As soon as a bookmark is deleted in the grid, the duplicate check in the dialog is updated instantly.

### 2. Shared Bookmark 404 Error (Next.js 15+ Lifecycle)
**Problem:** Individual public bookmark pages (`/b/[slug]`) were returning 404s in production even when the data existed. 

**Solution:** In Next.js 15 and 16, `params` and `searchParams` in Server Components are now Promises and must be explicitly awaited. I updated the shared route to `await params` before accessing the slug for the Supabase query.

### 3. Login "Request Path is Invalid" on Deployed Site
**Problem:** Google OAuth was working locally but failed on the Vercel deployment with a generic "request path is invalid" error.

**Solution:** Identified that Supabase's authentication redirect system is extremely sensitive to URL structure. Fixed this by:
- Adding the explicit callback path (`/auth/callback`) to the **Additional Redirect URLs**.
- Ensuring the **Site URL** in Supabase included the mandatory `https://` protocol (omitting the protocol or the trailing path often causes this cryptic error).

### 4. Sidebar Folder Sync vs Local State
**Problem:** Creating a folder from a bookmark card didn't update the folder list in the Sidebar because the data fetching was scattered across components.

**Solution:** Moved folder management into a `CollectionProvider`. This shared state ensures that creating, renaming, or deleting a folder anywhere in the UI is instantly reflected across all components.

### 5. Supabase Realtime + RLS not delivering events
**Problem:** After adding a bookmark, other tabs didn't update. Supabase Realtime with Row Level Security doesn't always deliver `postgres_changes` events to the same client if policies are complex.

**Solution:** Implemented a two-layer approach:
- **Optimistic local state updates** — after insert/delete/update succeeds, immediately update React state.
- **`visibilitychange` + `focus` listeners** — refetch bookmarks when a tab regains focus, ensuring data is always fresh.

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
