import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import PostCard from "../components/post/PostCard";
import { getUserById, getPosts, followUser, unfollowUser } from "../services/api";

export default function UserProfile() {

    const { id } = useParams();
    const me = JSON.parse(localStorage.getItem("user"));

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState(false);
    const [busy, setBusy] = useState(false);

    const load = async () => {
        try {
            const [u, allPosts] = await Promise.all([getUserById(id), getPosts()]);
            setProfile(u);
            setFollowing(u.followers?.includes(me._id));
            setPosts(allPosts.filter(p => p.user?._id === id));
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [id]);

    const handleFollow = async () => {
        setBusy(true);
        try {
            if (following) {
                await unfollowUser(id);
                setFollowing(false);
                setProfile(p => ({ ...p, followers: p.followers.filter(f => f !== me._id) }));
            } else {
                await followUser(id);
                setFollowing(true);
                setProfile(p => ({ ...p, followers: [...p.followers, me._id] }));
            }
        } catch {
            // silently fail
        } finally {
            setBusy(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            <Navbar />
            <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-gray-700 dark:border-t-gray-300 rounded-full animate-spin" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
            <Navbar />

            <div className="max-w-lg mx-auto pt-5 px-4 pb-10">

                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-5 shadow-sm transition-colors">
                    <div className="flex items-center gap-5">

                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0"
                            style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}>
                            {profile?.name?.charAt(0).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{profile?.name}</h2>

                                {me._id !== id && (
                                    <button
                                        onClick={handleFollow}
                                        disabled={busy}
                                        className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-all ${following
                                            ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                            } disabled:opacity-50`}
                                    >
                                        {following ? "Following" : "Follow"}
                                    </button>
                                )}
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{profile?.email}</p>

                            <div className="flex gap-6">
                                <div className="text-center">
                                    <p className="font-bold text-gray-900 dark:text-white">{posts.length}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">posts</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-gray-900 dark:text-white">{profile?.followers?.length || 0}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">followers</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-gray-900 dark:text-white">{profile?.following?.length || 0}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">following</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posts divider */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-widest">POSTS</span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-5xl mb-4">📷</p>
                        <p className="font-bold text-gray-800 dark:text-gray-200">No posts yet</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <PostCard key={post._id} post={post} refresh={load} />
                    ))
                )}
            </div>
        </div>
    );
}
