# EKENOBIZI VOICE - MASTER CONTEXT DOCUMENT

## PROJECT OVERVIEW

**Name:** Ekenobizi Voice
**Purpose:** Community blog platform for Ekenobizi community in Umuahia, Abia State, Nigeria
**Tech Stack:** React + Tailwind CSS (Frontend/Vercel) + Supabase (Backend)
**Developer Environment:** Windows, VSCode, Node.js v24.11.1, Git v2.51.1
**Terminal:** Git Bash (use `touch` not PowerShell's `New-Item`)
**Live URL:** https://ekenobizi-voice.vercel.app

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
- **Hero Image:** `src/assets/hero.jpg` — Home page hero background. Also copied to `public/hero.jpg` for OG image use.
- **About Hero:** `src/assets/about-hero.jpeg` — About page hero background

---

## FOLDER STRUCTURE

```
ekenobizi-voice/
├── public/
│   ├── favicon.ico
│   └── hero.jpg                  ← copy of src/assets/hero.jpg for OG image
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
│   │   ├── ProtectedRoute.jsx
│   │   └── SEO.jsx
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
│   │   ├── ResetPassword.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── Stories.jsx
│   │   └── SubmitStory.jsx
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
react-helmet-async: latest
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

### src/main.jsx

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
```

### src/components/SEO.jsx

```jsx
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Ekenobizi Voice";
const SITE_URL = "https://ekenobizi-voice.vercel.app";
const DEFAULT_DESCRIPTION =
  "Ekenobizi Voice is the community blog for Ekenobizi in Umuahia, Abia State — sharing stories, news, and voices from our five villages.";
const DEFAULT_IMAGE = `${SITE_URL}/hero.jpg`;

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  article = null,
}) {
  const fullTitle = title ? `${title} – ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Article-specific (PostPage only) */}
      {article?.publishedTime && (
        <meta
          property="article:published_time"
          content={article.publishedTime}
        />
      )}
      {article?.author && (
        <meta property="article:author" content={article.author} />
      )}
      {article?.category && (
        <meta property="article:section" content={article.category} />
      )}
    </Helmet>
  );
}
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

-- Community story submissions
submissions
├── id          uuid PRIMARY KEY (auto-generated)
├── title       text NOT NULL
├── content     text NOT NULL
├── excerpt     text NOT NULL DEFAULT ''
├── category    text NOT NULL DEFAULT 'Community'
├── author_id   uuid NOT NULL → profiles.id
├── status      text NOT NULL DEFAULT 'pending'
└── created_at  timestamptz DEFAULT now()
```

### Relationships

```
auth.users ──< profiles    (one auth user → one profile)
profiles   ──< posts       (one profile → many posts)
posts      ──< comments    (one post → many comments)
profiles   ──< comments    (one profile → many comments)
profiles   ──< submissions (one profile → many submissions)
```

All foreign keys use ON DELETE CASCADE — deleting a user removes their profile, posts, comments, and submissions automatically. Deleting a post removes all its comments automatically.

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

CREATE POLICY "Admins can delete any comment"
  ON comments FOR DELETE
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  ));

-- SUBMISSIONS
CREATE POLICY "Users can insert own submissions"
  ON submissions FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can read own submissions"
  ON submissions FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Admins can read all submissions"
  ON submissions FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  ));

CREATE POLICY "Admins can update submissions"
  ON submissions FOR UPDATE
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  ));

CREATE POLICY "Admins can delete submissions"
  ON submissions FOR DELETE
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  ));

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
- **Access:** Admin upload only. Members cannot upload images (admin-controlled).

---

## ROUTING (src/App.jsx)

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/stories" element={<Stories />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password" element={<ResetPassword />} />
  <Route path="/post/:id" element={<PostPage />} />
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
    path="/submit"
    element={
      <ProtectedRoute>
        <SubmitStory />
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
  <Route
    path="/admin"
    element={
      <ProtectedRoute>
        <AdminDashboard />
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

## SEO SYSTEM (Day 16)

### Overview

- **Library:** `react-helmet-async` — injects tags into `<head>` from inside any page component
- **Provider:** `HelmetProvider` wraps entire app in `src/main.jsx`
- **Component:** `src/components/SEO.jsx` — reusable, accepts props per page
- **OG image fallback:** `public/hero.jpg` — accessible at `https://ekenobizi-voice.vercel.app/hero.jpg`

### SEO Component Props

| Prop          | Type   | Default         | Description                                                |
| ------------- | ------ | --------------- | ---------------------------------------------------------- |
| `title`       | string | —               | Page title. Rendered as `{title} – Ekenobizi Voice`        |
| `description` | string | Site default    | Meta description and OG description                        |
| `image`       | string | `/hero.jpg` URL | OG and Twitter card image (must be absolute URL)           |
| `url`         | string | Site root       | Page path e.g. `"/about"` — domain prepended automatically |
| `type`        | string | `"website"`     | OG type — use `"article"` for PostPage                     |
| `article`     | object | `null`          | `{ publishedTime, author, category }` — PostPage only      |

### Tags injected per page

| Page     | Title                          | Description                  | Type    | JSON-LD              |
| -------- | ------------------------------ | ---------------------------- | ------- | -------------------- |
| Home     | Home – Ekenobizi Voice         | Community journalism tagline | website | No                   |
| About    | About Us – Ekenobizi Voice     | Community background         | website | No                   |
| Stories  | Stories – Ekenobizi Voice      | Archive description          | website | No                   |
| PostPage | {post.title} – Ekenobizi Voice | {post.excerpt}               | article | Yes (Article schema) |

### JSON-LD on PostPage

Injects `<script type="application/ld+json">` with Article schema including:

- `headline`, `description`, `image`, `datePublished`, `dateModified`
- `author` (Person), `publisher` (Organization), `mainEntityOfPage`

### index.html fallback tags

Base meta tags in `index.html` serve as fallbacks before React hydrates:

- `<title>Ekenobizi Voice</title>`
- Default `<meta name="description">`, Open Graph, and Twitter Card tags
- These are overridden per-page by `react-helmet-async`

### Testing tools

- OG tags: **opengraph.xyz**
- JSON-LD / rich results: **search.google.com/test/rich-results**

---

## SOCIAL MEDIA SYSTEM (Day 17)

### Platforms

| Platform    | URL                                     |
| ----------- | --------------------------------------- |
| Facebook    | https://web.facebook.com/EkenobiziVoice |
| X (Twitter) | https://x.com/ekenobizivoice            |

### Where Social Links Appear

- **Footer** — "Follow Us" column (4th column) with icon + label links
- **About page** — Two circular icon buttons in the CTA section, between the paragraph and the Join button

### Icons Used

- `FaFacebook` from `react-icons/fa6`
- `FaXTwitter` from `react-icons/fa6`

### SOCIAL_LINKS pattern (used in both Footer and About)

```js
const SOCIAL_LINKS = [
  {
    icon: <FaFacebook size={20} />,
    href: "https://web.facebook.com/EkenobiziVoice",
    label: "Facebook",
  },
  {
    icon: <FaXTwitter size={20} />,
    href: "https://x.com/ekenobizivoice",
    label: "X (Twitter)",
  },
];
```

---

## ADMIN SYSTEM

- `is_admin` boolean column on `profiles` table (DEFAULT false)
- Set manually via SQL: `UPDATE profiles SET is_admin = true WHERE username = 'EkenobiziVoice'`
- `isAdmin` exposed from `AuthContext` — consumed by Header, PostPage, CreatePost, EditPost, and AdminDashboard
- Write and Admin links in nav only visible to admins
- CreatePost and EditPost pages render permission error for non-admins
- AdminDashboard redirects non-admins to home page
- RLS policies on posts table restrict INSERT/UPDATE/DELETE to admins only
- Admin username: `EkenobiziVoice`

---

## PAGES BUILT

| Page            | Path             | File                         | Status                                                                                                       |
| --------------- | ---------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Home            | /                | src/pages/Home.jsx           | Done — hero, featured + sidebar layout, images, auth-aware hero buttons, SEO                                 |
| Stories         | /stories         | src/pages/Stories.jsx        | Done — 3-column archive grid, category filter, keyword search, infinite scroll (9 per page), post count, SEO |
| Post            | /post/:id        | src/pages/PostPage.jsx       | Done — cover image, comments, admin edit/delete buttons, SEO + JSON-LD                                       |
| About           | /about           | src/pages/About.jsx          | Done — full community page, social icons in CTA, SEO                                                         |
| Submit Story    | /submit          | src/pages/SubmitStory.jsx    | Done — form for logged-in members, pending review workflow, success screen                                   |
| Create Post     | /create-post     | src/pages/CreatePost.jsx     | Done — image upload, admin only                                                                              |
| Edit Post       | /edit-post/:id   | src/pages/EditPost.jsx       | Done — pre-filled form, image replace/remove, admin only                                                     |
| Register        | /register        | src/pages/Register.jsx       | Done — built and wired                                                                                       |
| Login           | /login           | src/pages/Login.jsx          | Done — built and wired                                                                                       |
| Profile         | /profile         | src/pages/Profile.jsx        | Done — username + full name edit                                                                             |
| Forgot Password | /forgot-password | src/pages/ForgotPassword.jsx | Done — built and wired                                                                                       |
| Reset Password  | /reset-password  | src/pages/ResetPassword.jsx  | Done — built and wired                                                                                       |
| Admin Dashboard | /admin           | src/pages/AdminDashboard.jsx | Done — stats (incl. pending submissions), members, comment moderation, submissions review tab                |

---

## COMPONENTS BUILT

| Component      | File                              | Purpose                                                       |
| -------------- | --------------------------------- | ------------------------------------------------------------- |
| Header         | src/components/Header.jsx         | Two-row nav, auth-aware, reads username from profile          |
| Footer         | src/components/Footer.jsx         | 4-column, dynamic copyright year, social media links          |
| PostCard       | src/components/PostCard.jsx       | Reusable post preview card with image support                 |
| Comment        | src/components/Comment.jsx        | Single comment with edit/delete (owner only)                  |
| ProtectedRoute | src/components/ProtectedRoute.jsx | Guards private routes                                         |
| SEO            | src/components/SEO.jsx            | Injects per-page meta, OG, Twitter Card, canonical via Helmet |

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
Day 13: Add Admin Dashboard — stats, member list with search, comment moderation
Day 13: Add Admins can delete any comment RLS policy
Day 13: Add /admin route to App.jsx and Admin nav link to Header
Day 13: Update CONTEXT.md to reflect Day 13 progress
Day 14: Add Stories archive page — 3-column grid, category filter
Day 14: Fix hero buttons — Read Stories to /stories, Share Your Story auth-aware
Day 14: Fix CTA button at bottom of Home — auth-aware
Day 15: Add submissions table with RLS policies
Day 15: Add SubmitStory page — form, success screen, pending review flow
Day 15: Update AdminDashboard — Submissions tab, approve and dismiss actions
Day 15: Update CONTEXT.md to reflect Day 15 progress
Day 16: Install react-helmet-async, wrap app in HelmetProvider
Day 16: Add SEO.jsx component — meta, OG, Twitter Card, canonical tags
Day 16: Add SEO to Home, About, Stories pages
Day 16: Add SEO + JSON-LD Article schema to PostPage
Day 16: Copy hero.jpg to public/ for OG image
Day 16: Update index.html — proper title, base fallback meta tags
Day 16: Update CONTEXT.md to reflect Day 16 progress
Day 17: Add social media links — Facebook and X (Twitter) to Footer and About page
Day 17: Add keyword search to Stories page — filters on title and excerpt
Day 17: Add infinite scroll to Stories page — 9 posts per batch, IntersectionObserver
Day 17: Update CONTEXT.md to reflect Day 17 progress
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

### Day 13

- `Promise.all()` — runs multiple async operations in parallel, waits for all to finish together; faster than sequential awaits
- `count: 'exact', head: true` — Supabase COUNT query pattern; returns only the number, no rows fetched; efficient for dashboard stats
- Tab UI pattern — single `activeTab` state string controls which section renders; cleaner than multiple boolean flags
- Additive admin architecture — new admin features live in a dedicated `/admin` route without touching existing admin functionality on other pages
- RLS coexistence — two DELETE policies on the same table work fine; Supabase uses OR logic between policies on the same operation
- Admin redirect pattern — check `authLoading` first, then `isAdmin`, then redirect; avoids flashing the page before auth resolves
- Joining across three tables in one Supabase query — `select('*, profiles(username), posts(title)')` pulls related data from comments, their authors, and their parent posts simultaneously

### Day 14

- Client-side filtering — filter state derived from a full fetched list; no extra Supabase calls on category change
- Sticky filter bar — `sticky top-0 z-20` keeps the category bar visible while scrolling the archive
- `overflow-x-auto` on filter bar — prevents layout break on mobile when many category buttons exist
- Consistent empty state pattern — empty state per filtered category with an escape hatch back to "All"
- Auth-aware buttons — `to={user ? "/submit" : "/register"}` pattern; single ternary handles routing based on login state
- Label swap on CTA — logged-in users see "Share Your Story", logged-out see "Join Free Today"; same button, different message

### Day 15

- Submissions table — separate from posts; `status` column (`pending`, `approved`, `dismissed`) tracks lifecycle
- Approve flow — insert into posts with `published: true`, then update submission status to `approved`; two sequential Supabase calls
- Dismiss flow — update submission status to `dismissed` only; no post created
- Local state update after approve/dismiss — `.map()` to flip status in state; avoids full re-fetch
- Pending count stat card — derived from a filtered COUNT query on submissions with `status = pending`
- Resolved section — filtered from the same submissions array; appears only when resolved items exist
- `<details>` / `<summary>` HTML elements — native collapsible for full story preview; zero JS needed
- Pending badge on tab — red pill showing count only renders when `stats.submissions > 0`
- Image upload kept admin-controlled — members submit text only; admin adds cover image via Edit Post after approval
- Always add RLS policies before building UI — missing policies fail silently with empty results

### Day 16

- `react-helmet-async` is the correct library for React 18+ — the older `react-helmet` is unmaintained and breaks in strict mode
- `HelmetProvider` must wrap the entire app at the root level (in `main.jsx`) — not just individual pages
- OG images must be absolute public URLs — local `src/assets/` files are not accessible to crawlers; copy to `public/` folder instead
- Files in `public/` are served at the root URL — `public/hero.jpg` becomes `https://domain.com/hero.jpg` automatically by Vite
- `index.html` base tags serve as fallback before React hydrates — important for crawlers that don't execute JavaScript
- `react-helmet-async` overrides `index.html` tags per page — no conflict; the most specific tag wins
- `type="article"` on OG tells social platforms this is an article, enabling richer previews on Facebook and LinkedIn
- `og:article:published_time`, `og:article:author`, `og:article:section` — article-specific OG tags for PostPage
- JSON-LD structured data (`<script type="application/ld+json">`) — machine-readable schema that makes Google eligible to show rich results
- `dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}` — correct React pattern for injecting JSON-LD scripts
- Auth pages (Login, Register, ForgotPassword, ResetPassword) don't need SEO — they are utility pages not indexed meaningfully by Google
- Test OG tags at opengraph.xyz — shows exactly what WhatsApp/Facebook/Twitter will display when a link is shared
- Test JSON-LD at search.google.com/test/rich-results — shows if Google can parse the Article schema

### Day 17

- `FaFacebook` and `FaXTwitter` are from `react-icons/fa6` — the fa6 package includes the updated X (Twitter) icon; fa (fa5) only has the old bird logo
- `SOCIAL_LINKS` array pattern — centralises icon, href, and label in one place; map over it to render links; easy to add new platforms later
- `target="_blank" rel="noopener noreferrer"` — always use both on external links; `noopener` prevents the new tab from accessing `window.opener`, `noreferrer` also hides the referrer header
- `aria-label` on icon-only buttons — screen readers need a text label when there is no visible text next to the icon
- Facebook uses `web.facebook.com` subdomain — some regions redirect `facebook.com` to the app; `web.facebook.com` always opens the desktop web version
- Infinite scroll with `IntersectionObserver` — attach observer to a sentinel div at the bottom of the list; fires a callback when it enters the viewport; cleaner than scroll event listeners
- `useCallback` on `loadMore` — prevents the observer `useEffect` from re-running on every render by stabilising the function reference
- Sentinel pattern — a hidden div at the bottom of the grid acts as the trigger; spinner shown inside it while more posts exist
- Client-side pagination with `slice()` — all posts fetched once; `visible` state holds the current slice; `page` tracks how many batches have loaded
- Search + category filter composition — both filters applied sequentially on the same `allPosts` array; resetting `page` and `visible` on every filter change keeps the grid consistent
- Clear button on search input — conditional render based on `searchQuery` being non-empty; resets to empty string on click
- Result count line reflects active filters — shows category and search term together when both are active; gives users clear feedback on what they are viewing

---

## CURRENT PROJECT STATE

**Status:** Days 1–17 Complete
**Dev Server:** `npm run dev` → http://localhost:5173
**Live URL:** https://ekenobizi-voice.vercel.app
**Auth:** Registration + Login + Logout + Session persistence + Password reset all working
**Profiles:** Users can view and edit their username and full name. Changes reflect in Header immediately via `refreshProfile()`
**Posts:** Home page displays live posts with featured + sidebar layout. Cover images show on cards and post pages. Admin can create, edit, and delete posts. Edit form pre-fills with existing data including current image.
**Stories Page:** `/stories` — clean 3-column archive grid of all published posts. Sticky category filter bar. Keyword search bar filters on title and excerpt. Infinite scroll loads 9 posts per batch via IntersectionObserver. Post count display reflects active filters.
**Comments:** Display on post pages. Authenticated users can post. Users can edit and delete their own comments. Admin can delete any comment from the dashboard. Confirmation dialog before delete.
**Submissions:** Logged-in members can submit stories via `/submit`. Submissions go to `pending` status. Admin reviews in Dashboard Submissions tab — can approve (publishes as post) or dismiss. Resolved submissions tracked.
**About:** Full community page with hero image, five villages, mission pillars, story sections, and social media icons in CTA.
**Admin System:** `is_admin` flag on profiles. Write, Edit, Delete, and Admin Dashboard restricted to admins. RLS enforced on all post, comment, and submission operations. Admin username: `EkenobiziVoice`.
**Admin Dashboard:** `/admin` route — live stats (users, posts, comments, pending submissions), member list with real-time search, comment moderation, submissions review with approve/dismiss.
**Storage:** `post-images` bucket live. Admins can upload and replace images, everyone can view.
**Database:** 4 tables live (profiles, posts, comments, submissions). Trigger + all RLS policies active.
**SEO:** `react-helmet-async` installed. Per-page meta tags, Open Graph, Twitter Card, and canonical URLs on Home, About, Stories, and PostPage. JSON-LD Article schema on PostPage. Base fallback tags in `index.html`. OG image at `public/hero.jpg`.
**Social Media:** Facebook (`https://web.facebook.com/EkenobiziVoice`) and X (`https://x.com/ekenobizivoice`) linked in Footer and About page CTA. Icons from `react-icons/fa6`.

---

## NEXT STEPS

### DAY 18: Suggestions welcome

- Reading time estimate on posts
- Pagination or infinite scroll on Home page
- Custom domain setup on Vercel
- Test SEO tags live — opengraph.xyz + Google Rich Results Test

---

## DEVELOPMENT NOTES

**Working Approach:**

- Learning-focused (explanations before code)
- Claude writes files, developer replaces them
- Share existing files before updates
- One instruction at a time — test before moving on

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
39. Promise.all() used in AdminDashboard — all Supabase queries fire in parallel
40. count: 'exact', head: true — fetches only the count, not the rows; used for stats
41. Two DELETE policies on comments coexist — users delete own, admins delete any; Supabase OR logic allows either
42. AdminDashboard checks authLoading before isAdmin to avoid redirect flash on page load
43. Tab UI in AdminDashboard — single activeTab state drives which section renders
44. Stories page uses client-side filtering — full list fetched once, filtered in state on category change
45. Auth-aware hero buttons — ternary on `to` prop routes based on user login state
46. Submissions table uses status column — pending / approved / dismissed lifecycle
47. Approve action inserts into posts then updates submission status — two sequential calls
48. `<details>/<summary>` used for full story preview in admin — native HTML, no JS needed
49. Image upload kept admin-controlled — members submit text only, admin adds image via Edit Post
50. Pending submissions badge on Dashboard tab — only renders when count > 0
51. react-helmet-async used over react-helmet — compatible with React 18 strict mode
52. HelmetProvider wraps entire app in main.jsx — required for Helmet to work anywhere in the tree
53. OG images must be absolute URLs pointing to publicly accessible files — src/assets/ is not public
54. Files placed in public/ are served at the site root by Vite — no import needed, just reference by URL
55. index.html base meta tags act as crawlers fallback before React hydrates
56. JSON-LD injected via dangerouslySetInnerHTML on PostPage — correct React pattern for script tags
57. Auth pages skipped for SEO — utility pages with no meaningful indexing or sharing value
58. SOCIAL_LINKS array pattern — centralise platform data in one place, map to render; easy to extend
59. FaFacebook and FaXTwitter from react-icons/fa6 — fa6 has the updated X logo; fa5 only has the old bird
60. target="\_blank" rel="noopener noreferrer" — always used together on all external links
61. aria-label on icon-only anchor tags — required for screen reader accessibility
62. Infinite scroll uses IntersectionObserver on a sentinel div — cleaner than scroll event listeners
63. useCallback on loadMore — stabilises function reference so the observer useEffect does not re-run every render
64. Client-side pagination with slice() — all posts fetched once, visible state holds current batch
65. Search and category filters applied sequentially on allPosts — page and visible reset on every filter change

---

_Last Updated: Day 17 Complete — May 7, 2026_
