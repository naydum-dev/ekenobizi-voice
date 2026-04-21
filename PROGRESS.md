# EKENOBIZI VOICE - MASTER CONTEXT DOCUMENT

## PROJECT OVERVIEW

**Name:** Ekenobizi Voice
**Purpose:** Community blog platform for Ekenobizi community in Umuahia, Abia State, Nigeria
**Tech Stack:** React + Tailwind CSS (Frontend/Vercel) + Supabase (Backend)
**Developer Environment:** Windows, VSCode, Node.js v24.11.1, Git v2.51.1
**Terminal:** Git Bash (use `touch` not PowerShell's `New-Item`)

---

## BRAND IDENTITY

| Token      | Value                  | Tailwind Class                |
| ---------- | ---------------------- | ----------------------------- |
| Primary    | #942023 (Maroon Red)   | `bg-primary` / `text-primary` |
| Accent     | #769c61 (Forest Green) | `bg-accent` / `text-accent`   |
| Text       | #020202 (Charcoal)     | `text-charcoal`               |
| Background | #e5e6ea (Light Gray)   | `bg-cream`                    |

- **Heading Font:** Playfair Display (Google Fonts) — `font-playfair`
- **Body Font:** Inter (Google Fonts)
- **Logo:** `src/assets/ekenobizi_voice_logo.png` — transparent background PNG. Displayed at `h-20` in Header.
- **Hero Image:** `src/assets/hero.jpg` — Home page hero background
- **About Hero:** `src/assets/about-hero.jpeg` — About page hero background

---

## FOLDER STRUCTURE

```
ekenobizi-voice/
├── public/
├── src/
│   ├── assets/
│   │   ├── ekenobizi_voice_logo.png
│   │   ├── hero.jpg
│   │   └── about-hero.jpeg
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── PostCard.jsx
│   │   ├── Comment.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Register.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── PostPage.jsx
│   │   ├── CreatePost.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── ResetPassword.jsx
│   ├── services/
│   │   └── supabase.js
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── index.css
├── CONTEXT.md
├── index.html
├── vite.config.js
├── .env.local
├── .gitignore
└── package.json
```

---

## DEPENDENCIES INSTALLED

```
tailwindcss: latest
@tailwindcss/vite: latest
react-router-dom: latest
@supabase/supabase-js: latest
react-icons: latest
```

---

## KEY FILE CONTENTS

### vite.config.js

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### src/index.css

```css
@import "tailwindcss";

@theme {
  --color-primary: #942023;
  --color-accent: #769c61;
  --color-charcoal: #020202;
  --color-cream: #e5e6ea;
  --font-sans: "Inter", system-ui, sans-serif;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

### src/services/supabase.js

```js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### .env.local

```
VITE_SUPABASE_URL=https://your_project_url.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## SUPABASE CONFIGURATION

- **Project Name:** ekenobizi-voice
- **Region:** West EU (Ireland)
- **RLS:** Enabled on all tables (deny by default)
- **Email Confirmation:** Enabled (users must confirm email before logging in)

---

## DATABASE SCHEMA

### Tables

```sql
-- User profiles (mirrors auth.users)
profiles
├── id          uuid PRIMARY KEY → auth.users.id
├── username    text NOT NULL
├── full_name   text (nullable)
├── avatar_url  text (nullable)
├── is_admin    boolean DEFAULT false
└── created_at  timestamptz DEFAULT now()

-- Blog posts
posts
├── id          uuid PRIMARY KEY (auto-generated)
├── title       text NOT NULL
├── content     text NOT NULL
├── excerpt     text NOT NULL DEFAULT ''
├── category    text NOT NULL DEFAULT 'Community'
├── author_id   uuid NOT NULL → profiles.id
├── published   bool DEFAULT false
├── created_at  timestamptz DEFAULT now()
└── updated_at  timestamptz DEFAULT now()

-- Post comments
comments
├── id          uuid PRIMARY KEY (auto-generated)
├── content     text NOT NULL
├── post_id     uuid NOT NULL → posts.id
├── author_id   uuid NOT NULL → profiles.id
└── created_at  timestamptz DEFAULT now()
```

### Relationships

```
auth.users ──< profiles    (one auth user → one profile)
profiles   ──< posts       (one profile → many posts)
posts      ──< comments    (one post → many comments)
profiles   ──< comments    (one profile → many comments)
```

All foreign keys use ON DELETE CASCADE — deleting a user removes their profile, posts, and comments automatically.

---

## DATABASE TRIGGER

Auto-creates a profiles row whenever a new user signs up via Supabase Auth:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

---

## RLS POLICIES

```sql
-- PROFILES
CREATE POLICY "Public can read profiles"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service can insert profiles"
  ON profiles FOR INSERT WITH CHECK (true);

-- POSTS
CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT USING (published = true);

CREATE POLICY "Admins can insert posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  ));

CREATE POLICY "Admins can update posts"
  ON posts FOR UPDATE
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  ));

CREATE POLICY "Admins can delete posts"
  ON posts FOR DELETE
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  ));

-- COMMENTS
CREATE POLICY "Public can read comments"
  ON comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = author_id);
```

---

## ROUTING (src/App.jsx)

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password" element={<ResetPassword />} />
  <Route path="/post/:id" element={<PostPage />} />
  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    }
  />
  <Route
    path="/create-post"
    element={
      <ProtectedRoute>
        <CreatePost />
      </ProtectedRoute>
    }
  />
</Routes>
```

---

## AUTH CONTEXT (src/contexts/AuthContext.jsx)

- Fetches session on load via `getSession()`
- Listens for auth changes via `onAuthStateChange()`
- Fetches `profiles` row after login — includes `is_admin`
- Exposes: `user`, `profile`, `isAdmin`, `loading`, `signOut`

---

## ADMIN SYSTEM

- `is_admin` boolean column on `profiles` table (DEFAULT false)
- Set manually via SQL: `UPDATE profiles SET is_admin = true WHERE username = 'chinedum_chijioke01'`
- `isAdmin` exposed from `AuthContext` — consumed by Header and CreatePost
- Write link in nav only visible to admins
- CreatePost page renders permission error for non-admins
- RLS policies on posts table restrict INSERT/UPDATE/DELETE to admins only

---

## PAGES BUILT

| Page            | Path             | File                         | Status                         |
| --------------- | ---------------- | ---------------------------- | ------------------------------ |
| Home            | /                | src/pages/Home.jsx           | Done - Hero image + animations |
| Post            | /post/:id        | src/pages/PostPage.jsx       | Done - Comments working        |
| About           | /about           | src/pages/About.jsx          | Done - Full community page     |
| Create Post     | /create-post     | src/pages/CreatePost.jsx     | Done - Admin only              |
| Register        | /register        | src/pages/Register.jsx       | Done - Built and wired         |
| Login           | /login           | src/pages/Login.jsx          | Done - Built and wired         |
| Profile         | /profile         | src/pages/Profile.jsx        | Done - Built and wired         |
| Forgot Password | /forgot-password | src/pages/ForgotPassword.jsx | Done - Built and wired         |
| Reset Password  | /reset-password  | src/pages/ResetPassword.jsx  | Done - Built and wired         |

---

## COMPONENTS BUILT

| Component      | File                              | Purpose                                   |
| -------------- | --------------------------------- | ----------------------------------------- |
| Header         | src/components/Header.jsx         | Two-row nav, auth-aware, admin Write link |
| Footer         | src/components/Footer.jsx         | 3-column, dynamic copyright year          |
| PostCard       | src/components/PostCard.jsx       | Reusable post preview card                |
| Comment        | src/components/Comment.jsx        | Single comment with delete button         |
| ProtectedRoute | src/components/ProtectedRoute.jsx | Guards private routes                     |

---

## GIT HISTORY

```
Day 1: Initial project setup with Vite, React, and Tailwind
Day 2: Supabase client configured, database schema created
Day 3: Layout, routing and brand design system
Day 3: Added logo to header
Day 4: Wire Join Community button to register page
Day 4: User registration with Supabase Auth
Day 5: Login, Auth Context, protected routes, Header auth state
Day 6: User profile page, profile editing, forgot/reset password flow
Day 7: Live posts from Supabase, PostCard component, single PostPage
Day 8: Display comments on post page
Day 8: Comment form — authenticated users can post comments
Day 8: Add slide-up animations and hero background image to landing page
Day 8: Fix header layout on small screens
Day 9: Add About page with community info, hero image and village icons
Day 9: Add delete own comments feature with RLS policy
Day 9: Add Create Post page with admin-only access and RLS policies
Day 9: Update CONTEXT.md to reflect Day 9 progress
```

---

## CONCEPTS LEARNED

### Day 1

- Vite vs Create React App, JSX syntax, Tailwind utility classes, Git basics, LF vs CRLF

### Day 2

- Supabase, PostgreSQL, table relationships, UUID, RLS, environment variables, ON DELETE CASCADE

### Day 3

- Tailwind v4 @theme block, React Router, NavLink active state, component composition

### Day 4

- Supabase Auth (signUp), controlled components, form validation, async/await, DB triggers, RLS

### Day 5

- React Context API, useContext, custom hooks (useAuth), session persistence, protected routes

### Day 6

- Fetching/updating user data, edit/display mode toggling, multi-page auth flows, useNavigate

### Day 7

- useEffect data fetching, three-state async pattern, Supabase joins, useParams, .single(), RLS on joined data

### Day 8

- Multiple useEffect hooks for independent fetches
- Extracting functions outside useEffect so they can be called from multiple places
- Re-fetching after a mutation to keep UI in sync
- Conditional rendering based on auth state
- RLS policies for SELECT and INSERT on the same table
- Missing RLS policies fail silently — empty results, no error
- CSS @keyframes animations — more reliable than toggling React state for load animations
- animation: slideUp 700ms ease-out both — both fills start state before animation plays
- Hero background image via inline backgroundImage style + dark overlay for readability
- Two-row header layout for responsive nav on small screens

### Day 9

- react-icons library for UI icons
- RLS DELETE policy — auth.uid() = author_id pattern for own data
- Passing functions as props (onDelete) to child components
- is_admin boolean column pattern for role-based access control
- Fetching profile data in AuthContext — exposing isAdmin app-wide
- Admin-only pages — rendering permission error for non-admins
- Supabase INSERT returning data with .select().single()
- Separate RLS policies needed per operation: SELECT, INSERT, UPDATE, DELETE
- git add -A flag stages all changes: new files, modified files, and deleted files

---

## CURRENT PROJECT STATE

**Status:** Days 1-9 Complete
**Dev Server:** npm run dev → http://localhost:5173
**Auth:** Registration + Login + Logout + Session persistence + Password reset all working
**Profiles:** Users can view and edit their username and full name
**Posts:** Home page displays live posts from Supabase. Single post view at /post/:id working. Admin can create posts from the app.
**Comments:** Display on post pages. Authenticated users can post. Users can delete own comments.
**About:** Full community page with hero image, five villages, mission pillars and story sections.
**Admin System:** is_admin flag on profiles. Write link and CreatePost page admin-only. RLS enforced.
**Database:** 3 tables live (profiles, posts, comments). Trigger + all RLS policies active.

---

## NEXT STEPS

### DAY 10 OPTIONS

**Option A: Post images**

- Supabase Storage bucket for image uploads
- Image upload field on Create Post form
- Display images on Home page cards and Post page
- Update posts table with image_url column

**Option B: Edit and Delete posts (Admin)**

- Edit button on post pages for admins
- Edit Post page pre-filled with existing data
- Delete post with confirmation prompt

**Option C: Draft management**

- Admin dashboard showing all posts (published + drafts)
- Toggle published status from dashboard
- Delete drafts

---

## DEVELOPMENT NOTES

**Working Approach:**

- Learning-focused (explanations before code)
- Claude writes files, developer replaces them
- Share existing files before updates
- One instruction / one file at a time

**Key Decisions Made:**

1. Vite with @tailwindcss/vite plugin (Tailwind v4 method)
2. @theme block in index.css for custom design tokens
3. SQL Editor used for all schema changes
4. All IDs use uuid
5. ON DELETE CASCADE on all foreign keys
6. Playfair Display for headings — editorial feel
7. Git Bash as terminal (touch not New-Item)
8. Email confirmation left enabled
9. AuthProvider wraps entire app at root level
10. onAuthStateChange for real-time auth sync
11. Profile page reads from profiles table (source of truth)
12. category and excerpt as proper DB columns
13. Public RLS policy on profiles allows author join on post queries
14. Home page uses featured post + sidebar layout
15. fetchComments extracted outside useEffect so it can be called after insert
16. RLS policies must be added per table — missing policies fail silently
17. CSS @keyframes used for hero animations (more reliable than React state toggling)
18. Hero image imported as JS module, set via inline backgroundImage style
19. Header split into two rows for clean responsive layout on small screens
20. is_admin boolean on profiles for role-based access control
21. isAdmin derived in AuthContext and exposed app-wide
22. Admin RLS policies use subquery: auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true)
23. CreatePost uses .select().single() after insert to get new post ID for redirect

---

_Last Updated: Day 9 Complete — Apr 3, 2026_
