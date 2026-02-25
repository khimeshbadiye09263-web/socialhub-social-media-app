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
export const uploadProfilePic = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Compress image using canvas to max 300x300
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const max = 300;
                const ratio = Math.min(max / img.width, max / img.height);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;
                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                const imageBase64 = canvas.toDataURL("image/jpeg", 0.8);
                api.post("/users/upload-pic", { imageBase64 })
                    .then(r => resolve(r.data))
                    .catch(reject);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
};

// Messages / Chat
export const getConversations = () => api.get("/messages/conversations").then(r => r.data);
export const getMessages = (userId) => api.get(`/messages/${userId}`).then(r => r.data);
export const sendMessage = (userId, text) => api.post(`/messages/${userId}`, { text }).then(r => r.data);