import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text : {
        type : String,
        require : true
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
    },
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "post"
    }
})

const commentModel = mongoose.model("comment" , commentSchema);
export default commentModel;