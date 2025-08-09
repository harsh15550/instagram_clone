import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    receiverId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    repliedMessage: {
        type:String
    },
    repliedUserId: {
        type:String
    },
    messages : {
        type : String,
        require : true
    },
    time: {
        type: Date, 
        default: Date.now 
    }
})

const messageModel = mongoose.model("message" , messageSchema);
export default messageModel;