import express from "express";
import protect from "../middleware/auth.middleware.js";
import { getConversations, getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/conversations", protect, getConversations);
router.get("/:userId", protect, getMessages);
router.post("/:userId", protect, sendMessage);

export default router;
