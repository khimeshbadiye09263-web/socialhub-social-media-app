import { useEffect, useRef, useState, useContext } from "react";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import Navbar from "../components/layout/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getConversations, getMessages, sendMessage, getUsers } from "../services/api";

export default function Chat() {
    const { user } = useContext(AuthContext);
    const { dark } = useTheme();

    const [conversations, setConversations] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const [tab, setTab] = useState("chats");
    const [search, setSearch] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);

    const socketRef = useRef(null);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const emojiRef = useRef(null);

    // Connect socket
    useEffect(() => {
        if (!user) return;
        const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
        const socket = io(SOCKET_URL, { query: { userId: user._id } });
        socketRef.current = socket;
        socket.on("newMessage", (msg) => setMessages((prev) => [...prev, msg]));
        return () => socket.disconnect();
    }, [user]);

    // Scroll to bottom on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Load data
    useEffect(() => {
        loadConversations();
        loadAllUsers();
    }, []);

    // Close emoji picker on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (emojiRef.current && !emojiRef.current.contains(e.target)) {
                setShowEmoji(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const loadConversations = async () => {
        try { const data = await getConversations(); setConversations(data); } catch { }
    };

    const loadAllUsers = async () => {
        try { const data = await getUsers(); setAllUsers(data); } catch { }
    };

    const openChat = async (chatUser) => {
        setSelectedUser(chatUser);
        setShowEmoji(false);
        try { const msgs = await getMessages(chatUser._id); setMessages(msgs); } catch { setMessages([]); }
    };

    const handleSend = async () => {
        if (!text.trim() || !selectedUser || sending) return;
        setSending(true);
        setShowEmoji(false);
        try {
            const msg = await sendMessage(selectedUser._id, text.trim());
            setMessages((prev) => [...prev, msg]);
            setText("");
            socketRef.current?.emit("sendMessage", { receiverId: selectedUser._id, message: msg });
            loadConversations();
        } catch { } finally { setSending(false); }
    };

    const onEmojiClick = (emojiData) => {
        setText((prev) => prev + emojiData.emoji);
        inputRef.current?.focus();
    };

    const filteredUsers = allUsers.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase())
    );

    const avatar = (name, size = "w-10 h-10") => (
        <div className={`${size} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
            {name?.charAt(0).toUpperCase()}
        </div>
    );

    const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
            <Navbar />

            <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-5 flex gap-4" style={{ height: "calc(100vh - 56px)" }}>

                {/* ── Sidebar ── */}
                <div className="w-80 flex-shrink-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden transition-colors">

                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">💬 Messages</h2>
                        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
                            {["chats", "people"].map(t => (
                                <button key={t} onClick={() => setTab(t)}
                                    className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all capitalize ${tab === t
                                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
                                    {t === "chats" ? "🗨️ Chats" : "👥 People"}
                                </button>
                            ))}
                        </div>
                        {tab === "people" && (
                            <input
                                className="mt-2 w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400 transition-colors text-gray-900 dark:text-white placeholder-gray-400"
                                placeholder="Search users..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {tab === "chats" ? (
                            conversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                                    <span className="text-4xl">💬</span>
                                    <p className="text-sm">No conversations yet</p>
                                    <button onClick={() => setTab("people")} className="text-purple-500 text-sm font-semibold hover:underline">Start chatting →</button>
                                </div>
                            ) : conversations.map(c => (
                                <button key={c.user._id} onClick={() => openChat(c.user)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-left ${selectedUser?._id === c.user._id ? "bg-purple-50 dark:bg-purple-900/20 border-r-2 border-purple-500" : ""}`}>
                                    {avatar(c.user.name)}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{c.user.name}</p>
                                        <p className="text-xs text-gray-400 truncate">{c.lastMessage}</p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            filteredUsers.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <span className="text-3xl mb-2">🔍</span>
                                    <p className="text-sm">No users found</p>
                                </div>
                            ) : filteredUsers.map(u => (
                                <button key={u._id} onClick={() => { openChat(u); setTab("chats"); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-left ${selectedUser?._id === u._id ? "bg-purple-50 dark:bg-purple-900/20 border-r-2 border-purple-500" : ""}`}>
                                    {avatar(u.name)}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{u.name}</p>
                                        <p className="text-xs text-gray-400">{u.followers?.length || 0} followers</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* ── Chat Window ── */}
                <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden transition-colors">
                    {!selectedUser ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
                            <span className="text-6xl">💭</span>
                            <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">Select a conversation</p>
                            <p className="text-sm">Choose someone from the sidebar to start chatting</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat header */}
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                                {avatar(selectedUser.name, "w-9 h-9")}
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedUser.name}</p>
                                    <p className="text-xs text-green-500 font-medium">Active now</p>
                                </div>
                            </div>

                            {/* Messages area */}
                            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2">
                                {messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center flex-1 text-gray-400 gap-2">
                                        <span className="text-4xl">👋</span>
                                        <p className="text-sm">Say hi to <strong>{selectedUser.name}</strong>!</p>
                                    </div>
                                )}
                                {messages.map((msg, i) => {
                                    const isMe = msg.sender._id === user._id || msg.sender === user._id;
                                    return (
                                        <div key={msg._id || i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                            {!isMe && <div className="mr-2 mt-auto">{avatar(selectedUser.name, "w-7 h-7")}</div>}
                                            <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${isMe
                                                ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-br-sm"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm"}`}>
                                                <p className="leading-relaxed break-words">{msg.text}</p>
                                                <p className={`text-xs mt-1 ${isMe ? "text-purple-200" : "text-gray-400"}`}>
                                                    {formatTime(msg.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={bottomRef} />
                            </div>

                            {/* Message input + emoji picker */}
                            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">

                                {/* Emoji Picker — floats above input */}
                                {showEmoji && (
                                    <div ref={emojiRef} className="absolute bottom-20 right-4 z-50 shadow-2xl rounded-2xl overflow-hidden">
                                        <EmojiPicker
                                            onEmojiClick={onEmojiClick}
                                            theme={dark ? "dark" : "light"}
                                            skinTonesDisabled
                                            searchDisabled={false}
                                            height={380}
                                            width={320}
                                            previewConfig={{ showPreview: false }}
                                        />
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    {/* Emoji toggle button */}
                                    <button
                                        onClick={() => setShowEmoji(prev => !prev)}
                                        title="Emoji"
                                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-lg transition-all flex-shrink-0 ${showEmoji
                                            ? "bg-purple-100 dark:bg-purple-900/40 text-purple-600"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                                    >
                                        😊
                                    </button>

                                    {/* Text input */}
                                    <input
                                        ref={inputRef}
                                        className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 transition-colors text-gray-900 dark:text-white placeholder-gray-400"
                                        placeholder={`Message ${selectedUser.name}...`}
                                        value={text}
                                        onChange={e => setText(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                                    />

                                    {/* Send button */}
                                    <button
                                        onClick={handleSend}
                                        disabled={!text.trim() || sending}
                                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center disabled:opacity-40 hover:scale-105 active:scale-95 transition-transform shadow-md flex-shrink-0"
                                    >
                                        {sending ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
