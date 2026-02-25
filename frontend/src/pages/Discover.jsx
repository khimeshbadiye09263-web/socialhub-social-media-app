import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { getUsers, followUser, unfollowUser } from "../services/api";

export default function Discover() {

    const me = JSON.parse(localStorage.getItem("user"));
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(null);

    const load = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleFollow = async (user) => {
        setBusy(user._id);
        try {
            const isFollowing = user.followers?.includes(me._id);
            if (isFollowing) {
                await unfollowUser(user._id);
            } else {
                await followUser(user._id);
            }
            await load();
        } catch (err) {
            console.log(err);
        } finally {
            setBusy(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
            <Navbar />

            <div className="max-w-lg mx-auto pt-5 px-4 pb-10">

                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">👥 Discover People</h2>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-gray-700 dark:border-t-gray-300 rounded-full animate-spin" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-4xl mb-3">🔍</p>
                        <p>No other users yet.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {users.map(user => {
                            const isFollowing = user.followers?.includes(me._id);
                            return (
                                <div key={user._id}
                                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm flex items-center justify-between transition-colors">

                                    <Link to={`/user/${user._id}`} className="flex items-center gap-3 hover:opacity-80">
                                        <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold"
                                            style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}>
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                                            <p className="text-xs text-gray-400">{user.followers?.length || 0} followers</p>
                                        </div>
                                    </Link>

                                    <button
                                        onClick={() => handleFollow(user)}
                                        disabled={busy === user._id}
                                        className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-all ${isFollowing
                                            ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                            } disabled:opacity-50`}
                                    >
                                        {busy === user._id ? "..." : isFollowing ? "Following" : "Follow"}
                                    </button>

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
