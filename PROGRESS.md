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
│   │   └── ProtectedRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Register.jsx
│   │   └── Login.jsx
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

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger function can insert profiles on signup
CREATE POLICY "Service can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);
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
            {/* Future protected routes go here: */}
            {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
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

**Usage in any component:**

```jsx
import { useAuth } from "../contexts/AuthContext";
const { user, signOut } = useAuth();
```

---

## PROTECTED ROUTE (`src/components/ProtectedRoute.jsx`)

Redirects unauthenticated users to `/login`. Ready for use — not yet applied to any routes (no protected pages built yet).

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

## HEADER BEHAVIOUR

- **Logged out:** Shows "Sign In" link + "Join Community" button → `/register`
- **Logged in:** Shows username (`user.user_metadata?.username`) + "Sign Out" button
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
5. Header updates to show username + Sign Out button
6. Session persists on page refresh (Supabase stores token in localStorage)

### Logout

1. User clicks "Sign Out" in Header
2. `supabase.auth.signOut()` called (exposed via `signOut` from `useAuth()`)
3. `onAuthStateChange` fires → `user` set to `null`
4. Header reverts to Sign In + Join Community

---

## PAGES BUILT

| Page     | Path        | File                     | Status                      |
| -------- | ----------- | ------------------------ | --------------------------- |
| Home     | `/`         | `src/pages/Home.jsx`     | ✅ Built (placeholder data) |
| About    | `/about`    | `src/pages/About.jsx`    | 🔲 Empty placeholder        |
| Register | `/register` | `src/pages/Register.jsx` | ✅ Built & wired            |
| Login    | `/login`    | `src/pages/Login.jsx`    | ✅ Built & wired            |

---

## COMPONENTS BUILT

| Component      | File                                | Purpose                                     |
| -------------- | ----------------------------------- | ------------------------------------------- |
| Header         | `src/components/Header.jsx`         | Sticky nav, logo, auth-aware buttons        |
| Footer         | `src/components/Footer.jsx`         | 3-column, dynamic copyright year            |
| ProtectedRoute | `src/components/ProtectedRoute.jsx` | Guards private routes (ready, not yet used) |

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

---

## CURRENT PROJECT STATE

**Status:** ✅ Days 1–5 Complete
**Dev Server:** `npm run dev` → `http://localhost:5173`
**Auth:** Registration + Login + Logout + Session persistence all working
**Database:** 3 tables live (profiles, posts, comments). Trigger + RLS policies active.
**Pending:** Email confirmation testing (Supabase free tier rate limit — test when cleared)

---

## NEXT STEPS

### 📋 DAY 6: Blog Posts — Reading

**Goals:**

- Connect Home page to real Supabase data (replace placeholder posts)
- Build individual Post page (`/post/:id`)
- Fetch and display post content
- Query only published posts

**Estimated Time:** 2 – 2.5 hours

---

### 📋 DAY 7: Blog Posts — Writing (Admin)

**Goals:**

- Build Create Post page (protected route)
- Rich text or markdown editor
- Save posts to Supabase
- Toggle published/draft status

---

### 📋 DAY 8: Comments System

**Goals:**

- Display comments on post page
- Allow authenticated users to add comments
- Delete own comments

---

## DEVELOPMENT NOTES

**Working Approach:**

- Learning-focused (explanations before code)
- Step-by-step guidance
- Understanding "why" behind each decision
- Terminal commands preferred for efficiency
- Developer executes, Claude directs

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

---

_Last Updated: Day 5 Complete — Feb 23, 2026_
