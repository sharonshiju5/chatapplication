import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{type:String},
    phone:{type:Number},
    email:{type:String},
    password:{type:String},
    profile:{ type: [String], required: true },
    chatedaccount: { type: [String] },

})

export default mongoose.model.user||mongoose.model("user",userSchema)