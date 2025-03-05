import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{type:String},
    phone:{type:Number},
    email:{type:String},
    password:{type:String},
    profile:{ type: [String], required: true },

})

export default mongoose.model.user||mongoose.model("user",userSchema)