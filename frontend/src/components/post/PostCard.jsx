import { useState } from "react";
import { Link } from "react-router-dom";
import { likePost, deletePost, addComment, deleteComment } from "../../services/api";
import Avatar from "../Avatar";

export default function PostCard({ post, refresh }) {

    const user = JSON.parse(localStorage.getItem("user"));
    const isOwner = user?._id === post.user?._id;
    const isLiked = post.likes?.includes(user?._id);

    const [commentText, setCommentText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleLike = async () => {
        await likePost(post._id);
        if (refresh) refresh();
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this post?")) return;
        await deletePost(post._id);
        if (refresh) refresh();
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        setSubmitting(true);
        try {
            await addComment(post._id, commentText);
            setCommentText("");
            if (refresh) refresh();
        } catch (err) {
            console.log(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            await deleteComment(post._id, commentId);
            if (refresh) refresh();
        } catch (err) {
            console.log(err);
        }
    };

    const timeAgo = (d) => {
        const s = Math.floor((Date.now() - new Date(d)) / 1000);
        if (s < 60) return "Just now";
        if (s < 3600) return Math.floor(s / 60) + "m";
        if (s < 86400) return Math.floor(s / 3600) + "h";
        return Math.floor(s / 86400) + "d";
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl mb-4 shadow-sm overflow-hidden transition-colors duration-200">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <Link to={`/user/${post.user?._id}`} className="hover:opacity-80 transition-opacity">
                        <Avatar name={post.user?.name} src={post.user?.profilePic} size="w-9 h-9" textSize="text-sm" />
                    </Link>
                    <div>
                        <Link to={`/user/${post.user?._id}`}
                            className="text-sm font-semibold text-gray-900 dark:text-white hover:underline leading-none">
                            {post.user?.name}
                        </Link>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{timeAgo(post.createdAt)}</p>
                    </div>
                </div>

                {isOwner && (
                    <button onClick={handleDelete}
                        className="text-gray-400 hover:text-red-500 text-lg font-bold transition-colors">
                        ···
                    </button>
                )}
            </div>

            {/* Post body */}
            <div className="px-4 pb-3">
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{post.text}</p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4" />

            {/* Actions */}
            <div className="px-4 py-2 flex items-center gap-3">
                <button onClick={handleLike} className="flex items-center gap-1.5 focus:outline-none group">
                    <span className={`text-xl transition-transform group-active:scale-125 ${isLiked ? "text-red-500" : "text-gray-400"}`}>
                        {isLiked ? "❤️" : "🤍"}
                    </span>
                    <span className={`text-sm font-semibold ${isLiked ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}>
                        {post.likes?.length || 0}
                    </span>
                </button>
            </div>

            {/* Comments List */}
            {post.comments?.length > 0 && (
                <div className="px-4 pb-3 space-y-2 max-h-40 overflow-y-auto border-t border-gray-100 dark:border-gray-800 pt-2">
                    {post.comments.map(comment => (
                        <div key={comment._id} className="flex items-start justify-between group">
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                <Link to={`/user/${comment.user?._id}`} className="font-semibold mr-2 dark:text-white">{comment.user?.name}</Link>
                                {comment.text}
                            </p>
                            {(comment.user?._id === user._id || isOwner) && (
                                <button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    className="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="border-t border-gray-100 dark:border-gray-800 flex items-center px-4 py-2 mt-1">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 text-sm bg-transparent outline-none py-1 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                />
                <button
                    disabled={!commentText.trim() || submitting}
                    className="text-sm font-semibold text-blue-500 hover:text-blue-700 disabled:opacity-40 transition-colors ml-2"
                >
                    Post
                </button>
            </form>

        </div>
    );
}