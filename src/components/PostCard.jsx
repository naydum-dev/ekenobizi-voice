import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  const excerpt = post.excerpt
    ? post.excerpt
    : post.content.substring(0, 180) + "...";

  const date = new Date(post.created_at).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow overflow-hidden">
      {/* ── Cover Image ── */}
      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}

      {/* ── Card Body ── */}
      <div className="p-6 flex flex-col gap-3 flex-1">
        <p className="text-xs text-accent font-semibold uppercase tracking-wide">
          {post.category}
        </p>
        <h2 className="font-playfair text-xl font-bold text-charcoal leading-snug">
          {post.title}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">{excerpt}</p>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-xs text-gray-400">{date}</span>
          <Link
            to={`/post/${post.id}`}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
