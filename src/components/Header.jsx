import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/ekenobizi_voice_logo.png";

export default function Header() {
  const { user, profile, signOut, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-charcoal text-white">
      <div className="max-w-6xl mx-auto px-4 py-3">
        {/* Top row: logo + auth buttons */}
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="Ekenobizi Voice" className="h-12 sm:h-20" />
            <span className="hidden sm:block font-playfair text-xl font-bold">
              Ekenobizi Voice
            </span>
          </Link>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-xs sm:text-sm font-semibold text-white hover:text-accent transition-colors truncate max-w-[120px] sm:max-w-none"
                >
                  @{profile?.username || user.email}
                </Link>
                <button
                  onClick={signOut}
                  className="border border-gray-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm hover:border-white transition-colors whitespace-nowrap"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs sm:text-sm hover:text-accent transition-colors whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-red-900 transition-colors whitespace-nowrap"
                >
                  <span className="sm:hidden">Join</span>
                  <span className="hidden sm:inline">Join Community</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Bottom row: nav links */}
        <nav className="flex items-center gap-4 sm:gap-6 text-sm mt-2 border-t border-white/10 pt-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-accent border-b-2 border-accent pb-0.5 text-xs sm:text-sm"
                : "hover:text-accent transition-colors text-xs sm:text-sm"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-accent border-b-2 border-accent pb-0.5 text-xs sm:text-sm"
                : "hover:text-accent transition-colors text-xs sm:text-sm"
            }
          >
            About
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/create-post"
              className={({ isActive }) =>
                isActive
                  ? "text-accent border-b-2 border-accent pb-0.5 text-xs sm:text-sm"
                  : "hover:text-accent transition-colors text-xs sm:text-sm"
              }
            >
              ✍️ Write
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive
                  ? "text-accent border-b-2 border-accent pb-0.5 text-xs sm:text-sm"
                  : "hover:text-accent transition-colors text-xs sm:text-sm"
              }
            >
              ⚙️ Admin
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
