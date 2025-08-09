import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    default: "",
    trim: true,
  },
  image: {
    type: String,
  },
  reel: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment"
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postModel = mongoose.model('post', postSchema);
export default postModel;

