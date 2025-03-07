import React, { useEffect, useState } from 'react';
import { Search, X, Check,LogOut, Send, Paperclip,Mail,Phone,Edit, Smile } from 'lucide-react';
import { Link,useNavigate } from "react-router-dom";
import axios from 'axios';
import APIURL from './path';
import Newcontact from './newcontaact';
import { motion } from "framer-motion";


const HomePage = () => {
  const[profil,setProfile]=useState(false)
  const[contact,showcontact]=useState(false)
  const [formData, setFormData] = useState([]);

  const[accounts,setaccounts]=useState([])
  const navigate=useNavigate()

  const token=localStorage.getItem("token")
  const userId=localStorage.getItem("userId")
  // console.log(token);
  const[message,setmessage]=useState("")
  const[_id,setid]=useState("")
  const[chater,setchatter]=useState()
  const[chats,setchats]=useState()

  if (!token) {
    navigate("/login")
  }
  
  function viweprofile() {
    setProfile(!profil)
  } 

  async function fetchuser() {
    try {
        const res=await axios.post(APIURL+"/fetchuser",{userId})
        // console.log(res);
        if (res.status=200) {
          const{user}=res.data
        setFormData(user)
        // console.log(user);
        
        // console.log("form data is "+ formData);
        
      }
      
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(()=>{
  fetchuser()
},[token,userId])


async function fetchchattedaccount() {
  try {
    const res=await axios.post(APIURL+"/fetchchats",{userId})
    console.log(res);
    if (res.status=200) {
      const{chats}=res.data
      setaccounts(chats)
    }

  } catch (error) {
    
  }
}
useEffect(()=>{
  fetchchattedaccount()
},[userId])

function logOutuser() {
  localStorage.removeItem("token")
  localStorage.removeItem("userId")
  // window.location.reload()
  navigate("/login")

}




async function chatwith() {
  try {
    const res=await axios.post(APIURL+"/addmsg",{userId,_id,message})
    console.log(res);
    setmessage("")
  } catch (error) {
    console.log(error);
    
  }
}
// console.log(chater);

async function fetchchats() {
  try {
    const res=await axios.post(APIURL+"/fetchmessage",{userId,_id})
    console.log(res);
    if (res.status=200) {
      const{chats}=res.data
      setchats(chats)
    }
  } catch (error) {
    console.log(error);
  }
}
useEffect(()=>{
  fetchchats()
},[_id,message])
console.log(chats);


  return (

 <div className="flex h-screen overflow-hidden bg-gray-100">
  {/* Sidebar/Contact List */}
  <div className="w-80 flex flex-col bg-white border-r border-gray-200">
    {/* Header */}
    <div className="flex items-center p-4 border-b border-gray-200">
      <div className='w-10 h-10 rounded-full mr-3' onClick={viweprofile}>
        {profil ? <p>X</p> :
          <img className='w-full h-full object-cover rounded-full' src={formData.profile} alt="" />
        }
      </div>
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 border border-gray-200 rounded-full"
          placeholder="Search"
        />
      </div>
    </div>
    
    {/* Scrollable Conversation List */}
    <div className="overflow-y-auto flex-1">
      {profil ? 
        <div className="h-full p-4">
          <div className="w-full bg-white overflow-y-auto">
            {/* Profile Image */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-gray-100 overflow-hidden mb-4">
                <img 
                  src={formData.profile || '/default-avatar.png'} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div> 
              {/* Username */}
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {formData.username || 'Username'}
              </h2>
            </div> 
            {/* Contact Information */}
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600 truncate">
                  {formData.email || 'email@example.com'}
                </span>
              </div> 
              {/* Phone */}
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600">
                  {formData.phone || '+1 234 567 8900'}
                </span>
              </div>
            </div>
      
            {/* Edit Profile Button */}
            <div className="mt-6">
              <button className="w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                <Edit className="h-4 w-4" />
                <span className="text-sm font-medium">Edit Profile</span>
              </button>
            </div>
            
            {/* Logout Button */}
            <div className="mt-4">
              <button 
                onClick={() => logOutuser()}
                className="w-full bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      :
        <div className="relative h-full">
          <div className='fixed top-135 left-15 z-10 flex justify-center py-2'>
            <img 
              onClick={()=>showcontact(true)} 
              className='h-10 ml-50' 
              src="https://cdn-icons-png.flaticon.com/128/16028/16028253.png" 
              alt="New Message" 
            />
          </div>
          
          {accounts.map((account, index) => (
            <motion.div 
            key={index} 
            onClick={()=>{setid(account._id);setchatter(account)}}
            className="flex items-center p-3 border-b border-gray-100 bg-white hover:bg-gray-200 cursor-pointer transition-colors duration-150"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative mr-3">
              <motion.img 
                src={account.profile} 
                alt="Profile" 
                className="w-10 h-10 rounded-full"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              />
              {/* <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">80</span> */}
            </div>
            <motion.div 
              className="flex-1 min-w-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex justify-between">
                <motion.p 
                  className="text-sm font-semibold text-gray-900 truncate"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {account.username}
                </motion.p>
                <motion.p 
                  className="text-xs text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  9:16 AM
                </motion.p>
              </div>
              <motion.p 
                className="text-sm text-gray-500 truncate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {account.email}
              </motion.p>
            </motion.div>
          </motion.div>
          
          ))}
        </div>
      }
    </div>
  </div> 
  
  {/* Chat Area */}
  <div className="flex-1 flex flex-col">
    {contact ?
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button 
            onClick={() => showcontact(false)} 
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Newcontact />
        </div>
      </div>
    :
      <div className="flex flex-col h-full">
        {/* Chat header could go here */}
        <div className="flex items-center px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            <img src=  {chater ? chater.profile : "/api/placeholder/40/40"} 
              alt="Bill" className="w-8 h-8 rounded-full mr-3" />
            <div>
              <h2 className="text-sm font-semibold">  {chater ? chater.username : "Loading..."} 
              </h2>
              <p className="text-xs text-gray-500">Online for 10 mins</p>
            </div>
          </div>
        </div>
        

        {/* Messages area - scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Your messages would go here */}
          {chats?chats.map((chats,index)=>(
            chats.from==userId?
            <motion.div
            key={index}
            className={`chat-message `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
              <div  className="flex justify-end mb-4">
                <div className="mr-2 flex-shrink-0">
                  <img 
                  src={chater ? chater.profile : "/api/placeholder/40/40"} 
                  alt="Bill" className="w-8 h-8 rounded-full" />
                </div>
                <div className="flex flex-col">
                  <div className="bg-gray-200 rounded-lg p-3 mb-1 max-w-xs">
                    <p className="text-sm">{chats.message}</p>
                  </div>
                  <span className="text-xs text-gray-500">2:14 PM</span>
                </div>
              </div>
            </motion.div>
          :
          <motion.div
          key={index}
          className={`chat-message `}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
            <div  className="flex mb-4">
              <div className="mr-2 flex-shrink-0">
                <img 
                src={chater ? chater.profile : "/api/placeholder/40/40"} 
                alt="Bill" className="w-8 h-8 rounded-full" />
              </div>
              <div className="flex flex-col">
                <div className="bg-blue-200 rounded-lg p-3 mb-1 max-w-xs">
                  <p className="text-sm">{chats.message}</p>
                </div>
                <span className="text-xs text-gray-500">2:14 PM</span>
              </div>
            </div>
            </motion.div>
          )):""}

        </div>

        {/* Input section - fixed at bottom */}
        <div className="border-t border-gray-200 p-3 bg-white">
          {_id?
          <div className="flex items-center">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              placeholder="Type your message"
              onChange={(e)=>setmessage(e.target.value)}
              value={message}
              className="flex-1 border-0 outline-none px-3 py-2 text-sm"
            />
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Smile className="w-5 h-5" />
            </button>
            <button onClick={chatwith} className="p-2 ml-1 bg-gray-200 rounded-full text-gray-500 hover:bg-gray-300">
              <Send className="w-5 h-5" />
            </button>
          </div>
            :""}
        </div>
      </div>
    }
  </div>
</div>
);
};

export default HomePage;