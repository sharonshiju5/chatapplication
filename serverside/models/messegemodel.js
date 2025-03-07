import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    from:{type:String},
    to:{type:String},
    message:{type:String},
    time:{type:String},
    Date: { type: Date, default: Date.now },
    images:{ type: [String] },
})

export default mongoose.model.message||mongoose.model("message",messageSchema)