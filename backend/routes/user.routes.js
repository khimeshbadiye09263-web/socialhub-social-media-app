import express from "express";
import {
    getAllUsers,
    getUserById,
    followUser,
    unfollowUser
} from "../controllers/user.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getAllUsers);   // GET  /api/users
router.get("/:id", protect, getUserById);  // GET  /api/users/:id
router.post("/follow/:id", protect, followUser);   // POST /api/users/follow/:id
router.post("/unfollow/:id", protect, unfollowUser); // POST /api/users/unfollow/:id

export default router;