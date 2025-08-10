import user from "../model/user.js";
import { v2 as cloudinary } from "cloudinary";
import validator from "validator";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const register = async (req, res) => {
    const { email, username, password} = req.body;
    const userData = await user.findOne({ email });
    if (userData) {
        return res.status(400).json({ success: false, message: "User already exists" });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email" });
    }
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    try {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                const userData = new user({
                    email,
                    username,
                    password: hash
                });
                await userData.save();
                res.json({ success: true, message: "User Register Successful" });
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error });
    }
}

const login = async (req, res) => {
    try {
        const { password, email } = req.body;
        const userData = await user.findOne({ email });        

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, userData.password);

        if (isPasswordValid) {
            const token = jwt.sign({ userId: userData._id }, process.env.JWT_SECRET);

            res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 , sameSite: "none"  });

            return res.status(200).json({ success: true, userData, token, message: "Login successful" });
        } else {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }
    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

const logout = (req, res) => {
    try {
        res.clearCookie("token");
        res.json({ success: true, message: 'Logout Successfull' });
    } catch (error) {
        console.log(error);
        return res.json({ error });
    }
};

const getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const userData = await user.findById(id).select("-password");
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        await userData.populate([
            {
                path: 'post',
                populate: [
                    {
                        path: 'author',
                        select: 'username bio profile',
                    },
                    {
                        path: 'comments',
                        populate: {
                            path: 'author',
                            select: 'username profile',
                        },
                    },
                ],
            },
            {
                path: 'bookmarks',
                populate: [
                    {
                        path: 'author',
                        select: 'username bio profile',
                    },
                    {
                        path: 'comments',
                        populate: {
                            path: 'author',
                            select: 'username profile',
                        },
                    },
                ],
            },
            { path: 'following' },
            { path: 'followers' },
        ])
        return res.json({ userData, success: true });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, username, gender } = req.body;
        const profile = req.file;

        const userData = await user.findById(userId).select("-password");
        if (!userData) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        if (profile) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'posts',
            });
            userData.profile = result.secure_url;
        }
        if (bio) userData.bio = bio;
        if (username) userData.username = username;
        if (gender) userData.gender = gender;

        await userData.save();

        return res.json({ message: "Update Successful", success: true, userData });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};

const getSuggestedUser = async (req, res) => {
    console.log("login is "  , req.id);
    
    const suggestedUsers = await user.find({ _id: { $ne: req.id } }).select("-password");
    if (!suggestedUsers) {
        return res.json({ message: "Currently Do not any user", success: false })
    }
    return res.json({ success: true, suggestedUsers });
}

const followAndUnfollow = async (req, res) => {
    try {

        const loggedInUser = await user.findById(req.id);
        const userToFollow = await user.findById(req.params.id);

        if (loggedInUser.following.includes(req.params.id)) {

            loggedInUser.following = loggedInUser.following.filter((id) => id.toString() !== req.params.id);
            userToFollow.followers = userToFollow.followers.filter((id) => id.toString() !== req.id);
            // loggedInUser.followers = loggedInUser.followers.filter((id) => id.toString() !== req.params.id);
            // userToFollow.following = userToFollow.following.filter((id) => id.toString() !== req.id);

            await loggedInUser.save();
            await userToFollow.save();

            return res.json({ message: "User Unfollowed successfully", success: true });
        }
        else {

            loggedInUser.following.push(userToFollow._id);
            userToFollow.followers.push(loggedInUser._id);

            await loggedInUser.save();
            await userToFollow.save();

            return res.json({ message: "User followed successfully", success: true });
        }

    } catch (error) {
        console.log(error);

    }

}

const searchUser = async (req, res) => {
    const { username } = req.query;

    if (!username) return res.status(400).json({ message: 'Search query is required' });

    try {
        const regex = new RegExp(username, 'i');

        const users = await user.find({ username: { $regex: regex } });

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found', success : false });
        }

        return res.status(200).json({users, success : true});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

  
export { register, login, logout, getProfile, editProfile, getSuggestedUser, followAndUnfollow, searchUser };