export default function Comment({ comment, currentUserId, onDelete }) {
  const date = new Date(comment.created_at).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const initial = comment.profiles.username[0].toUpperCase();
  const isOwner = currentUserId === comment.author_id;

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
          {isOwner && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-200"
            >
              Delete
            </button>
          )}
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
