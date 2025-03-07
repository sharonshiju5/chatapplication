import messageSchema from "../models/messegemodel.js"
import userSchema from "../models/user.model.js"


export async function addmsg(req,res) {
    try {
        
        const{userId,_id,message,images,Date}=req.body
        await messageSchema.create({
            from:userId,
            to:_id,
            images,
            message,
            Date: _id, // Default to the current timestamp if Date is not provided
        })

        res.status(201).send({msg:"message addded"})
    } catch (error) {
        console.log(error);
    }
}


export async function fetchmessage(req,res) {
    try {
        const{userId,_id}=req.body
        const chats=await messageSchema.find({
            $or: [
              { from: userId, to: _id }, 
              { from: _id, to: userId }  
            ]
          })
        res.status(200).send({msg:"message fetched",chats})

    } catch (error) {
        console.log(error);
    }
}