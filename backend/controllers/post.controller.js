import Post from "../models/post.model.js";

// CREATE POST
export const createPost = async (req, res) => {
    try {
        const post = await Post.create({ user: req.user._id, text: req.body.text });
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// GET ALL POSTS
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "name")
            .populate("comments.user", "name")
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// ADD COMMENT
export const addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        post.comments.push({ user: req.user._id, text: req.body.text });
        await post.save();

        const updated = await Post.findById(req.params.id).populate("comments.user", "name");
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// DELETE COMMENT
export const deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (
            comment.user.toString() !== req.user._id.toString() &&
            post.user.toString() !== req.user._id.toString()
        ) {
            return res.status(401).json({ message: "Not authorized" });
        }

        comment.deleteOne();
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// LIKE / UNLIKE POST
export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const userId = req.user._id;
        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        } else {
            post.likes.push(userId);
        }

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// DELETE POST
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        await post.deleteOne();
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};