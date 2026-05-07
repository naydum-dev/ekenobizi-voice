import { Link } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "../services/supabase";
import SEO from "../components/SEO";
import { FiSearch } from "react-icons/fi";

const PAGE_SIZE = 9;

const categoryColors = {
  Economy: "bg-yellow-100 text-yellow-800",
  Sports: "bg-blue-100 text-blue-800",
  Culture: "bg-purple-100 text-purple-800",
  Community: "bg-red-100 text-red-800",
  Youth: "bg-green-100 text-green-800",
};

const categories = [
  "All",
  "Community",
  "Culture",
  "Economy",
  "Sports",
  "Youth",
];

export default function Stories() {
  const [allPosts, setAllPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [visible, setVisible] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sentinelRef = useRef(null);

  // Fetch all posts once
  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(username)")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        setError("Failed to load stories. Please try again.");
      } else {
        setAllPosts(data);
        setFiltered(data);
        setVisible(data.slice(0, PAGE_SIZE));
        setHasMore(data.length > PAGE_SIZE);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  // Re-filter when category or search changes
  useEffect(() => {
    let result = allPosts;

    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q),
      );
    }

    setFiltered(result);
    setPage(1);
    setVisible(result.slice(0, PAGE_SIZE));
    setHasMore(result.length > PAGE_SIZE);
  }, [activeCategory, searchQuery, allPosts]);

  // Load next page
  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const nextSlice = filtered.slice(0, nextPage * PAGE_SIZE);
    setVisible(nextSlice);
    setPage(nextPage);
    setHasMore(nextSlice.length < filtered.length);
  }, [page, filtered]);

  // IntersectionObserver on sentinel div
  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 },
    );
    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, loadMore]);

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

  return (
    <main className="min-h-screen bg-cream">
      <SEO
        title="Stories"
        description="Browse all stories published by the Ekenobizi Voice community — news, culture, economy, sports, and youth voices from Umuahia, Abia State."
        url="/stories"
      />

      {/* ── PAGE HEADER ── */}
      <section className="bg-charcoal px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">
            Archive
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            All Stories
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
            Every story published by the Ekenobizi Voice community — sorted by
            newest first.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories..."
              className="w-full pl-11 pr-10 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-accent focus:bg-white/15 transition-all duration-200 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── CATEGORY FILTER ── */}
      <section className="border-b border-gray-200 bg-white sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── POSTS GRID ── */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <p className="text-sm text-gray-400 mb-8">
          {filtered.length === 0
            ? "No stories found"
            : `${filtered.length} ${filtered.length === 1 ? "story" : "stories"}`}
          {activeCategory !== "All" && (
            <span>
              {" "}
              in{" "}
              <span className="text-charcoal font-semibold">
                {activeCategory}
              </span>
            </span>
          )}
          {searchQuery.trim() && (
            <span>
              {" "}
              matching{" "}
              <span className="text-charcoal font-semibold">
                &ldquo;{searchQuery}&rdquo;
              </span>
            </span>
          )}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg">
              {searchQuery
                ? `No stories found for "${searchQuery}".`
                : "No stories in this category yet."}
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
              className="mt-4 text-primary font-semibold hover:underline text-sm"
            >
              View all stories →
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group flex flex-col"
                >
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary to-red-900 flex items-center justify-center flex-shrink-0">
                      <span
                        className="text-white/20 text-5xl font-bold"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        EV
                      </span>
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          categoryColors[post.category] ??
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {post.category}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {new Date(post.created_at).toLocaleDateString("en-NG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <h2
                      className="text-lg font-bold text-charcoal mb-2 group-hover:text-primary transition-colors leading-snug"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {post.title}
                    </h2>

                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {post.profiles.username[0].toUpperCase()}
                        </div>
                        <p className="text-xs font-semibold text-charcoal">
                          {post.profiles.username}
                        </p>
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

            {/* Infinite scroll sentinel */}
            {hasMore && (
              <div ref={sentinelRef} className="py-10 flex justify-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* End of results message */}
            {!hasMore && visible.length >= PAGE_SIZE && (
              <p className="text-center text-gray-400 text-sm mt-10">
                You've reached the end —{" "}
                {filtered.length === 1
                  ? "1 story"
                  : `${filtered.length} stories`}{" "}
                total.
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}
