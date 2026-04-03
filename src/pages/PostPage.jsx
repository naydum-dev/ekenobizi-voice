import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";
import Comment from "../components/Comment";

export default function PostPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);

  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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

  useEffect(() => {
    fetchComments();
  }, [id]);

  async function fetchComments() {
    const { data, error } = await supabase
      .from("comments")
      .select("*, profiles(username)")
      .eq("post_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      setCommentsError("Could not load comments.");
    } else {
      setComments(data);
    }
    setCommentsLoading(false);
  }

  async function handleSubmitComment() {
    if (!newComment.trim()) return;

    setSubmitting(true);
    setSubmitError(null);

    const { error } = await supabase.from("comments").insert({
      post_id: id,
      author_id: user.id,
      content: newComment.trim(),
    });

    if (error) {
      setSubmitError("Could not post comment. Please try again.");
    } else {
      setNewComment("");
      await fetchComments();
    }

    setSubmitting(false);
  }

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

  async function handleDeleteComment(commentId) {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (!error) {
      await fetchComments();
    }
  }

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

        {/* ── COMMENTS ── */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm mt-8">
          <h2
            className="text-2xl font-bold text-charcoal mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Comments
            {!commentsLoading && (
              <span className="text-gray-400 font-normal text-lg ml-2">
                ({comments.length})
              </span>
            )}
          </h2>

          {commentsLoading && (
            <p className="text-gray-400 text-sm">Loading comments...</p>
          )}

          {commentsError && (
            <p className="text-red-400 text-sm">{commentsError}</p>
          )}

          {!commentsLoading && !commentsError && comments.length === 0 && (
            <p className="text-gray-400 text-sm italic">
              No comments yet. Be the first to share your thoughts.
            </p>
          )}

          {!commentsLoading && !commentsError && comments.length > 0 && (
            <div className="flex flex-col gap-6 mb-8">
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  currentUserId={user?.id}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          )}

          {/* ── COMMENT FORM ── */}
          {user ? (
            <div className="border-t border-gray-100 pt-6 mt-6">
              <h3 className="text-sm font-semibold text-charcoal mb-3">
                Leave a comment
              </h3>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              {submitError && (
                <p className="text-red-400 text-xs mt-2">{submitError}</p>
              )}
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleSubmitComment}
                  disabled={submitting || !newComment.trim()}
                  className="bg-primary hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2 rounded-full transition-all duration-200"
                >
                  {submitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-gray-100 pt-6 mt-6 text-center">
              <p className="text-gray-500 text-sm">
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Sign in
                </Link>{" "}
                to join the conversation.
              </p>
            </div>
          )}
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
