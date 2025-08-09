import { v2 as cloudinary } from 'cloudinary';
import postModel from "../model/post.js";
import userModel from "../model/user.js";
import commentModel from "../model/comment.js";
import { getPostOwnerID, io } from '../socket/socket.js';

export const addContent = async (req, res) => {
    try {
        const { caption, type } = req.body;
        const authorId = req.id;

        if (!caption || !type || (type !== "post" && type !== "reel")) {
            return res.status(400).json({
                message: "Caption and a valid type ('post' or 'reel') are required",
                success: false,
            });
        }

        const uploadOptions = {
            folder: type === "post" ? "posts" : "reels",
            resource_type: type === "reel" ? "video" : "image",
        };

        const result = await cloudinary.uploader.upload(req.file.path, uploadOptions);

        const newContent = {
            caption,
            author: authorId,
        };
        if (type === "post") {
            newContent.image = result.secure_url;
        } else if (type === "reel") {
            newContent.reel = result.secure_url;
        }

        const post = new postModel(newContent);
        await post.save();

        const userData = await userModel.findById(authorId);
        if (userData) {
            userData.post.push(post._id);
            await userData.save();
        }

        await post.populate("author", "-password");

        return res.status(201).json({
            message: `${type === "post" ? "Post" : "Reel"} added successfully`,
            post,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export const getAllPost = async (req, res) => {
    try {
        const post = await postModel.find().sort({ createdAt: -1 })
            .populate({ path: "author", select: "username profile" })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: {
                    path: "author",
                    select: "username profile"
                }
            })

        return res.json({ success: true, post });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const getUserPost = async (req, res) => {
    try {
        const autherId = req.id;
        const post = await postModel.find({ author: autherId }).sort({ createdAt: -1 })
            .populate({ path: "author", select: "username,profile" })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: {
                    path: "author",
                    select: "username profile"
                }
            })
        return res.json({ post, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const likePost = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;

        const post = await postModel.findById(postId);
        if (!post) {
            return res.json({ message: "No Post available", success: false });
        }

        const user = await userModel.findById(userId).select('profile username');

        if (!user) {
            return res.json({ message: "User not found", success: false });
        }

        const postOwnerID = getPostOwnerID(post.author._id);

        if (postOwnerID && post.author._id.toString() !== user._id.toString()) {
            io.to(postOwnerID).emit('likeNotification', {
                postId,
                userId,
                image: post.image,
                reel: post.reel,
                username: user.username,
                profile: user.profile,
                message: `${user.username} liked your post.`
            });
        }

        await post.updateOne({ $addToSet: { likes: userId } });
        await post.save();

        return res.json({ message: "Post Liked", post, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};


export const dislike = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const post = await postModel.findById(postId);

        if (!post) {
            return res.json({ message: "Post Not Found", success: false });
        }

        const user = await userModel.findById(userId).select('profile username');

        const postOwnerID = getPostOwnerID(post.author._id);

        if (postOwnerID && post.author._id.toString() !== user._id.toString()) {
            io.to(postOwnerID).emit('disLikeNotification', {
                postId,
                userId,
                reel: post.reel,
                image: post.image,
                username: user.username,
                profile: user.profile,
                message: `${user.username} liked your post.`
            });
        }

        await post.updateOne({ $pull: { likes: userId } });
        await post.save();

        return res.json({ message: "Post Disliked", post, success: true })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const addComment = async (req, res) => {
    try {
        const postid = req.params.id;
        const userId = req.id;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: "Text is required", success: false });
        }

        const post = await postModel.findById(postid);
        if (!post) {
            return res.status(404).json({ message: "Post not found", success: false });
        }

        const comment = new commentModel({
            text,
            author: userId,
            post: postid,
        });

        await comment.populate({
            path: "author",
            select: "username profile"
        })

        await comment.save();

        post.comments.push(comment._id);

        await post.save();

        return res.json({ message: "Comment added successfully", success: true, comment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export const getAllComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await commentModel.find({ post: postId }).populate("author").select("username profile");
        if (!comments) {
            return res.json({ message: "No comments ", success: false });
        }
        return res.json({ message: "comment added ", comments, success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const deletePost = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;

        const post = await postModel.findById(postId);
        if (!post) return res.json({ message: "Post is not available", success: false });

        if (post.author.toString() != userId) return res.json({ message: "Unauthorize", success: false });

        await postModel.findByIdAndDelete(postId);

        const user = await userModel.findById(userId);
        user.post = user.post.filter(id => id.toString() != postId);
        await user.save();

        await commentModel.deleteMany({ post: postId });

        return res.json({ message: "Post Deleted", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });

    }
}

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;
        const user = await userModel.findById(userId);
        const post = await postModel.findById(postId);

        if (!post) return res.json({ message: "Post Not Found", success: false });

        if (!user) return res.json({ message: "Unauthorize", success: false });

        if (user.bookmarks.includes(post._id)) {
            await user.updateOne({ $pull: { bookmarks: postId } });
            await user.save();
            return res.json({ message: "Removed from Bookmarked", user, success: true });
        }
        else {
            await user.updateOne({ $addToSet: { bookmarks: postId } });
            await user.populate('bookmarks');
            await user.save();
            return res.json({ message: "Added to Bookmark", user, success: true });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
} 