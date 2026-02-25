import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {

    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const data = await loginUser(form);
            login(data);
            navigate("/home");
        } catch (error) {
            alert(error.response?.data?.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-sm">

                {/* Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-10 py-8 mb-3 transition-colors">

                    <h1 className="text-center text-4xl font-bold mb-8 text-gray-800 dark:text-white"
                        style={{ fontFamily: "Georgia, serif" }}>
                        SocialHub
                    </h1>

                    <div className="flex flex-col gap-2 mb-4">
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

                    <button onClick={handleSubmit}
                        disabled={loading || !form.email || !form.password}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-lg py-2 transition-all disabled:opacity-50">
                        {loading ? "Logging in..." : "Log in"}
                    </button>

                    <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
                        <span className="text-xs font-semibold text-gray-400">OR</span>
                        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
                    </div>

                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:underline">
                        Forgot password?
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded py-4 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-500 font-semibold">Sign up</Link>
                </div>

            </div>
        </div>
    );
}