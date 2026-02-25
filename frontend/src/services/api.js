import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const api = axios.create({ baseURL: API_URL });

// Auto-attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = token;
    return config;
});

export default api;

// Auth
export const loginUser = (data) => api.post("/auth/login", data).then(r => r.data);
export const registerUser = (data) => api.post("/auth/register", data).then(r => r.data);

// Posts
export const getPosts = () => api.get("/posts").then(r => r.data);
export const createPost = (text) => api.post("/posts", { text });
export const likePost = (id) => api.put(`/posts/${id}/like`);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const addComment = (id, text) => api.post(`/posts/${id}/comment`, { text }).then(r => r.data);
export const deleteComment = (id, commentId) => api.delete(`/posts/${id}/comment/${commentId}`).then(r => r.data);

// Users
export const getUsers = () => api.get("/users").then(r => r.data);
export const getUserById = (id) => api.get(`/users/${id}`).then(r => r.data);
export const followUser = (id) => api.post(`/users/follow/${id}`);
export const unfollowUser = (id) => api.post(`/users/unfollow/${id}`);

// Messages / Chat
export const getConversations = () => api.get("/messages/conversations").then(r => r.data);
export const getMessages = (userId) => api.get(`/messages/${userId}`).then(r => r.data);
export const sendMessage = (userId, text) => api.post(`/messages/${userId}`, { text }).then(r => r.data);