import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(username)")
        .eq("id", id)
        .eq("published", true)
        .single();

      if (error) {
        setError("Post not found or is no longer available.");
      } else {
        setPost(data);
      }
      setLoading(false);
    }

    fetchPost();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading story...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center flex-col gap-4">
        <p className="text-red-500 text-lg">{error}</p>
        <Link to="/" className="text-primary font-semibold hover:underline">
          ← Back to Home
        </Link>
      </div>
    );

  const date = new Date(post.created_at).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-cream">
      {/* ── HERO ── */}
      <div className="bg-charcoal text-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="text-accent text-sm font-semibold hover:underline mb-6 inline-block"
          >
            ← Back to Stories
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {post.category}
            </span>
          </div>
          <h1
            className="text-3xl md:text-5xl font-bold leading-tight mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {post.title}
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
              {post.profiles.username[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-white">
                {post.profiles.username}
              </p>
              <p className="text-gray-400 text-sm">{date}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
          <p className="text-gray-600 text-lg leading-relaxed font-medium mb-8 border-l-4 border-primary pl-4">
            {post.excerpt}
          </p>
          <div className="text-charcoal leading-8 text-base whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-block bg-primary hover:bg-red-800 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200"
          >
            ← Back to Stories
          </Link>
        </div>
      </div>
    </div>
  );
}
