import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    comments: 0,
    submissions: 0,
  });
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("stats");

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
      navigate("/");
      return;
    }
    fetchAll();
  }, [authLoading, isAdmin]);

  async function fetchAll() {
    setLoading(true);
    setError(null);

    try {
      const [
        { count: userCount },
        { count: postCount },
        { count: commentCount },
        { count: submissionCount },
        { data: usersData, error: usersError },
        { data: commentsData, error: commentsError },
        { data: submissionsData, error: submissionsError },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("comments").select("*", { count: "exact", head: true }),
        supabase
          .from("submissions")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("comments")
          .select("*, profiles(username), posts(title)")
          .order("created_at", { ascending: false }),
        supabase
          .from("submissions")
          .select("*, profiles(username)")
          .order("created_at", { ascending: false }),
      ]);

      if (usersError) throw usersError;
      if (commentsError) throw commentsError;
      if (submissionsError) throw submissionsError;

      setStats({
        users: userCount || 0,
        posts: postCount || 0,
        comments: commentCount || 0,
        submissions: submissionCount || 0,
      });
      setUsers(usersData || []);
      setComments(commentsData || []);
      setSubmissions(submissionsData || []);
    } catch (err) {
      setError("Failed to load dashboard data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteComment(commentId) {
    if (!window.confirm("Delete this comment? This cannot be undone.")) return;

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      alert("Failed to delete comment.");
      console.error(error);
      return;
    }

    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setStats((prev) => ({ ...prev, comments: prev.comments - 1 }));
  }

  async function handleApprove(submission) {
    if (!window.confirm(`Approve and publish "${submission.title}"?`)) return;

    // Insert into posts as published
    const { error: insertError } = await supabase.from("posts").insert({
      title: submission.title,
      excerpt: submission.excerpt,
      content: submission.content,
      category: submission.category,
      author_id: submission.author_id,
      published: true,
    });

    if (insertError) {
      alert("Failed to publish story. Please try again.");
      console.error(insertError);
      return;
    }

    // Mark submission as approved
    const { error: updateError } = await supabase
      .from("submissions")
      .update({ status: "approved" })
      .eq("id", submission.id);

    if (updateError) {
      alert("Story published but failed to update submission status.");
      console.error(updateError);
      return;
    }

    // Update local state
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submission.id ? { ...s, status: "approved" } : s,
      ),
    );
    setStats((prev) => ({
      ...prev,
      posts: prev.posts + 1,
      submissions: Math.max(prev.submissions - 1, 0),
    }));
  }

  async function handleDismiss(submission) {
    if (
      !window.confirm(`Dismiss "${submission.title}"? This cannot be undone.`)
    )
      return;

    const { error } = await supabase
      .from("submissions")
      .update({ status: "dismissed" })
      .eq("id", submission.id);

    if (error) {
      alert("Failed to dismiss submission.");
      console.error(error);
      return;
    }

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submission.id ? { ...s, status: "dismissed" } : s,
      ),
    );
    setStats((prev) => ({
      ...prev,
      submissions: Math.max(prev.submissions - 1, 0),
    }));
  }

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.username?.toLowerCase().includes(q) ||
      u.full_name?.toLowerCase().includes(q)
    );
  });

  const pendingSubmissions = submissions.filter((s) => s.status === "pending");
  const resolvedSubmissions = submissions.filter((s) => s.status !== "pending");

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-charcoal">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="font-playfair text-4xl font-bold text-primary mb-2">
            Admin Dashboard
          </h1>
          <p className="text-charcoal/60">Manage your community platform</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Members", value: stats.users },
            { label: "Total Posts", value: stats.posts },
            { label: "Total Comments", value: stats.comments },
            { label: "Pending Submissions", value: stats.submissions },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-6 shadow-sm border border-charcoal/10"
            >
              <p className="text-charcoal/50 text-sm uppercase tracking-wide mb-1">
                {stat.label}
              </p>
              <p className="font-playfair text-5xl font-bold text-primary">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-charcoal/10 overflow-x-auto">
          {["users", "comments", "submissions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-5 py-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-charcoal/50 hover:text-charcoal"
              }`}
            >
              {tab === "users" && `Members (${stats.users})`}
              {tab === "comments" && `Comments (${stats.comments})`}
              {tab === "submissions" && (
                <span className="flex items-center gap-2">
                  Submissions
                  {stats.submissions > 0 && (
                    <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {stats.submissions}
                    </span>
                  )}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <input
              type="text"
              placeholder="Search by username or full name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 px-4 py-2 rounded-lg border border-charcoal/20 bg-white text-charcoal text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <div className="bg-white rounded-2xl shadow-sm border border-charcoal/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-charcoal/5 text-charcoal/50 uppercase text-xs tracking-wide">
                  <tr>
                    <th className="text-left px-6 py-3">Username</th>
                    <th className="text-left px-6 py-3">Full Name</th>
                    <th className="text-left px-6 py-3">Role</th>
                    <th className="text-left px-6 py-3">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/5">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-charcoal/40"
                      >
                        No members found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-cream/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-charcoal">
                          {u.username}
                        </td>
                        <td className="px-6 py-4 text-charcoal/60">
                          {u.full_name || "—"}
                        </td>
                        <td className="px-6 py-4">
                          {u.is_admin ? (
                            <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
                              Admin
                            </span>
                          ) : (
                            <span className="bg-charcoal/10 text-charcoal/50 text-xs font-semibold px-2 py-1 rounded-full">
                              Member
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-charcoal/40 text-xs">
                          {new Date(u.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === "comments" && (
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-charcoal/40 text-center py-12">
                No comments yet.
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-charcoal/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-charcoal text-sm mb-2">
                        {comment.content}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-charcoal/40">
                        <span>
                          By{" "}
                          <span className="text-charcoal/60 font-medium">
                            {comment.profiles?.username || "Unknown"}
                          </span>
                        </span>
                        <span>
                          On{" "}
                          <span className="text-charcoal/60 font-medium">
                            {comment.posts?.title || "Unknown post"}
                          </span>
                        </span>
                        <span>
                          {new Date(comment.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="shrink-0 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === "submissions" && (
          <div className="space-y-8">
            {/* Pending */}
            <div>
              <h2 className="text-sm font-semibold text-charcoal uppercase tracking-widest mb-4">
                Pending ({pendingSubmissions.length})
              </h2>
              {pendingSubmissions.length === 0 ? (
                <p className="text-charcoal/40 text-center py-12">
                  No pending submissions.
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingSubmissions.map((s) => (
                    <div
                      key={s.id}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-charcoal/10"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                              {s.category}
                            </span>
                            <span className="text-xs text-charcoal/40">
                              {new Date(s.created_at).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                          <h3
                            className="text-lg font-bold text-charcoal mb-1"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                          >
                            {s.title}
                          </h3>
                          <p className="text-xs text-charcoal/50 mb-3">
                            By{" "}
                            <span className="font-medium text-charcoal/70">
                              {s.profiles?.username || "Unknown"}
                            </span>
                          </p>
                          <p className="text-sm text-charcoal/60 leading-relaxed line-clamp-3">
                            {s.excerpt}
                          </p>
                        </div>
                      </div>

                      {/* Full content preview */}
                      <details className="mt-4">
                        <summary className="text-xs text-primary font-semibold cursor-pointer hover:underline">
                          Read full story
                        </summary>
                        <p className="mt-3 text-sm text-charcoal/70 leading-relaxed whitespace-pre-wrap border-t border-charcoal/10 pt-3">
                          {s.content}
                        </p>
                      </details>

                      {/* Actions */}
                      <div className="flex gap-3 mt-5 pt-4 border-t border-charcoal/10">
                        <button
                          onClick={() => handleApprove(s)}
                          className="bg-accent hover:bg-green-700 text-white text-xs font-bold px-5 py-2 rounded-full transition-all duration-200"
                        >
                          Approve & Publish
                        </button>
                        <button
                          onClick={() => handleDismiss(s)}
                          className="bg-gray-100 hover:bg-gray-200 text-charcoal/60 text-xs font-bold px-5 py-2 rounded-full transition-all duration-200"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resolved */}
            {resolvedSubmissions.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-charcoal uppercase tracking-widest mb-4">
                  Resolved ({resolvedSubmissions.length})
                </h2>
                <div className="space-y-3">
                  {resolvedSubmissions.map((s) => (
                    <div
                      key={s.id}
                      className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-charcoal/10 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-charcoal truncate">
                          {s.title}
                        </p>
                        <p className="text-xs text-charcoal/40 mt-0.5">
                          By {s.profiles?.username || "Unknown"} ·{" "}
                          {new Date(s.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${
                          s.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {s.status === "approved" ? "Published" : "Dismissed"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
