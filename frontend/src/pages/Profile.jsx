import { useEffect, useRef, useState, useContext } from "react";
import Navbar from "../components/layout/Navbar";
import Avatar from "../components/Avatar";
import PostCard from "../components/post/PostCard";
import { getPosts, getUserById, uploadProfilePic } from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {

    const userInStorage = JSON.parse(localStorage.getItem("user"));
    const { login } = useContext(AuthContext);

    const [userData, setUserData] = useState(null);
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef(null);

    const loadProfile = async () => {
        try {
            const [freshUser, allPosts] = await Promise.all([
                getUserById(userInStorage._id),
                getPosts()
            ]);
            setUserData(freshUser);
            setMyPosts(Array.isArray(allPosts) ? allPosts.filter(p => p.user?._id === userInStorage._id) : []);
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadProfile(); }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate type & size
        if (!file.type.startsWith("image/")) return alert("Please select an image file.");
        if (file.size > 5 * 1024 * 1024) return alert("Image must be under 5MB.");

        setUploading(true);
        try {
            const updatedUser = await uploadProfilePic(file);
            setUserData(updatedUser);
            // Update stored user so Navbar reflects new pic immediately
            const stored = JSON.parse(localStorage.getItem("user"));
            login({ token: localStorage.getItem("token"), user: { ...stored, profilePic: updatedUser.profilePic } });
        } catch {
            alert("Upload failed. Please try again.");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

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

                            {/* Clickable Avatar */}
                            <div className="relative group flex-shrink-0">
                                <Avatar
                                    name={userData?.name}
                                    src={userData?.profilePic}
                                    size="w-20 h-20"
                                    textSize="text-3xl"
                                    onClick={() => fileInputRef.current?.click()}
                                />
                                {/* Hover overlay */}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 rounded-full bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    {uploading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span className="text-white text-lg">📷</span>
                                            <span className="text-white text-[9px] font-semibold mt-0.5">Change</span>
                                        </>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {/* Info */}
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
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                    Click your photo to change it 📷
                                </p>
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