import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/ekenobizi_voice_logo.png";

export default function Header() {
  const { user, profile, signOut, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-charcoal text-white">
      <div className="max-w-6xl mx-auto px-4 py-3">
        {/* Top row: logo + auth buttons */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Ekenobizi Voice" className="h-20" />
            <span className="font-playfair text-xl font-bold">
              Ekenobizi Voice
            </span>
          </Link>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-sm font-semibold text-white hover:text-accent transition-colors"
                >
                  @{profile?.username || user.email}
                </Link>
                <button
                  onClick={signOut}
                  className="border border-gray-500 text-white px-4 py-2 rounded-full text-sm hover:border-white transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm hover:text-accent transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-900 transition-colors"
                >
                  Join Community
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Bottom row: nav links */}
        <nav className="flex items-center gap-6 text-sm mt-2 border-t border-white/10 pt-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-accent border-b-2 border-accent pb-0.5"
                : "hover:text-accent transition-colors"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-accent border-b-2 border-accent pb-0.5"
                : "hover:text-accent transition-colors"
            }
          >
            About
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/create-post"
              className={({ isActive }) =>
                isActive
                  ? "text-accent border-b-2 border-accent pb-0.5"
                  : "hover:text-accent transition-colors"
              }
            >
              ✍️ Write
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
