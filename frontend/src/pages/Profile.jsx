import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import PostCard from "../components/post/PostCard";
import { getPosts, getUserById } from "../services/api";

export default function Profile() {

    const userInStorage = JSON.parse(localStorage.getItem("user"));
    const [userData, setUserData] = useState(null);
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadProfile = async () => {
        try {
            const [freshUser, allPosts] = await Promise.all([
                getUserById(userInStorage._id),
                getPosts()
            ]);
            setUserData(freshUser);
            setMyPosts(Array.isArray(allPosts) ? allPosts.filter(p => p.user?._id === userInStorage._id) : []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadProfile(); }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
            <Navbar />

            <div className="max-w-lg mx-auto pt-5 px-4 pb-10">

                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-5 shadow-sm transition-colors">
                    {loading ? (
                        <div className="flex justify-center py-4">
                            <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0"
                                style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}>
                                {userData?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{userData?.name}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{userData?.email}</p>
                                <div className="flex gap-6">
                                    <div className="text-center">
                                        <p className="font-bold text-gray-900 dark:text-white">{myPosts.length}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">posts</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-gray-900 dark:text-white">{userData?.followers?.length || 0}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">followers</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-gray-900 dark:text-white">{userData?.following?.length || 0}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">following</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-widest">POSTS</span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Posts */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-gray-700 dark:border-t-gray-300 rounded-full animate-spin" />
                    </div>
                ) : myPosts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 border-2 border-gray-400 dark:border-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl text-gray-400">📷</span>
                        </div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">No posts yet</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your posts will appear here.</p>
                    </div>
                ) : (
                    myPosts.map(post => (
                        <PostCard key={post._id} post={post} refresh={loadProfile} />
                    ))
                )}
            </div>
        </div>
    );
}