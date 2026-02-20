import { Link } from "react-router-dom";

// Placeholder posts — we replace this with real Supabase data on Day 4
const PLACEHOLDER_POSTS = [
  {
    id: 1,
    title: "The Revival of Ekenobizi Market: A New Dawn for Local Trade",
    excerpt:
      "Community leaders and traders gathered last week to discuss the future of our beloved market square, with promising plans for infrastructure and digital payment adoption.",
    author: "Chidinma Okafor",
    date: "Feb 18, 2026",
    category: "Economy",
    readTime: "4 min read",
  },
  {
    id: 2,
    title: "Youth Football Academy Opens Its Doors to Umuahia Talents",
    excerpt:
      "A new grassroots football initiative is giving young people from Ekenobizi and surrounding communities access to professional coaching and development pathways.",
    author: "Emeka Nwosu",
    date: "Feb 15, 2026",
    category: "Sports",
    readTime: "3 min read",
  },
  {
    id: 3,
    title:
      "How Our Grandmothers Kept Igbo Traditions Alive Through Storytelling",
    excerpt:
      "A tribute to the oral tradition that shaped generations — and a call to document these stories before they fade from living memory.",
    author: "Adaeze Eze",
    date: "Feb 12, 2026",
    category: "Culture",
    readTime: "6 min read",
  },
];

const categoryColors = {
  Economy: "bg-yellow-100 text-yellow-800",
  Sports: "bg-blue-100 text-blue-800",
  Culture: "bg-purple-100 text-purple-800",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      {/* ── HERO ── */}
      <section className="bg-charcoal text-white py-24 px-6 relative overflow-hidden">
        {/* Decorative accent bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-accent to-primary" />

        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Community · Culture · Truth
          </span>

          <h1
            className="text-4xl md:text-6xl font-bold leading-tight mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The Voice of <span className="text-accent">Ekenobizi</span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Real stories. Local voices. Community-driven journalism from the
            heart of Umuahia — written by people who call Ekenobizi home.
          </p>

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

        {/* Featured post (first card — bigger) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <article className="lg:col-span-2 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
            {/* Color placeholder for image */}
            <div className="h-64 bg-linear-to-br from-primary to-red-900 flex items-center justify-center">
              <span
                className="text-white/20 text-6xl font-bold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                EV
              </span>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[PLACEHOLDER_POSTS[0].category]}`}
                >
                  {PLACEHOLDER_POSTS[0].category}
                </span>
                <span className="text-gray-400 text-xs">
                  {PLACEHOLDER_POSTS[0].readTime}
                </span>
              </div>
              <h3
                className="text-2xl font-bold text-charcoal mb-3 group-hover:text-primary transition-colors leading-snug"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {PLACEHOLDER_POSTS[0].title}
              </h3>
              <p className="text-gray-500 leading-relaxed mb-6">
                {PLACEHOLDER_POSTS[0].excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
                    {PLACEHOLDER_POSTS[0].author[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">
                      {PLACEHOLDER_POSTS[0].author}
                    </p>
                    <p className="text-xs text-gray-400">
                      {PLACEHOLDER_POSTS[0].date}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/post/${PLACEHOLDER_POSTS[0].id}`}
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </article>

          {/* Sidebar posts */}
          <div className="flex flex-col gap-6">
            {PLACEHOLDER_POSTS.slice(1).map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[post.category]}`}
                    >
                      {post.category}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {post.readTime}
                    </span>
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
                      {post.author[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-charcoal">
                        {post.author}
                      </p>
                      <p className="text-xs text-gray-400">{post.date}</p>
                    </div>
                  </div>
                  <Link
                    to={`/post/${post.id}`}
                    className="text-primary text-xs font-semibold hover:underline"
                  >
                    Read →
                  </Link>
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
