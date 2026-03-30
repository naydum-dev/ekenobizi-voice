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
- **Logo:** `src/assets/ekenobizi_voice_logo.png` — transparent background PNG (processed via remove.bg). Raised fist holding megaphone with olive branch. Displayed at `h-20` in Header.

---

## FOLDER STRUCTURE

```
ekenobizi-voice/
├── public/
├── src/
│   ├── assets/
│   │   └── ekenobizi_voice_logo.png
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
│   │   ├── ForgotPassword.jsx
│   │   └── ResetPassword.jsx
│   ├── services/
│   │   └── supabase.js
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── .env.local          ← API keys (not tracked by Git)
├── .gitignore
└── package.json
```

---

## DEPENDENCIES INSTALLED

```json
{
  "tailwindcss": "latest",
  "@tailwindcss/vite": "latest",
  "react-router-dom": "latest",
  "@supabase/supabase-js": "latest"
}
```

---

## KEY FILE CONTENTS

### `vite.config.js`

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### `src/index.css`

```css
@import "tailwindcss";

@theme {
  --color-primary: #942023;
  --color-accent: #769c61;
  --color-charcoal: #020202;
  --color-cream: #e5e6ea;
  --font-playfair: "Playfair Display", serif;
}
```

### `index.html` (Google Fonts)

```html
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

### `src/services/supabase.js`

```js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### `.env.local`

```
VITE_SUPABASE_URL=your_project_url
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

All foreign keys use **ON DELETE CASCADE** — deleting a user removes their profile, posts, and comments automatically.

---

## DATABASE TRIGGER

Auto-creates a `profiles` row whenever a new user signs up via Supabase Auth:

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
-- Anyone can read published posts
CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT
  USING (published = true);

-- Anyone can read profiles (needed for author join on post pages)
CREATE POLICY "Public can read profiles"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger function can insert profiles on signup
CREATE POLICY "Service can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Anyone can read comments
CREATE POLICY "Public can read comments"
  ON comments FOR SELECT
  USING (true);

-- Authenticated users can insert their own comments
CREATE POLICY "Authenticated users can insert comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);
```

---

## ROUTING (`src/App.jsx`)

```jsx
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import About from "./pages/About";
import Profile from "./pages/Profile";
import PostPage from "./pages/PostPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main>
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
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
```

---

## AUTH CONTEXT (`src/contexts/AuthContext.jsx`)

Global auth state accessible by any component via `useAuth()` hook.

```jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signOut: () => supabase.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

---

## PROTECTED ROUTE (`src/components/ProtectedRoute.jsx`)

Redirects unauthenticated users to `/login`.

```jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
```

---

## POSTCARD COMPONENT (`src/components/PostCard.jsx`)

Reusable card for displaying post previews. Receives a `post` object as a prop.

```jsx
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  const excerpt = post.content.substring(0, 180) + "...";
  const date = new Date(post.created_at).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <p className="text-xs text-accent font-semibold uppercase tracking-wide">
        Community
      </p>
      <h2 className="font-playfair text-xl font-bold text-charcoal leading-snug">
        {post.title}
      </h2>
      <p className="text-gray-600 text-sm leading-relaxed">{excerpt}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-400">{date}</span>
        <Link
          to={`/post/${post.id}`}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}
```

---

## COMMENT COMPONENT (`src/components/Comment.jsx`)

Reusable component for displaying a single comment. Receives a `comment` object as a prop.

```jsx
export default function Comment({ comment }) {
  const date = new Date(comment.created_at).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const initial = comment.profiles.username[0].toUpperCase();

  return (
    <div className="flex gap-4">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        {initial}
      </div>

      {/* Body */}
      <div className="flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-semibold text-charcoal text-sm">
            @{comment.profiles.username}
          </span>
          <span className="text-gray-400 text-xs">{date}</span>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
```

---

## HEADER BEHAVIOUR

- **Logged out:** Shows "Sign In" link + "Join Community" button → `/register`
- **Logged in:** Shows `@username` as a clickable `<Link>` → `/profile` + "Sign Out" button
- Auth state read from `useAuth()` context

---

## AUTHENTICATION FLOW

### Registration

1. User fills out form (full name, username, email, password, confirm password)
2. Client-side validation runs (password match, length, username rules)
3. `supabase.auth.signUp()` called with email, password, and metadata (username, full_name)
4. Supabase sends confirmation email
5. Database trigger fires → creates `profiles` row automatically
6. User sees "Check Your Email" success screen
7. User clicks email link → account activated

### Login

1. User enters email + password
2. `supabase.auth.signInWithPassword()` called
3. On success → redirected to `/`
4. `onAuthStateChange` fires → `AuthContext` updates `user` state globally
5. Header updates to show `@username` link + Sign Out button
6. Session persists on page refresh (Supabase stores token in localStorage)

### Logout

1. User clicks "Sign Out" in Header
2. `supabase.auth.signOut()` called (exposed via `signOut` from `useAuth()`)
3. `onAuthStateChange` fires → `user` set to `null`
4. Header reverts to Sign In + Join Community

### Forgot Password

1. User clicks "Forgot password?" on Login page → `/forgot-password`
2. Enters email → `supabase.auth.resetPasswordForEmail()` called with `redirectTo: http://localhost:5173/reset-password`
3. Supabase sends reset email
4. User clicks link → lands on `/reset-password`
5. Enters new password → `supabase.auth.updateUser({ password })` called
6. On success → redirected to `/login` after 2 seconds

---

## PAGES BUILT

| Page            | Path               | File                           | Status                |
| --------------- | ------------------ | ------------------------------ | --------------------- |
| Home            | `/`                | `src/pages/Home.jsx`           | ✅ Live Supabase data |
| Post            | `/post/:id`        | `src/pages/PostPage.jsx`       | ✅ Comments working   |
| About           | `/about`           | `src/pages/About.jsx`          | 🔲 Empty placeholder  |
| Register        | `/register`        | `src/pages/Register.jsx`       | ✅ Built & wired      |
| Login           | `/login`           | `src/pages/Login.jsx`          | ✅ Built & wired      |
| Profile         | `/profile`         | `src/pages/Profile.jsx`        | ✅ Built & wired      |
| Forgot Password | `/forgot-password` | `src/pages/ForgotPassword.jsx` | ✅ Built & wired      |
| Reset Password  | `/reset-password`  | `src/pages/ResetPassword.jsx`  | ✅ Built & wired      |

---

## COMPONENTS BUILT

| Component      | File                                | Purpose                              |
| -------------- | ----------------------------------- | ------------------------------------ |
| Header         | `src/components/Header.jsx`         | Sticky nav, logo, auth-aware buttons |
| Footer         | `src/components/Footer.jsx`         | 3-column, dynamic copyright year     |
| PostCard       | `src/components/PostCard.jsx`       | Reusable post preview card           |
| Comment        | `src/components/Comment.jsx`        | Reusable single comment display      |
| ProtectedRoute | `src/components/ProtectedRoute.jsx` | Guards private routes                |

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
```

---

## CONCEPTS LEARNED

### Day 1

- Vite vs Create React App
- JSX syntax
- Tailwind utility classes
- Git basics
- LF vs CRLF line endings (Windows)

### Day 2

- Supabase (backend-as-a-service)
- PostgreSQL relational databases
- Table relationships and foreign keys
- UUID vs integer IDs
- Row Level Security (deny by default)
- Environment variables and key security
- ON DELETE CASCADE

### Day 3

- Tailwind v4 `@theme` block for custom design tokens
- React Router (`BrowserRouter`, `Routes`, `Route`, `NavLink`, `Link`)
- `NavLink` active state with dynamic `className` function
- Component composition
- Asset preparation (remove.bg for background removal)

### Day 4

- Supabase Auth (`signUp`)
- Controlled components (`useState` + `onChange`)
- Form handling and validation
- `async/await` for async operations
- Database triggers (auto-create profile on signup)
- RLS policies

### Day 5

- React Context API (global state)
- `useContext` + `createContext`
- Custom hooks (`useAuth`)
- Session persistence (`onAuthStateChange`, `getSession`)
- Protected routes (redirect unauthenticated users)
- `supabase.auth.signInWithPassword()`
- `supabase.auth.signOut()`

### Day 6

- Fetching user-specific data with `.eq("id", user.id)` and `.single()`
- Updating Supabase rows with `.update()`
- Edit/display mode toggling with `useState`
- Multi-page auth flows (request → email → reset)
- `supabase.auth.resetPasswordForEmail()` for password reset emails
- `supabase.auth.updateUser({ password })` for updating password
- `useNavigate` + `setTimeout` for timed redirects after success
- First real use of `ProtectedRoute` component

### Day 7

- `useEffect` with `[]` — run once on mount for data fetching
- Three-state async pattern — `loading` / `error` / `data`
- Supabase joins — `.select("*, profiles(username)")` fetches related table in one query
- `useParams()` — reading dynamic values (`:id`) from the URL
- `.single()` — telling Supabase to return one row instead of an array
- RLS policies affecting joined data (public read policy needed on profiles)
- Why dedicated DB columns (`category`, `excerpt`) are better than deriving data in frontend
- Seeding real data via SQL Editor before building the UI

### Day 8

- Multiple `useEffect` hooks for independent data fetches
- Extracting a function outside `useEffect` so it can be called from multiple places
- Re-fetching after a mutation to keep UI in sync with the database
- Conditional rendering based on auth state (`user ? form : sign in prompt`)
- RLS policies for both SELECT and INSERT on the same table
- Every new table needs its own RLS policies — missing policies fail silently (empty results, no error)

---

## CURRENT PROJECT STATE

**Status:** ✅ Days 1–8 Complete
**Dev Server:** `npm run dev` → `http://localhost:5173`
**Auth:** Registration + Login + Logout + Session persistence + Password reset all working
**Profiles:** Users can view and edit their username and full name
**Posts:** Home page displays live posts from Supabase. Single post view at `/post/:id` working.
**Comments:** Comments display on post pages. Authenticated users can post comments. Logged-out users see a "Sign in" prompt.
**Database:** 3 tables live (profiles, posts, comments). Trigger + RLS policies active.
**Seed Data:** 3 published posts + 2 seeded comments inserted via SQL Editor.

---

## NEXT STEPS

### 📋 DAY 9 OPTIONS

**Option A: Delete own comments**

- Users can remove comments they posted
- Delete button visible only on own comments
- RLS delete policy on comments table

**Option B: Create Post page (Admin)**

- Build Create Post page (protected route)
- Rich text or markdown editor
- Save posts to Supabase
- Toggle published/draft status

**Option C: About page**

- Fill in the empty placeholder
- Community info, mission statement

---

## DEVELOPMENT NOTES

**Working Approach:**

- Learning-focused (explanations before code)
- Step-by-step guidance
- Understanding "why" behind each decision
- Terminal commands preferred for efficiency
- Developer executes, Claude directs and writes files
- Share existing files before updates — Claude works with what exists

**Key Decisions Made:**

1. Vite with `@tailwindcss/vite` plugin (Tailwind v4 method)
2. `@theme` block in `index.css` for custom design tokens
3. Comprehensive folder structure created upfront
4. SQL Editor used for all schema changes (more reliable than Supabase UI)
5. All IDs use `uuid` (consistent with Supabase Auth)
6. ON DELETE CASCADE on all foreign keys
7. Playfair Display for headings — editorial feel
8. Logo processed via remove.bg for transparent background
9. Git Bash as terminal (`touch` not `New-Item`)
10. Email confirmation left enabled (not disabled during dev)
11. `AuthProvider` wraps entire app at the root level
12. `onAuthStateChange` used for real-time auth sync across all components
13. Profile page reads from `profiles` table (source of truth) not just `user_metadata`
14. Password reset uses Supabase's built-in email flow with `redirectTo` pointing to `/reset-password`
15. `category` and `excerpt` added as proper DB columns — not derived in frontend
16. Public RLS policy on `profiles` allows author username to be joined on post queries
17. Home page uses featured post + sidebar layout (first post large, rest stacked)
18. `fetchComments` extracted outside `useEffect` so it can be called after comment insert
19. RLS policies must be added per table — missing policies fail silently with empty results

---

_Last Updated: Day 8 Complete — Mar 30, 2026_
