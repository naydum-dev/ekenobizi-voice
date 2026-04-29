import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ users: 0, posts: 0, comments: 0 });
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
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
        { data: usersData, error: usersError },
        { data: commentsData, error: commentsError },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("comments").select("*", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("comments")
          .select("*, profiles(username), posts(title)")
          .order("created_at", { ascending: false }),
      ]);

      if (usersError) throw usersError;
      if (commentsError) throw commentsError;

      setStats({
        users: userCount || 0,
        posts: postCount || 0,
        comments: commentCount || 0,
      });
      setUsers(usersData || []);
      setComments(commentsData || []);
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

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.username?.toLowerCase().includes(q) ||
      u.full_name?.toLowerCase().includes(q)
    );
  });

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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Total Members", value: stats.users },
            { label: "Total Posts", value: stats.posts },
            { label: "Total Comments", value: stats.comments },
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
        <div className="flex gap-2 mb-8 border-b border-charcoal/10">
          {["users", "comments"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-charcoal/50 hover:text-charcoal"
              }`}
            >
              {tab === "users"
                ? `Members (${stats.users})`
                : `Comments (${stats.comments})`}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            {/* Search */}
            <input
              type="text"
              placeholder="Search by username or full name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 px-4 py-2 rounded-lg border border-charcoal/20 bg-white text-charcoal text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            {/* Users Table */}
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
      </div>
    </div>
  );
}
