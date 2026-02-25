import express from "express";

import {
    createPost,
    getPosts,
    likePost,
    deletePost,
    addComment,
    deleteComment
} from "../controllers/post.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createPost);

router.get("/", protect, getPosts);

router.put("/:id/like", protect, likePost);
router.delete("/:id", protect, deletePost);

// Comments
router.post("/:id/comment", protect, addComment);
router.delete("/:id/comment/:commentId", protect, deleteComment);

export default router;