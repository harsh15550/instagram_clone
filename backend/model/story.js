import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', required: true
    },
    seenUser:
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }],
    text: {
        type: String,
    },
    textColor: {
        type: String
    },
    textStyle: {
        type: String
    },
    textPositionX: {
        type: Number
    },
    textPositionY: {
        type: Number
    },
    image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
    }
});

const Story = mongoose.model('Story', storySchema);
export default Story;