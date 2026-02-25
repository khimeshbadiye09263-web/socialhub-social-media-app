import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";

connectDB();

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
].filter(Boolean);

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Map userId -> socketId for real-time delivery
const onlineUsers = new Map();

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        onlineUsers.set(userId, socket.id);
    }

    socket.on("sendMessage", ({ receiverId, message }) => {
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", message);
        }
    });

    socket.on("disconnect", () => {
        onlineUsers.delete(userId);
    });
});

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);
