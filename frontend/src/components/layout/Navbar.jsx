import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../Avatar";

export default function Navbar() {

    const { user, logout } = useContext(AuthContext);
    const { dark, toggle } = useTheme();
    const navigate = useNavigate();

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
            <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">

                {/* Logo */}
                <Link to="/home">
                    <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight select-none"
                        style={{ fontFamily: "Georgia, serif" }}>
                        SocialHub
                    </span>
                </Link>

                {/* Nav links + user */}
                <div className="flex items-center gap-4">

                    {/* Discover */}
                    <Link to="/discover"
                        className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block">
                        👥 Discover
                    </Link>

                    {/* Chat */}
                    <Link to="/chat"
                        className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block">
                        💬 Chat
                    </Link>

                    {/* Dark/Light Toggle */}
                    <button
                        onClick={toggle}
                        title={dark ? "Switch to light mode" : "Switch to dark mode"}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-base"
                    >
                        {dark ? "☀️" : "🌙"}
                    </button>

                    {/* Profile avatar */}
                    <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Avatar name={user?.name} src={user?.profilePic} size="w-8 h-8" textSize="text-xs" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:block">{user?.name}</span>
                    </Link>

                    {/* Logout */}
                    <button onClick={() => { logout(); navigate("/"); }}
                        className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors">
                        Log out
                    </button>

                </div>
            </div>
        </nav>
    );
}