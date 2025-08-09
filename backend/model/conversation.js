import mongoose from "mongoose";

const conversationSchema = mongoose.Schema({
    participent : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }],
    messages : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'message'
    }]
})

const conversion = mongoose.model('conversion' , conversationSchema);
export default conversion;