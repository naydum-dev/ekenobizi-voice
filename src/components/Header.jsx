import logo from "../assets/ekenobizi_voice_logo.png";
import { Link, NavLink } from "react-router-dom";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Stories", to: "/stories" },
  { label: "Community", to: "/community" },
  { label: "About", to: "/about" },
];

export default function Header() {
  return (
    <header className="bg-charcoal text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Ekenobizi Voice" className="h-20 w-auto" />
          <div className="flex flex-col leading-none">
            <span
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ekenobizi
              <span className="text-primary"> Voice</span>
            </span>
            <span className="text-xs text-gray-400 tracking-widest uppercase mt-0.5">
              Umuahia · Abia State
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-colors duration-200 ${
                  isActive
                    ? "text-accent border-b-2 border-accent pb-0.5"
                    : "text-gray-300 hover:text-white"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="bg-primary hover:bg-red-800 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors duration-200"
          >
            Join Community
          </Link>
        </div>
      </div>
    </header>
  );
}
