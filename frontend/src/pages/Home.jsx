import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import CreatePost from "../components/post/CreatePost";
import PostCard from "../components/post/PostCard";
import { getPosts, getUsers, followUser } from "../services/api";

export default function Home() {

    const me = JSON.parse(localStorage.getItem("user"));
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const data = await getPosts();
            setPosts(Array.isArray(data) ? data : []);
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data.filter(u => !u.followers.includes(me._id)).slice(0, 5));
        } catch {
            // silently fail
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchUsers();
    }, []);

    const handleFollow = async (id) => {
        try {
            await followUser(id);
            fetchUsers();
            fetchPosts();
        } catch {
            // silently fail
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
            <Navbar />

            <div className="max-w-4xl mx-auto flex gap-8 pt-5 px-4 pb-10">

                {/* Main Feed */}
                <div className="flex-1 max-w-lg">
                    <CreatePost refresh={fetchPosts} />

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-gray-700 dark:border-t-gray-300 rounded-full animate-spin" />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 border-2 border-gray-400 dark:border-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl text-gray-400">📷</span>
                            </div>
                            <p className="font-bold text-gray-800 dark:text-gray-200">No posts yet</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Start by sharing your first post!</p>
                        </div>
                    ) : (
                        posts.map(post => (
                            <PostCard key={post._id} post={post} refresh={fetchPosts} />
                        ))
                    )}
                </div>

                {/* Sidebar */}
                <div className="hidden lg:block w-72 shrink-0">
                    <div className="sticky top-20">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <Link to="/profile" className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                                    style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}>
                                    {me?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="leading-none">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{me?.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate w-40">{me?.email}</p>
                                </div>
                            </Link>
                            <Link to="/profile" className="text-xs font-bold text-blue-500 hover:text-blue-700">Switch</Link>
                        </div>

                        <div className="flex items-center justify-between py-2 px-1">
                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">Suggested for you</span>
                            <Link to="/discover" className="text-xs font-bold text-gray-900 dark:text-gray-200 hover:opacity-70">See All</Link>
                        </div>

                        <div className="mt-2 space-y-3">
                            {users.length === 0 ? (
                                <p className="text-xs text-gray-400 px-1">No suggestions at the moment.</p>
                            ) : (
                                users.map(user => (
                                    <div key={user._id} className="flex items-center justify-between px-1">
                                        <Link to={`/user/${user._id}`} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                                style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}>
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="leading-none">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">Recommended</p>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => handleFollow(user._id)}
                                            className="text-xs font-bold text-blue-500 hover:text-blue-800"
                                        >
                                            Follow
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-8 px-1 text-[11px] text-gray-300 dark:text-gray-600 uppercase tracking-tight leading-loose">
                            About • Help • Privacy • Terms
                        </div>
                        <div className="mt-2 px-1 text-[11px] text-gray-300 dark:text-gray-600 uppercase tracking-tight">
                            © 2026 SOCIALHUB
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}