import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import heroImage from "../assets/hero.jpg";

const categoryColors = {
  Economy: "bg-yellow-100 text-yellow-800",
  Sports: "bg-blue-100 text-blue-800",
  Culture: "bg-purple-100 text-purple-800",
  Community: "bg-red-100 text-red-800",
  Youth: "bg-green-100 text-green-800",
};

function animate(delay) {
  return {
    animation: `slideUp 700ms ease-out both`,
    animationDelay: `${delay}ms`,
  };
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(username)")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        setError("Failed to load posts. Please try again.");
      } else {
        setPosts(data);
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading stories...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  if (posts.length === 0)
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          No stories yet. Check back soon.
        </p>
      </div>
    );

  return (
    <main className="min-h-screen bg-cream">
      {/* ── HERO ── */}
      <section
        className="relative text-white py-24 px-6 overflow-hidden min-h-[600px] flex items-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/65" />

        {/* Accent bar */}
        <div
          className="absolute top-0 left-0 w-full h-1 z-10"
          style={{
            background: "linear-gradient(to right, #942023, #769c61, #942023)",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
          <div style={animate(0)}>
            <span className="inline-block bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              Community · Culture · Truth
            </span>
          </div>

          <div style={animate(150)}>
            <h1
              className="text-4xl md:text-6xl font-bold leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              The Voice of <span className="text-accent">Ekenobizi</span>
            </h1>
          </div>

          <div style={animate(300)}>
            <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
              Real stories. Local voices. Community-driven journalism from the
              heart of Umuahia — written by people who call Ekenobizi home.
            </p>
          </div>

          <div style={animate(450)}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/stories"
                className="bg-primary hover:bg-red-800 text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200 hover:scale-105"
              >
                Read Stories
              </Link>
              <Link
                to="/signup"
                className="border border-accent text-accent hover:bg-accent hover:text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200"
              >
                Share Your Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── LATEST STORIES ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-1">
              From the Community
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-charcoal"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Latest Stories
            </h2>
          </div>
          <Link
            to="/stories"
            className="text-sm font-semibold text-primary hover:text-red-800 transition-colors hidden sm:block"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Featured post (first post) ── */}
          <article className="lg:col-span-2 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
            {/* Image or placeholder */}
            {posts[0].image_url ? (
              <img
                src={posts[0].image_url}
                alt={posts[0].title}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="h-64 bg-linear-to-br from-primary to-red-900 flex items-center justify-center">
                <span
                  className="text-white/20 text-6xl font-bold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  EV
                </span>
              </div>
            )}

            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[posts[0].category]}`}
                >
                  {posts[0].category}
                </span>
                <span className="text-gray-400 text-xs">4 min read</span>
              </div>
              <h3
                className="text-2xl font-bold text-charcoal mb-3 group-hover:text-primary transition-colors leading-snug"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {posts[0].title}
              </h3>
              <p className="text-gray-500 leading-relaxed mb-6">
                {posts[0].excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
                    {posts[0].profiles.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">
                      {posts[0].profiles.username}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(posts[0].created_at).toLocaleDateString(
                        "en-NG",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/post/${posts[0].id}`}
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </article>

          {/* ── Sidebar posts ── */}
          <div className="flex flex-col gap-6">
            {posts.slice(1).map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group flex flex-col"
              >
                {/* Image — only if available */}
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-36 object-cover"
                  />
                )}

                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[post.category]}`}
                      >
                        {post.category}
                      </span>
                      <span className="text-gray-400 text-xs">3 min read</span>
                    </div>
                    <h3
                      className="text-lg font-bold text-charcoal mb-2 group-hover:text-primary transition-colors leading-snug"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                        {post.profiles.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-charcoal">
                          {post.profiles.username}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(post.created_at).toLocaleDateString(
                            "en-NG",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/post/${post.id}`}
                      className="text-primary text-xs font-semibold hover:underline"
                    >
                      Read →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY CTA ── */}
      <section className="bg-charcoal py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Have a story to tell?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join the Ekenobizi Voice community and share what matters to you —
            local news, culture, opinion, or personal stories.
          </p>
          <Link
            to="/signup"
            className="bg-accent hover:bg-green-700 text-white font-bold px-10 py-4 rounded-full text-lg transition-all duration-200 hover:scale-105 inline-block"
          >
            Join Free Today
          </Link>
        </div>
      </section>
    </main>
  );
}
