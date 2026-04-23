import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";

const categories = ["Community", "Culture", "Economy", "Sports", "Youth"];

export default function CreatePost() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Community");
  const [published, setPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // ── NEW: image state ──
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  // ── NEW: when user picks a file ──
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  // ── NEW: remove selected image ──
  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  async function handleSubmit() {
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    setError(null);

    // ── NEW: upload image first if one was selected ──
    let image_url = null;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        setError("Image upload failed. Please try again.");
        setSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("post-images")
        .getPublicUrl(fileName);

      image_url = urlData.publicUrl;
    }

    // ── insert post with image_url ──
    const { data, error } = await supabase
      .from("posts")
      .insert({
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        category,
        published,
        author_id: user.id,
        image_url,
      })
      .select()
      .single();

    if (error) {
      setError("Could not save post. Please try again.");
      setSubmitting(false);
      return;
    }

    if (published) {
      navigate(`/post/${data.id}`);
    } else {
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* ── HEADER BAR ── */}
      <div className="bg-charcoal text-white py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
            Admin
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Write a New Story
          </h1>
        </div>
      </div>

      {/* ── FORM ── */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 flex flex-col gap-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a compelling headline..."
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
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Excerpt{" "}
              <span className="text-gray-400 font-normal">
                (short summary shown on homepage)
              </span>
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief summary of the story..."
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
              placeholder="Write your full story here..."
              rows={14}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* ── NEW: Cover Image ── */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Cover Image{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>

            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors">
                <span className="text-gray-400 text-sm">
                  Click to upload an image
                </span>
                <span className="text-gray-300 text-xs mt-1">
                  JPG, PNG, WEBP
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Cover preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1 rounded-full transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Publish toggle */}
          <div className="flex items-center justify-between p-4 bg-cream rounded-xl">
            <div>
              <p className="text-sm font-semibold text-charcoal">
                {published ? "Ready to Publish" : "Save as Draft"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {published
                  ? "This post will be visible to everyone."
                  : "Only you can see drafts for now."}
              </p>
            </div>
            <button
              onClick={() => setPublished(!published)}
              className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${
                published ? "bg-accent" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                  published ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-primary hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-3.5 rounded-full transition-all duration-200 hover:scale-105"
          >
            {submitting
              ? "Saving..."
              : published
                ? "Publish Story"
                : "Save Draft"}
          </button>
        </div>
      </div>
    </div>
  );
}
