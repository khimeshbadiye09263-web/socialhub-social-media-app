import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/api";

export default function Signup() {

    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await registerUser(form);
            alert("Account created! Please log in.");
            navigate("/");
        } catch (error) {
            alert(error.response?.data?.message || "Signup failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-sm">

                {/* Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-10 py-8 mb-3 transition-colors">

                    <h1 className="text-center text-4xl font-bold mb-2 text-gray-800 dark:text-white"
                        style={{ fontFamily: "Georgia, serif" }}>
                        SocialHub
                    </h1>

                    <p className="text-center text-gray-500 dark:text-gray-400 font-semibold text-sm mb-5">
                        Sign up to see posts from your friends.
                    </p>

                    <div className="flex flex-col gap-2">
                        <input placeholder="Full Name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm px-3 py-2.5 focus:outline-none focus:border-gray-500 dark:focus:border-gray-400 transition-colors text-gray-900 dark:text-white placeholder-gray-400" />
                        <input type="email" placeholder="Email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm px-3 py-2.5 focus:outline-none focus:border-gray-500 dark:focus:border-gray-400 transition-colors text-gray-900 dark:text-white placeholder-gray-400" />
                        <input type="password" placeholder="Password"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            onKeyDown={e => e.key === "Enter" && handleSubmit()}
                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm px-3 py-2.5 focus:outline-none focus:border-gray-500 dark:focus:border-gray-400 transition-colors text-gray-900 dark:text-white placeholder-gray-400" />
                    </div>

                    <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4 mb-3">
                        By signing up, you agree to our{" "}
                        <span className="font-semibold text-gray-600 dark:text-gray-300">Terms</span> &{" "}
                        <span className="font-semibold text-gray-600 dark:text-gray-300">Privacy Policy</span>.
                    </p>

                    <button onClick={handleSubmit}
                        disabled={loading || !form.name || !form.email || !form.password}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-lg py-2 transition-all disabled:opacity-50">
                        {loading ? "Creating account..." : "Sign up"}
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded py-4 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors">
                    Have an account?{" "}
                    <Link to="/" className="text-blue-500 font-semibold">Log in</Link>
                </div>

            </div>
        </div>
    );
}