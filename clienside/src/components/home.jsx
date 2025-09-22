import React, { useEffect, useState, useRef } from 'react';
import { Search, X, Check, LogOut, Send, Paperclip, Mail, Phone, Edit, Smile } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { io } from "socket.io-client"; 
import APIURL from './path';
import Newcontact from './newcontaact';
import { motion } from "framer-motion";

// Create a socket reference outside the component
const SOCKET_URL = APIURL.replace('/api', ''); // Adjust based on your API URL structure
let socket;

const HomePage = () => {
  // Existing state variables
  const [profil, setProfile] = useState(false);
  const [showedit, setShowedit] = useState(false);
  const [contact, showcontact] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phone:"",
  });  const [accounts, setaccounts] = useState([]);
  const [message, setmessage] = useState("");
  const [_id, setid] = useState("");
  const [chater, setchatter] = useState();
  const [chats, setchats] = useState([]);
  const[search,setsearch]=useState("")
  // New state variables for socket functionality
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Initialize socket connection
  useEffect(() => {
    if (userId) {
      // Initialize socket connection
      socket = io(SOCKET_URL);
      
      // Connect event
      socket.on("connect", () => {
        console.log("Connected to socket server");
        socket.emit("user_connected", userId);
      });
      
      // Handle incoming messages
      socket.on("receive_message", (newMessage) => {
        setchats(prevChats => [...prevChats, newMessage]);
      });
      
      // Handle message sent confirmation
      socket.on("message_sent", (confirmation) => {
        console.log("Message sent successfully:", confirmation);
      });
      
      // Handle typing indicators
      socket.on("user_typing", ({ userId }) => {
        setTypingUsers(prev => ({ ...prev, [userId]: true }));
      });
      
      // Handle stop typing indicators
      socket.on("user_stop_typing", ({ userId }) => {
        setTypingUsers(prev => ({ ...prev, [userId]: false }));
      });
      
      // Handle online users update
      socket.on("user_status_update", (activeUsers) => {
        setOnlineUsers(activeUsers);
      });
      
      // Handle errors
      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
      
      // Cleanup on component unmount
      return () => {
        socket.disconnect();
      };
    }
  }, [userId]);

  
  // Profile view toggle
  function viweprofile() {
    setProfile(!profil);
  }

  async function saveChanges(_id) {
    try {
      const res = await axios.post(APIURL + "/editeuser", { _id ,formData});
      // console.log(formData);
      // console.log(_id);
      if (res.status=201) {
        setShowedit(false)
      }
    } catch (error) {
     console.log(error);
    }
  }


  // Fetch user data
  async function fetchuser() {
    try {
      const res = await axios.post(APIURL + "/fetchuser", { userId });
      if (res.status = 200) {
        const { user } = res.data;
        setFormData(user);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    fetchuser();
  }, [token, userId]);

  // Fetch chatted accounts
  async function fetchchattedaccount() {
    try {
      console.log(search);
      
      const res = await axios.post(APIURL + "/fetchchats", { userId,search });
      if (res.status = 200) {
        const { chats } = res.data;
        setaccounts(chats);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    fetchchattedaccount();
  }, [userId,search]);

  // Logout function
  function logOutuser() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    socket?.disconnect();
    navigate("/login");
  }

  // Send message using Socket.IO
  function chatwith() {
    if (message.trim() === "" || !_id) return;
    
    // Check if socket is initialized
    if (!socket) {
      console.error("Socket connection not established");
      return;
    }
    
    // Emit message via socket
    socket.emit("send_message", {
      from: userId,
      to: _id,
      message: message
    });
    
    // Optimistically add message to UI
    const newMessage = {
      _id: Date.now().toString(), // Temporary ID
      from: userId,
      to: _id,
      message: message,
      timestamp: new Date()
    };
    
    setchats(prevChats => [...prevChats, newMessage]);
    setmessage("");
    
    // Also emit stop typing event
    socket.emit("stop_typing", { from: userId, to: _id });
  }

  // Handle typing indicator
  const handleTyping = (e) => {
    setmessage(e.target.value);
    
    if (!socket || !_id) return;
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Emit typing event
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { from: userId, to: _id });
    }
    
    // Set timeout to stop typing indicator after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("stop_typing", { from: userId, to: _id });
    }, 2000);
  };

  // Fetch messages
  async function fetchchats() {
    if (!_id) return;
    
    try {
      const res = await axios.post(APIURL + "/fetchmessage", { userId, _id });
      if (res.status = 200) {
        const { chats } = res.data;
        setchats(chats);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    if (_id) {
      fetchchats();
    }
  }, [_id,chats]);

  // Handle enter key to send message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatwith();
    }
  };
// console.log(formData);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar/Contact List */}
      <div className="w-25 lg:w-70 md:w-50 flex flex-col bg-white border-r border-gray-200">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200">
            {formData?.profile ? (
          <div className='w-10 h-10 rounded-full mr-3' onClick={viweprofile}>
              <img className='w-full h-full object-cover rounded-full' src={formData?.profile} alt="" />
          </div>
            )
             : (
              <div className='w-10 h-10 rounded-full mr-3'>
              <img className='w-full h-full object-cover rounded-full' src="https://cdn-icons-png.flaticon.com/128/9408/9408175.png" alt="" />
          </div>
            )}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              onChange={(e)=>setsearch(e.target.value)}
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
                      src={formData?.profile || '/default-avatar.png'} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div> 
                  {/* Username */}
                  {showedit?
                    <input type="text" name="username" placeholder="Username"
                    onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} value={formData.username || ""} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-50 focus:border-indigo-500 transition-all text-gray-800 placeholder-gray-400"/>
                  :
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {formData.username || 'Username'}
                  </h2>
                  }
                </div> 
                {/* Contact Information */}
                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    {showedit ? (
                      <div className="flex flex-col">
                        <span className="text-gray-800 font-medium truncate">
                          {formData.email || 'email@example.com'}
                        </span>
                        <p className="text-xs text-red-500 italic mt-1">Cannot change email</p>
                      </div>
                      ) : (
                      <span className="text-gray-700 font-medium truncate">
                        {formData.email || 'email@example.com'}
                      </span>
                    )}
                  </div> 
                  {/* Phone */}
                  {showedit?
                    <input type="text" name="phone" placeholder="phone"
                    onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} value={formData.phone || ""} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-50 focus:border-indigo-500 transition-all text-gray-800 placeholder-gray-400"/>
                  :
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-600">
                        {formData.phone || '+1 234 567 8900'}
                      </span>
                    </div>
                  }
                </div>
          
                {/* Edit Profile Button */}
                <div className="mt-6">
                  {showedit?
                    <button 
                    onClick={() => saveChanges()} 
                      className="w-full bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Save Profile</span>
                    </button>
                    :
                    <button onClick={()=>setShowedit(true)} className="w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                      <Edit className="h-4 w-4" />
                      <span className="text-sm font-medium">Edit Profile</span>
                    </button>
                  }
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
                  onClick={() => showcontact(true)} 
                  className='h-10 ml-0 md:ml-40  ' 
                  src="https://cdn-icons-png.flaticon.com/128/16028/16028253.png" 
                  alt="New Message" 
                />
              </div>
              
              {accounts.map((account, index) => (
                <motion.div 
                key={index} 
                onClick={() => {setid(account._id); setchatter(account)}}
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
                  {/* Online indicator */}
                  {onlineUsers.includes(account._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
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
                      {onlineUsers.includes(account._id) ? 'online' : 'offline'}
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
            {/* Chat header */}
            <div className="flex items-center px-4 py-3 border-b border-gray-200 bg-white">
              {chater && (
                <div className="flex items-center">
                  <div className="relative">
                    <img 
                      src={chater.profile || "/api/placeholder/40/40"} 
                      alt={chater.username} 
                      className="w-8 h-8 rounded-full mr-3" 
                    />
                    {/* Online indicator */}
                    {onlineUsers.includes(chater._id) && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold">{chater.username}</h2>
                    <p className="text-xs text-gray-500">
                      {onlineUsers.includes(chater._id) 
                        ? 'Online' 
                        : 'Offline'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Messages area - scrollable */}
            <div className="flex-1 overflow-y-auto p-4">
              { chats && chats.map((chat, index) => (
                chat.from === userId ? (
                  <motion.div
                    key={index}
                    className="chat-message"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-end mb-4">
                      <div className="flex flex-col items-end">
                        <div className="bg-blue-500 text-white rounded-lg p-3 mb-1 max-w-xs">
                          <p className="text-sm">{chat.message}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(chat.Date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}<br></br>
                          {new Date(chat.Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <img 
                          src={formData.profile || "/api/placeholder/32/32"} 
                          alt="You" 
                          className="w-8 h-8 rounded-full" 
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={index}
                    className="chat-message"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex mb-4">
                      <div className="mr-2 flex-shrink-0">
                        <img 
                          src={chater ? chater.profile : "/api/placeholder/32/32"} 
                          alt="Contact" 
                          className="w-8 h-8 rounded-full" 
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="bg-gray-200 rounded-lg p-3 mb-1 max-w-xs">
                          <p className="text-sm">{chat.message}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(chat.Date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}<br></br>
                          {new Date(chat.Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
              
              {/* Typing indicator */}
              {_id && typingUsers[_id] && (
                <div className="flex mb-4">
                  <div className="mr-2 flex-shrink-0">
                    <img 
                      src={chater ? chater.profile : "/api/placeholder/32/32"} 
                      alt="Contact" 
                      className="w-8 h-8 rounded-full" 
                    />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 inline-flex items-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input section - fixed at bottom */}
            <div className="border-t border-gray-200 p-3 bg-white">
              {_id ? (
                <div className="flex items-center">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Paperclip  className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type your message"
                    onChange={handleTyping}
                    onKeyPress={handleKeyPress}
                    value={message}
                    className="flex-1 border-0 outline-none px-3 py-2 text-sm"
                  />
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={chatwith} 
                    className="p-2 -ml-50 bg-blue-500 rounded-full text-white hover:bg-blue-600"
                    disabled={!message.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-2">
                  Select a contact to start chatting
                </div>
              )}
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default HomePage;