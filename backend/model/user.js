import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    gender : {
        type : String,
        default : ""
    },
    password: {
        type: String
    },
    profile: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    }],
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    }],
    date: {
        type: String,
        default: Date.now
    }
}, { timestamps: true })

const userModel = mongoose.model("user", userSchema);
export default userModel
