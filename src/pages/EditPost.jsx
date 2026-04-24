import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";

const CATEGORIES = [
  "Community",
  "Culture",
  "Development",
  "Health",
  "Education",
  "History",
  "Youth",
  "Opinion",
];

export default function EditPost() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Form fields
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Community");
  const [content, setContent] = useState("");

  // Image handling
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Page state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch post and pre-fill form
  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setError("Could not load post.");
      } else {
        // Seed all form fields with existing data
        setTitle(data.title);
        setExcerpt(data.excerpt);
        setCategory(data.category);
        setContent(data.content);
        setExistingImageUrl(data.image_url);
      }
      setLoading(false);
    }

    fetchPost();
  }, [id]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setNewImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    setNewImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null); // clears the existing image too
  }

  async function handleSave() {
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setError("Title, excerpt, and content are required.");
      return;
    }

    setSaving(true);
    setError(null);

    let imageUrl = existingImageUrl; // default: keep existing

    // If a new image was picked, upload it first
    if (newImageFile) {
      const ext = newImageFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(fileName, newImageFile);

      if (uploadError) {
        setError("Image upload failed. Please try again.");
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("post-images")
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
    }

    // Update the post row
    const { error: updateError } = await supabase
      .from("posts")
      .update({
        title: title.trim(),
        excerpt: excerpt.trim(),
        category,
        content: content.trim(),
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      setError("Could not save changes. Please try again.");
      setSaving(false);
      return;
    }

    navigate(`/post/${id}`);
  }

  // Non-admin guard
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-red-500 text-lg font-semibold">
          You do not have permission to edit posts.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading post...</p>
      </div>
    );
  }

  // Determine which image to show in preview
  const displayImage = imagePreview || existingImageUrl;

  return (
    <div className="min-h-screen bg-cream py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/post/${id}`}
            className="text-primary text-sm font-semibold hover:underline inline-block mb-4"
          >
            ← Back to Post
          </Link>
          <h1
            className="text-4xl font-bold text-charcoal"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Edit Post
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Update the details below and save your changes.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col gap-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short summary shown on the home page..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your full post here..."
              rows={14}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Cover Image
            </label>

            {/* Current / preview image */}
            {displayImage && (
              <div className="mb-3 relative">
                <img
                  src={displayImage}
                  alt="Cover preview"
                  className="w-full max-h-64 object-cover rounded-xl"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white text-xs font-semibold px-3 py-1 rounded-full transition-all"
                >
                  Remove
                </button>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-red-800 cursor-pointer"
            />
            <p className="text-xs text-gray-400 mt-2">
              {displayImage
                ? "Pick a new file to replace the current image."
                : "No cover image. Upload one optionally."}
            </p>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-2">
            <Link
              to={`/post/${id}`}
              className="px-6 py-2 rounded-full border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-8 py-2 rounded-full transition-all duration-200"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
