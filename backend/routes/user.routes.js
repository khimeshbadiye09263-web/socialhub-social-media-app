import express from "express";
import protect from "../middleware/auth.middleware.js";
import { getAllUsers, getUserById, followUser, unfollowUser, uploadProfilePic } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUserById);
router.post("/follow/:id", protect, followUser);
router.post("/unfollow/:id", protect, unfollowUser);
router.post("/upload-pic", protect, uploadProfilePic);

export default router;