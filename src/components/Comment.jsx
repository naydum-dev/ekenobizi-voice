import { useState } from "react";

export default function Comment({ comment, currentUserId, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [saving, setSaving] = useState(false);

  const date = new Date(comment.created_at).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const initial = comment.profiles.username[0].toUpperCase();
  const isOwner = currentUserId === comment.author_id;

  function handleDelete() {
    if (window.confirm("Delete this comment? This cannot be undone.")) {
      onDelete(comment.id);
    }
  }

  async function handleSave() {
    if (!editText.trim() || editText.trim() === comment.content) {
      setIsEditing(false);
      return;
    }
    setSaving(true);
    await onEdit(comment.id, editText.trim());
    setSaving(false);
    setIsEditing(false);
  }

  function handleCancel() {
    setEditText(comment.content);
    setIsEditing(false);
  }

  return (
    <div className="flex gap-4">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        {initial}
      </div>

      {/* Body */}
      <div className="flex-1">
        <div className="flex items-baseline justify-between mb-1">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-charcoal text-sm">
              @{comment.profiles.username}
            </span>
            <span className="text-gray-400 text-xs">{date}</span>
          </div>

          {/* Owner buttons — only show when NOT editing */}
          {isOwner && !isEditing && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-gray-400 hover:text-primary transition-colors duration-200"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Display mode */}
        {!isEditing && (
          <p className="text-gray-700 text-sm leading-relaxed">
            {comment.content}
          </p>
        )}

        {/* Edit mode */}
        {isEditing && (
          <div className="mt-1">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <div className="flex gap-2 mt-2 justify-end">
              <button
                onClick={handleCancel}
                className="text-xs text-gray-400 hover:text-charcoal transition-colors duration-200 px-3 py-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editText.trim()}
                className="bg-primary hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-1 rounded-full transition-all duration-200"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
