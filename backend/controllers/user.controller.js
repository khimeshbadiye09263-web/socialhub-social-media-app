import User from "../models/user.model.js";

// GET ALL USERS (excluding self)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } })
            .select("name email followers following profilePic");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("name email followers following profilePic bio");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPLOAD PROFILE PICTURE (stored as base64 in MongoDB)
export const uploadProfilePic = async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) return res.status(400).json({ message: "No image data" });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { profilePic: imageBase64 },
            { new: true }
        ).select("name email followers following profilePic bio");

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// FOLLOW USER
export const followUser = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const targetUserId = req.params.id;

        if (currentUserId.toString() === targetUserId)
            return res.status(400).json({ message: "Can't follow yourself" });

        const [currentUser, targetUser] = await Promise.all([
            User.findById(currentUserId),
            User.findById(targetUserId),
        ]);

        if (!targetUser) return res.status(404).json({ message: "User not found" });
        if (currentUser.following.includes(targetUserId))
            return res.status(400).json({ message: "Already following" });

        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);
        await Promise.all([currentUser.save(), targetUser.save()]);

        res.json({ message: "Followed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UNFOLLOW USER
export const unfollowUser = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const targetUserId = req.params.id;

        const [currentUser, targetUser] = await Promise.all([
            User.findById(currentUserId),
            User.findById(targetUserId),
        ]);

        if (!targetUser) return res.status(404).json({ message: "User not found" });

        currentUser.following.pull(targetUserId);
        targetUser.followers.pull(currentUserId);
        await Promise.all([currentUser.save(), targetUser.save()]);

        res.json({ message: "Unfollowed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};