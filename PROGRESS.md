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
- **Hero Image:** `src/assets/hero.jpg` — real community meeting photo used as hero background on Home page.

---

## FOLDER STRUCTURE

```
ekenobizi-voice/
├── public/
├── src/
│   ├── assets/
│   │   ├── ekenobizi_voice_logo.png
│   │   └── hero.jpg
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

-- Anyone can read profiles
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

## COMMENT COMPONENT (`src/components/Comment.jsx`)

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
      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        {initial}
      </div>
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

- **Two-row layout:** Logo + auth buttons on top row, nav links (Home, About) on bottom row
- **Logged out:** Shows "Sign In" link + "Join Community" button → `/register`
- **Logged in:** Shows `@username` → `/profile` + "Sign Out" button
- Auth state read from `useAuth()` context
- Responsive — nav links sit below logo on all screen sizes so nothing gets squished

---

## AUTHENTICATION FLOW

### Registration

1. User fills out form (full name, username, email, password, confirm password)
2. Client-side validation runs
3. `supabase.auth.signUp()` called with email, password, and metadata
4. Supabase sends confirmation email
5. Database trigger fires → creates `profiles` row automatically
6. User sees "Check Your Email" success screen

### Login

1. `supabase.auth.signInWithPassword()` called
2. On success → redirected to `/`
3. `onAuthStateChange` fires → `AuthContext` updates `user` state globally
4. Session persists on page refresh

### Logout

1. `supabase.auth.signOut()` called via `signOut` from `useAuth()`
2. `user` set to `null`, header reverts to logged-out state

### Forgot Password

1. `supabase.auth.resetPasswordForEmail()` with `redirectTo: http://localhost:5173/reset-password`
2. User clicks link → `/reset-password`
3. `supabase.auth.updateUser({ password })` called
4. Redirected to `/login` after 2 seconds

---

## PAGES BUILT

| Page            | Path               | File                           | Status                     |
| --------------- | ------------------ | ------------------------------ | -------------------------- |
| Home            | `/`                | `src/pages/Home.jsx`           | ✅ Hero image + animations |
| Post            | `/post/:id`        | `src/pages/PostPage.jsx`       | ✅ Comments working        |
| About           | `/about`           | `src/pages/About.jsx`          | 🔲 Empty placeholder       |
| Register        | `/register`        | `src/pages/Register.jsx`       | ✅ Built & wired           |
| Login           | `/login`           | `src/pages/Login.jsx`          | ✅ Built & wired           |
| Profile         | `/profile`         | `src/pages/Profile.jsx`        | ✅ Built & wired           |
| Forgot Password | `/forgot-password` | `src/pages/ForgotPassword.jsx` | ✅ Built & wired           |
| Reset Password  | `/reset-password`  | `src/pages/ResetPassword.jsx`  | ✅ Built & wired           |

---

## COMPONENTS BUILT

| Component      | File                                | Purpose                            |
| -------------- | ----------------------------------- | ---------------------------------- |
| Header         | `src/components/Header.jsx`         | Two-row responsive nav, auth-aware |
| Footer         | `src/components/Footer.jsx`         | 3-column, dynamic copyright year   |
| PostCard       | `src/components/PostCard.jsx`       | Reusable post preview card         |
| Comment        | `src/components/Comment.jsx`        | Reusable single comment display    |
| ProtectedRoute | `src/components/ProtectedRoute.jsx` | Guards private routes              |

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
```

---

## CONCEPTS LEARNED

### Day 1

- Vite vs Create React App, JSX syntax, Tailwind utility classes, Git basics, LF vs CRLF

### Day 2

- Supabase, PostgreSQL, table relationships, UUID, RLS, environment variables, ON DELETE CASCADE

### Day 3

- Tailwind v4 `@theme` block, React Router, NavLink active state, component composition

### Day 4

- Supabase Auth (`signUp`), controlled components, form validation, async/await, DB triggers, RLS

### Day 5

- React Context API, `useContext`, custom hooks (`useAuth`), session persistence, protected routes

### Day 6

- Fetching/updating user data, edit/display mode toggling, multi-page auth flows, `useNavigate`

### Day 7

- `useEffect` data fetching, three-state async pattern, Supabase joins, `useParams`, `.single()`, RLS on joined data

### Day 8

- Multiple `useEffect` hooks for independent fetches
- Extracting functions outside `useEffect` so they can be called from multiple places
- Re-fetching after a mutation to keep UI in sync
- Conditional rendering based on auth state
- RLS policies for SELECT and INSERT on the same table
- Missing RLS policies fail silently — empty results, no error
- CSS `@keyframes` animations — more reliable than toggling React state for load animations
- `animation: slideUp 700ms ease-out both` — `both` fills start state before animation plays
- Hero background image via inline `backgroundImage` style + dark overlay for readability
- Two-row header layout for responsive nav on small screens

---

## CURRENT PROJECT STATE

**Status:** ✅ Days 1–8 Complete
**Dev Server:** `npm run dev` → `http://localhost:5173`
**Auth:** Registration + Login + Logout + Session persistence + Password reset all working
**Profiles:** Users can view and edit their username and full name
**Posts:** Home page displays live posts from Supabase. Single post view at `/post/:id` working.
**Comments:** Display on post pages. Authenticated users can post. Logged-out users see "Sign in" prompt.
**Landing Page:** Real community photo as hero background, slide-up animations on load.
**Header:** Responsive two-row layout — works cleanly on small screens.
**Database:** 3 tables live (profiles, posts, comments). Trigger + RLS policies active.
**Seed Data:** 3 published posts + 2 seeded comments.

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
- Claude writes files, developer replaces them
- Share existing files before updates
- One instruction / one file at a time

**Key Decisions Made:**

1. Vite with `@tailwindcss/vite` plugin (Tailwind v4 method)
2. `@theme` block in `index.css` for custom design tokens
3. SQL Editor used for all schema changes
4. All IDs use `uuid`
5. ON DELETE CASCADE on all foreign keys
6. Playfair Display for headings — editorial feel
7. Git Bash as terminal (`touch` not `New-Item`)
8. Email confirmation left enabled
9. `AuthProvider` wraps entire app at root level
10. `onAuthStateChange` for real-time auth sync
11. Profile page reads from `profiles` table (source of truth)
12. `category` and `excerpt` as proper DB columns
13. Public RLS policy on `profiles` allows author join on post queries
14. Home page uses featured post + sidebar layout
15. `fetchComments` extracted outside `useEffect` so it can be called after insert
16. RLS policies must be added per table — missing policies fail silently
17. CSS `@keyframes` used for hero animations (more reliable than React state toggling)
18. Hero image imported as JS module, set via inline `backgroundImage` style
19. Header split into two rows for clean responsive layout on small screens

---

_Last Updated: Day 8 Complete — Mar 30, 2026_
