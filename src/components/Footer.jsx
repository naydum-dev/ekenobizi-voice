import { Link } from "react-router-dom";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";

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

export default function Footer() {
  return (
    <footer className="bg-charcoal text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h3
            className="text-white text-xl font-bold mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ekenobizi <span className="text-primary">Voice</span>
          </h3>
          <p className="text-sm leading-relaxed">
            Stories, news, and voices from the heart of Ekenobizi, Umuahia —
            written by the community, for the community.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">
            Navigate
          </h4>
          <ul className="space-y-2 text-sm">
            {["Home", "Stories", "Community", "About"].map((item) => (
              <li key={item}>
                <Link
                  to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                  className="hover:text-accent transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Community */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">
            Community
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/register"
                className="hover:text-accent transition-colors"
              >
                Join the Platform
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-accent transition-colors">
                Sign In
              </Link>
            </li>
            <li>
              <a
                href="mailto:hello@ekenobizivoice.ng"
                className="hover:text-accent transition-colors"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">
            Follow Us
          </h4>
          <div className="flex flex-col gap-3">
            {SOCIAL_LINKS.map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm hover:text-accent transition-colors group"
              >
                <span className="text-gray-400 group-hover:text-accent transition-colors">
                  {icon}
                </span>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-5 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} Ekenobizi Voice. Built with pride in
        Umuahia.
      </div>
    </footer>
  );
}
