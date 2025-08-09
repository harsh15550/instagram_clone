import mongoose from "mongoose";
import Story from "../model/story.js";
import cloudinary from "../utils/cloudinary.js";

export const createStory = async (req, res) => {
    try {
        const userId = req.id;
        const { text, textColor, textStyle, textPositionX, textPositionY } = req.body;

        if (!req.file) return res.json({ message: "Image is require", success: false });
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "stories",
            resource_type: "image"
        })

        const story = new Story({
            user: userId,
            image: result.secure_url,
            text: text,
            textColor,
            textStyle,
            textPositionX,
            textPositionY
        })

        await story.save()

        return res.json({ message: "Story Created Successfull ", success: true, story });
    } catch (error) {
        console.log(error);
    }
}

export const allStory = async (req, res) => {
    try {
        const storys = await Story.find().populate('user').populate('seenUser').sort({ createdAt: -1 });
        if (storys) return res.json({ success: true, storys });
    } catch (error) {
        console.log(error);
    }
}

export const removeExpiredStories = async (req, res) => {
    try {
        const currentTime = new Date();
        const deleteResult = await Story.deleteMany({ expiresAt: { $lt: currentTime } });
        const stories = await Story.find({ expiresAt: { $gt: currentTime } });

        return res.json({
            message: `${deleteResult.deletedCount} Stories Deleted`,
            stories,
        });
    } catch (error) {
        console.error("Error deleting stories:", error);
        return res.status(500).json({ message: "Error deleting stories", error });
    }
};

export const deleteStory = async (req, res) => {
    try {
        const storyId = req.params.id;

        if (storyId) {
            await Story.deleteOne({ _id: storyId })
            return res.json({ message: 'Story Deleted', success: true })
        }
    } catch (error) {
        console.error("Error deleting stories:", error);
        return res.status(500).json({ message: "Error deleting stories", error });
    }
};

export const seenStoryUser = async (req, res) => {
    try {
        const userId = req.id;
        const storyId = req.params.id;

        // Check if storyId exists and is valid
        if (!storyId || !mongoose.Types.ObjectId.isValid(storyId)) {
            return res.status(400).json({ success: false, message: "Invalid or missing story ID" });
        }

        const story = await Story.findById(storyId).populate('seenUser');

        if (!story) {
            return res.status(404).json({ success: false, message: "Story not found" });
        }

        // Add user to seen list if not already present
        if (!story.seenUser.toString().includes(userId)) {
            story.seenUser.push(userId);
            await story.save();
        }

        return res.status(200).json({ success: true, story });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "An error occurred" });
    }
};

// Get Login User Story
export const userStory = async (req, res) => {
    try {
        const userId = req.id;

        if (!userId) return res.status(400).json({ success: false, message: "User Not Authenticated" })

        const story = await Story.find({ user: userId }).populate('seenUser')

        if (story) {
            return res.status(200).json({ success: true, story })
        }
    } catch (error) {
        console.log(error);
    }
}

// Get Another User Story 
export const getAnotherUserStory = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID not found'
            });
        }

        const story = await Story.find({ user: userId });

        return res.status(200).json({
            success: true,
            story
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the story',
            error: error.message
        });
    }
};