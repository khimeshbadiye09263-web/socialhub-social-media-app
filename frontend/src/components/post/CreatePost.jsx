import { useState, useContext } from "react";
import { createPost } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

export default function CreatePost({ refresh }) {

    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);

    const handlePost = async () => {
        if (!text.trim()) return;
        try {
            setLoading(true);
            await createPost(text);
            setText("");
            if (refresh) refresh();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl mb-4 shadow-sm transition-colors duration-200">

            <div className="flex items-center gap-3 px-4 py-3">

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}>
                    {user?.name?.charAt(0).toUpperCase()}
                </div>

                {/* Input */}
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handlePost()}
                    placeholder="What's on your mind?"
                    className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 outline-none"
                />

            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-2 flex justify-end">
                <button
                    onClick={handlePost}
                    disabled={!text.trim() || loading}
                    className="text-sm font-semibold text-blue-500 hover:text-blue-700 disabled:opacity-40"
                >
                    {loading ? "Posting..." : "Share"}
                </button>
            </div>

        </div>
    );
}