import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// GET /api/messages/conversations - list of people the logged-in user has chatted with
export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }],
        })
            .sort({ createdAt: -1 })
            .populate("sender", "name")
            .populate("receiver", "name");

        // Build a unique list of conversation partners
        const seen = new Set();
        const conversations = [];

        for (const msg of messages) {
            const other = msg.sender._id.toString() === userId.toString()
                ? msg.receiver
                : msg.sender;

            const otherId = other._id.toString();
            if (!seen.has(otherId)) {
                seen.add(otherId);
                conversations.push({
                    user: other,
                    lastMessage: msg.text,
                    lastAt: msg.createdAt,
                });
            }
        }

        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/messages/:userId - get all messages between me and :userId
export const getMessages = async (req, res) => {
    try {
        const me = req.user._id;
        const other = req.params.userId;

        const messages = await Message.find({
            $or: [
                { sender: me, receiver: other },
                { sender: other, receiver: me },
            ],
        })
            .sort({ createdAt: 1 })
            .populate("sender", "name")
            .populate("receiver", "name");

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// POST /api/messages/:userId - send a message to :userId
export const sendMessage = async (req, res) => {
    try {
        const sender = req.user._id;
        const receiver = req.params.userId;
        const { text } = req.body;

        if (!text?.trim()) {
            return res.status(400).json({ message: "Message cannot be empty" });
        }

        const message = await Message.create({ sender, receiver, text: text.trim() });
        await message.populate("sender", "name");
        await message.populate("receiver", "name");

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
