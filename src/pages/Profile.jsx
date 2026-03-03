import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabase";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit mode state
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        setError("Could not load profile.");
      } else {
        setProfile(data);
        setUsername(data.username);
        setFullName(data.full_name || "");
      }
      setLoading(false);
    }

    fetchProfile();
  }, [user.id]);

  async function handleSave() {
    setSaving(true);
    setSaveMessage(null);

    const { error } = await supabase
      .from("profiles")
      .update({ username, full_name: fullName })
      .eq("id", user.id);

    if (error) {
      setSaveMessage({
        type: "error",
        text: "Could not save changes. Try again.",
      });
    } else {
      setProfile((prev) => ({ ...prev, username, full_name: fullName }));
      setSaveMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
      setEditing(false);
    }
    setSaving(false);
  }

  function handleCancel() {
    setUsername(profile.username);
    setFullName(profile.full_name || "");
    setEditing(false);
    setSaveMessage(null);
  }

  if (loading) return <p className="p-8 text-center">Loading profile...</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-playfair text-3xl font-bold text-charcoal">
            My Profile
          </h1>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-primary font-semibold hover:underline"
            >
              Edit Profile
            </button>
          )}
        </div>
        <p className="text-gray-400 text-sm mb-8">
          Member since{" "}
          {new Date(profile.created_at).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {/* Save message */}
        {saveMessage && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
              saveMessage.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {saveMessage.text}
          </div>
        )}

        <div className="space-y-5">
          {/* Email — always read only */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1">
              Email
            </label>
            <p className="bg-gray-100 rounded-lg px-4 py-3 text-gray-500 text-sm">
              {user.email}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Email cannot be changed here.
            </p>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1">
              Username
            </label>
            {editing ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <p className="bg-gray-100 rounded-lg px-4 py-3 text-charcoal text-sm">
                @{profile.username}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1">
              Full Name
            </label>
            {editing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <p className="bg-gray-100 rounded-lg px-4 py-3 text-charcoal text-sm">
                {profile.full_name || (
                  <span className="text-gray-400 italic">Not set</span>
                )}
              </p>
            )}
          </div>

          {/* Save / Cancel buttons */}
          {editing && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
