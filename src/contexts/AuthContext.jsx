import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

// 1. Create the context object
const AuthContext = createContext(null);

// 2. Create the Provider — wraps the whole app and shares user state
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if a session already exists (e.g. page refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes — login, logout, token refresh
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup listener when component unmounts
    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signOut: () => supabase.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render children until we know auth state */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook — makes consuming context clean and simple
export function useAuth() {
  return useContext(AuthContext);
}
