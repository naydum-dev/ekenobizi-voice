import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/ekenobizi_voice_logo.png";

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-charcoal text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Ekenobizi Voice" className="h-20" />
          <span className="font-playfair text-xl font-bold">
            Ekenobizi Voice
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6 text-sm">
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
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            // Logged in state
            <>
              <Link
                to="/profile"
                className="text-sm font-semibold text-white hover:text-accent transition-colors"
              >
                @{user.user_metadata?.username || user.email}
              </Link>
              <button
                onClick={signOut}
                className="border border-gray-500 text-white px-4 py-2 rounded-full text-sm hover:border-white transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            // Logged out state
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
    </header>
  );
}
