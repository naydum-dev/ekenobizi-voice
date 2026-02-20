# EKENOBIZI VOICE - MASTER CONTEXT DOCUMENT

## PROJECT OVERVIEW

**Name:** Ekenobizi Voice  
**Purpose:** Community blog platform for Ekenobizi community in Umuahia, Abia State, Nigeria  
**Tech Stack:** React + Tailwind CSS (Frontend/Vercel) + Supabase (Backend)  
**Developer Environment:** Windows, VSCode, Node.js v24.11.1, Git v2.51.1

## BRAND IDENTITY

- **Primary Color:** #942023 (Maroon)
- **Accent Color:** #769c61 (Green)
- **Text Color:** #020202 (Near Black)
- **Background Color:** #e5e6ea (Light Gray)

## PLANNED FEATURES

- User authentication (signup/login)
- Blog posts (create, read, update, delete)
- Comments system (authenticated users only)
- Admin dashboard
- Community-focused design

---

## COMPLETED WORK

### ✅ DAY 1: Project Foundation (Completed: Feb 16, 2026)

**What Was Built:**

1. **React Project Setup**
   - Tool: Vite (latest stable version)
   - Created project: `ekenobizi-voice`
   - Dev server running on: `http://localhost:5173`

2. **Tailwind CSS Integration**
   - Method: `@tailwindcss/vite` plugin (Vite-optimized approach)
   - Installed: `npm install tailwindcss @tailwindcss/vite`
   - Configured: Added Tailwind plugin to `vite.config.js`
   - CSS: Replaced `src/index.css` with `@import "tailwindcss";`
   - **Tested & Working:** Blue screen test confirmed Tailwind functionality

3. **Folder Structure Created**

```
   src/
   ├── components/   (Reusable UI components)
   ├── pages/        (Full page components)
   ├── services/     (Supabase API calls)
   ├── utils/        (Helper functions)
   ├── hooks/        (Custom React hooks)
   ├── styles/       (Custom CSS if needed)
   └── assets/       (Images, icons, fonts)
```

4. **Version Control**
   - Git initialized
   - First commit: "Initial project setup with Vite, React, and Tailwind"
   - Clean state captured

**Key Files Modified:**

- `vite.config.js` - Added Tailwind plugin
- `src/index.css` - Replaced with Tailwind import
- `src/App.jsx` - Tested Tailwind classes

**Concepts Learned:**

- Vite vs Create React App (modern build tools)
- JSX (JavaScript + XML syntax)
- Tailwind utility classes
- Git version control basics
- Terminal efficiency
- LF vs CRLF line endings (Windows)

---

### ✅ DAY 2: Supabase Setup & Database Design (Completed: Feb 19, 2026)

**What Was Built:**

1. **Supabase Project**
   - Project name: `ekenobizi-voice`
   - Region: West EU (Ireland)
   - Status: Healthy & Active
   - Data API: Enabled
   - Automatic RLS: Enabled

2. **API Keys Secured**
   - Created `.env.local` in project root
   - Stored `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - File covered by `.gitignore` via `*.local` wildcard — keys are safe from Git

3. **Supabase Client Configured**
   - File: `src/services/supabase.js`
   - Installed: `npm install @supabase/supabase-js`
   - Uses `import.meta.env` to read keys from `.env.local`
   - Exports `supabase` client for use across the entire app

4. **Database Schema Created (via SQL Editor)**
   - 3 tables created with correct `uuid` types and foreign key relationships
   - Row Level Security enabled on all tables

**Database Tables:**

```
profiles
├── id (uuid, PRIMARY KEY → auth.users.id)
├── username (text, NOT NULL)
├── full_name (text, nullable)
├── avatar_url (text, nullable)
└── created_at (timestamptz, default: now())

posts
├── id (uuid, PRIMARY KEY, auto-generated)
├── title (text, NOT NULL)
├── content (text, NOT NULL)
├── author_id (uuid, NOT NULL → profiles.id)
├── published (bool, default: false)
├── created_at (timestamptz, default: now())
└── updated_at (timestamptz, default: now())

comments
├── id (uuid, PRIMARY KEY, auto-generated)
├── content (text, NOT NULL)
├── post_id (uuid, NOT NULL → posts.id)
├── author_id (uuid, NOT NULL → profiles.id)
└── created_at (timestamptz, default: now())
```

**Table Relationships:**

```
auth.users ──< profiles    (one auth user, one profile)
profiles   ──< posts       (one profile, many posts)
posts      ──< comments    (one post, many comments)
profiles   ──< comments    (one profile, many comments)
```

**Foreign Key Rules (all ON DELETE CASCADE):**

- Delete a user → their profile is deleted
- Delete a profile → their posts are deleted
- Delete a post → its comments are deleted

**Key Files Created:**

- `.env.local` - API keys (not tracked by Git)
- `src/services/supabase.js` - Supabase client

**Concepts Learned:**

- What Supabase is (backend-in-a-box: database + auth + API)
- PostgreSQL relational database basics
- Table relationships and foreign keys
- UUID vs integer IDs (why UUID is better for auth)
- Row Level Security (RLS) — deny-by-default security
- Environment variables and why keys must be hidden
- SQL vs UI — SQL is faster and more precise for schema creation
- ON DELETE CASCADE — automatic cleanup of related data

---

## NEXT STEPS

### 📋 DAY 3: Authentication (Planned)

**Goals:**

- Build Signup page
- Build Login page
- Handle auth state in React (who is logged in?)
- Auto-create profile when a user signs up
- Protect routes (only logged-in users can access certain pages)
- React Router setup

**Estimated Time:** 2.5 - 3 hours

---

## CURRENT PROJECT STATE

**Status:** ✅ Ready for Day 3  
**Server:** Can be started with `npm run dev`  
**Git:** All Day 2 changes committed  
**Dependencies:** `@supabase/supabase-js` installed  
**Database:** 3 tables live on Supabase, RLS enabled

---

## DEVELOPMENT NOTES

**Working Approach:**

- Learning-focused (explanations before code)
- Step-by-step guidance
- Understanding "why" behind each decision
- Terminal commands preferred for efficiency
- Developer executes, Claude directs

**Key Decisions Made:**

1. Used Vite's `@tailwindcss/vite` plugin (newer method)
2. Replaced default CSS entirely with Tailwind
3. Created comprehensive folder structure upfront
4. Used SQL Editor instead of Supabase UI for table creation (more reliable)
5. All IDs use `uuid` type (consistent with Supabase Auth)
6. ON DELETE CASCADE on all foreign keys (clean data deletion)

---

_Last Updated: Day 2 Complete - Feb 19, 2026_
