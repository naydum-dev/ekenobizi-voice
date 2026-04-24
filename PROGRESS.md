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
│   │   ├── EditPost.jsx
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
├── image_url   text (nullable)
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

All foreign keys use ON DELETE CASCADE — deleting a user removes their profile, posts, and comments automatically. Deleting a post removes all its comments automatically.

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

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = author_id);

-- STORAGE
CREATE POLICY "Admins can upload post images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'post-images'
    AND auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  );

CREATE POLICY "Public can view post images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images');
```

---

## SUPABASE STORAGE

- **Bucket name:** `post-images`
- **Public:** Yes
- **Purpose:** Stores cover images for blog posts
- **Upload flow:** File uploaded to Storage first → public URL returned → URL saved to `posts.image_url`
- **File naming:** `{user.id}-{Date.now()}.{ext}` — unique per upload

---

## ROUTING (src/App.jsx)

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password" element={<ResetPassword />} />
  <Route path="/post/:id" element={<PostPage />} />
  <Route path="/stories" element={<ComingSoon page="Stories" />} />
  <Route path="/community" element={<ComingSoon page="Community" />} />
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
  <Route
    path="/edit-post/:id"
    element={
      <ProtectedRoute>
        <EditPost />
      </ProtectedRoute>
    }
  />
</Routes>
```

---

## AUTH CONTEXT (src/contexts/AuthContext.jsx)

- Fetches session on load via `getSession()`
- Listens for auth changes via `onAuthStateChange()`
- Fetches `profiles` row after login — includes `username`, `full_name`, `is_admin`
- Exposes: `user`, `profile`, `isAdmin`, `loading`, `signOut`, `refreshProfile`
- `refreshProfile()` — re-fetches profile from DB, called after profile edits so Header updates immediately

---

## ADMIN SYSTEM

- `is_admin` boolean column on `profiles` table (DEFAULT false)
- Set manually via SQL: `UPDATE profiles SET is_admin = true WHERE username = 'EkenobiziVoice'`
- `isAdmin` exposed from `AuthContext` — consumed by Header, PostPage, CreatePost, and EditPost
- Write link in nav only visible to admins
- CreatePost and EditPost pages render permission error for non-admins
- RLS policies on posts table restrict INSERT/UPDATE/DELETE to admins only
- Admin username: `EkenobiziVoice`

---

## PAGES BUILT

| Page            | Path             | File                         | Status                                                   |
| --------------- | ---------------- | ---------------------------- | -------------------------------------------------------- |
| Home            | /                | src/pages/Home.jsx           | Done — hero, featured + sidebar layout, images           |
| Post            | /post/:id        | src/pages/PostPage.jsx       | Done — cover image, comments, admin edit/delete buttons  |
| About           | /about           | src/pages/About.jsx          | Done — full community page                               |
| Create Post     | /create-post     | src/pages/CreatePost.jsx     | Done — image upload, admin only                          |
| Edit Post       | /edit-post/:id   | src/pages/EditPost.jsx       | Done — pre-filled form, image replace/remove, admin only |
| Register        | /register        | src/pages/Register.jsx       | Done — built and wired                                   |
| Login           | /login           | src/pages/Login.jsx          | Done — built and wired                                   |
| Profile         | /profile         | src/pages/Profile.jsx        | Done — username + full name edit                         |
| Forgot Password | /forgot-password | src/pages/ForgotPassword.jsx | Done — built and wired                                   |
| Reset Password  | /reset-password  | src/pages/ResetPassword.jsx  | Done — built and wired                                   |

---

## COMPONENTS BUILT

| Component      | File                              | Purpose                                              |
| -------------- | --------------------------------- | ---------------------------------------------------- |
| Header         | src/components/Header.jsx         | Two-row nav, auth-aware, reads username from profile |
| Footer         | src/components/Footer.jsx         | 3-column, dynamic copyright year                     |
| PostCard       | src/components/PostCard.jsx       | Reusable post preview card with image support        |
| Comment        | src/components/Comment.jsx        | Single comment with edit/delete (owner only)         |
| ProtectedRoute | src/components/ProtectedRoute.jsx | Guards private routes                                |

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
Day 10: Comment edit functionality with confirmation on delete
Day 11: Add image upload to posts — Storage bucket, image_url column, CreatePost upload field, images on Home and PostPage
Day 11: Fix profile page route, header username source, and profile refresh after edit
Day 12: Add Edit Post page with pre-filled form and image replacement
Day 12: Add Delete Post with confirmation and cascade delete
Day 12: Update CONTEXT.md to reflect Day 12 progress
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
- git add -A flag stages all changes across the entire repo regardless of current folder location

### Day 10

- Boolean flag pattern for toggling between display mode and edit mode (`isEditing`)
- Local state for in-progress edits (`editText`) — keeps textarea value independent of saved data
- Updating a single item in state with `.map()` — no full re-fetch needed after a mutation
- `window.confirm()` for simple confirmation dialogs — native, zero extra code
- RLS UPDATE policy — same `auth.uid() = author_id` pattern as DELETE
- Always add the RLS policy before building the UI — missing policies fail silently
- Props as a communication contract — component calls `onEdit(id, text)`, parent owns the Supabase logic
- `git add -A` vs `git add .` — `-A` stages all changes repo-wide, `.` stages from current folder down

### Day 11

- Supabase Storage works differently from the database — upload the file first, get back a URL, save that URL to the DB row
- `URL.createObjectURL()` creates a temporary local preview before the file is uploaded
- Storage RLS policies are written in SQL just like table policies, run from the SQL Editor
- The Home page builds its own card markup — updating PostCard.jsx alone wasn't enough
- AuthContext caches profile on login — a `refreshProfile()` function is needed to sync changes made on the Profile page
- Header must read username from `profile` (profiles table) not `user.user_metadata` (Supabase Auth object)
- `user.user_metadata` is set at signup and never updated — always use the profiles table as source of truth for display data
- A missing route in App.jsx renders a blank white page with no error — always check App.jsx first

### Day 12

- Pre-filling a form from fetched data — call all `setState` setters inside `useEffect` after the fetch resolves
- Two-phase load pattern — fetch existing data first, only render the form after loading is false
- Supabase UPDATE vs INSERT — `.update()` always needs `.eq('id', row_id)` to target a specific row; without it every row would be updated
- Conditional image handling — three scenarios: keep existing (`existingImageUrl`), replace with new (`newImageFile`), or remove entirely (set both to null)
- Two image state variables — `existingImageUrl` (from DB) and `newImageFile` (new file pick) — kept separate so save logic can decide which path to take
- `URL.createObjectURL()` reused for edit preview — same pattern as CreatePost
- Double-guarding admin pages — `ProtectedRoute` handles unauthenticated users, `isAdmin` check inside the page handles non-admin logged-in users
- `ON DELETE CASCADE` on posts → comments means deleting a post cleans up all its comments automatically — no extra Supabase calls needed
- `updated_at: new Date().toISOString()` — manually passing the timestamp on update since Supabase doesn't auto-update it by default

---

## CURRENT PROJECT STATE

**Status:** Days 1–12 Complete
**Dev Server:** `npm run dev` → http://localhost:5173
**Auth:** Registration + Login + Logout + Session persistence + Password reset all working
**Profiles:** Users can view and edit their username and full name. Changes reflect in Header immediately via `refreshProfile()`
**Posts:** Home page displays live posts with featured + sidebar layout. Cover images show on cards and post pages. Admin can create, edit, and delete posts. Edit form pre-fills with existing data including current image.
**Comments:** Display on post pages. Authenticated users can post. Users can edit and delete their own comments. Confirmation dialog before delete.
**About:** Full community page with hero image, five villages, mission pillars and story sections.
**Admin System:** `is_admin` flag on profiles. Write, Edit, and Delete restricted to admins. RLS enforced on all post operations. Admin username: `EkenobiziVoice`.
**Storage:** `post-images` bucket live. Admins can upload and replace images, everyone can view.
**Database:** 3 tables live (profiles, posts, comments). `image_url` column on posts. Trigger + all RLS policies active.

---

## NEXT STEPS

### DAY 13: Suggestions welcome

- Pagination or infinite scroll on Home page
- Search / filter posts by category
- Reading time estimate on posts
- SEO improvements (page titles, meta description)
- Deploy to Vercel

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
24. Comment edit/delete buttons only render when currentUserId === comment.author_id
25. Local state update with .map() after edit — avoids unnecessary re-fetch
26. window.confirm() used for delete confirmation — native dialog, no extra dependencies
27. Supabase Storage bucket `post-images` — public, admin upload only
28. File naming in Storage: `{user.id}-{Date.now()}.{ext}` — guarantees uniqueness
29. `URL.createObjectURL()` used for instant image preview before upload
30. Header reads username from `profile` context, not `user.user_metadata`
31. `refreshProfile()` in AuthContext re-fetches profile after edits — keeps Header in sync
32. `/profile` route must be in App.jsx wrapped in ProtectedRoute
33. EditPost pre-fills form fields by calling setState setters inside useEffect after fetch
34. Two-phase load on EditPost — fetch first, render form only after loading is false
35. `.update().eq('id', id)` always required — omitting .eq() would update every row
36. Two image state variables on EditPost: `existingImageUrl` (DB value) and `newImageFile` (new pick)
37. EditPost wrapped in ProtectedRoute + isAdmin check — two layers of access control
38. Deleting a post cascades to comments — no manual comment cleanup needed

---

_Last Updated: Day 12 Complete — Apr 24, 2026_
