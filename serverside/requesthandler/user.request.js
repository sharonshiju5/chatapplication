import userSchema from "../models/user.model.js"
import bcrypt from "bcrypt"
import pkg from 'jsonwebtoken';

const {sign} = pkg; 


export async function adduser(req,res) {
    try {
        const{email,username,phone,password,cpassword,profile,chatedaccount}=req.body
        
        if (!(username && email && phone && password && cpassword)) {
            return res.status(400).send({ msg: "Fields are empty" });
        }
    
        if (password !== cpassword) {
            return res.status(400).send({ msg: "Passwords do not match" });
        }
    
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return res.status(409).send({ msg: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        await userSchema.create({email,username,phone,profile,password:hashedPassword,chatedaccount})

        return res.status(201).send({ msg: "Successfully created", });


    } catch (error) {
        console.log(error);
        
    }
}

export async function logine(req,res){
    try {
        console.log(req.body);
        
        const { email, password } = req.body;
    
        if (!email || !password) {
          return res.status(400).json({ msg: "Fields are empty" });
        }
    
        const user = await userSchema.findOne({ email });
        if (!user) {
          return res.status(400).json({ msg: "Email is not valid" });
        }
    
        const success = await bcrypt.compare(password, user.password);
        console.log("Password Match:", success);
    
        if (!success) {
          return res.status(400).json({ msg: "Incorrect password" });
        }
    
        const token= await sign({userID:user._id},process.env.JWT_KEY,
          {expiresIn:"24h"})

        return res.status(200).json({ msg: "Successfully logged in", token,email,userId: user._id  });    

      } catch (error) {

        console.error("Login Error:", error);
        return res.status(500).json({ msg: "Internal Server Error", error: error.message });

      }
}


export async function fetchuser(req,res) {
  try {
    const{userId}=req.body
    console.log("user id is " +userId);

    const user=await userSchema.findById({_id:userId})
    console.log(user);
    
    res.status(200).send({msg:"userfound",user})
    
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
}

export async function viewusers(req, res) {
  try {
    const {search,userId}=req.body;

    console.log(search);

    let contacts;

    if (!search) {
      contacts = await userSchema.find({ _id: { $ne: userId } });
    } else {
      contacts = await userSchema.find({
        _id: { $ne: userId },
        username: { $regex: search, $options: "i" },
      });
    }

    return res.status(200).send({ msg: "userfound", contacts });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).send({ msg: "Server error", error });
  }
}


export async function editeuser(req,res) {
  try {
    const {formData}=req.body
    const{_id,username,phone}=formData
    console.log(phone);
    await userSchema.findByIdAndUpdate(_id,{username,phone})
    return res.status(201).send({ msg: "user updated" });

  } catch (error) {
    console.log(error);
  }
}

export async function chattedaccount(req,res) {
  try {
    const{userId,_id,search}=req.body
    await userSchema.findByIdAndUpdate(_id, { $addToSet: { chatedaccount: userId } });
    await userSchema.findByIdAndUpdate(userId, { $addToSet: { chatedaccount: _id } });

    return res.status(201).send({ msg: "added to chaats" });

  } catch (error) {
    console.log(error);
  }
}

export async function fetchedchattedaccount(req,res) {
  try {
    const { search, userId } = req.body;

let chats;

if (!search) {
  chats = await userSchema.find({
    chatedaccount: { $in: [userId] }, // Fetch users who have chatted with userId
    _id: { $ne: userId } // Exclude current user
  });
} else {
  chats = await userSchema.find({
    chatedaccount: { $in: [userId] }, // Fetch users who have chatted with userId
    _id: { $ne: userId }, // Exclude current user
    username: { $regex: search, $options: "i" } // Case-insensitive search
  });
}

return res.status(200).send({ msg: "Fetched chats", chats });

    
  } catch (error) {
    console.log(error);
  }
}