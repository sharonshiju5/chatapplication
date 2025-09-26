import React, { useEffect, useState, useRef } from 'react';
import { Search, X, Check, LogOut, Send, Paperclip, Mail, Phone, Edit, Smile, Download } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { io } from "socket.io-client"; 
import APIURL from './path';
import Newcontact from './newcontaact';
import Loader from './Loader';
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
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState({
    user: true,
    contacts: true,
    messages: false,
    sending: false
  });
  const [messageCounts, setMessageCounts] = useState({});
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
        // Update message count if not in current chat
        if (newMessage.from !== _id) {
          setMessageCounts(prev => ({
            ...prev,
            [newMessage.from]: (prev[newMessage.from] || 0) + 1
          }));
        }
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
      setLoading(prev => ({ ...prev, user: true }));
      const res = await axios.post(APIURL + "/fetchuser", { userId });
      if (res.status = 200) {
        const { user } = res.data;
        setFormData(user);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(prev => ({ ...prev, user: false }));
    }
  }
  
  useEffect(() => {
    fetchuser();
  }, [token, userId]);

  // Fetch chatted accounts
  async function fetchchattedaccount() {
    try {
      setLoading(prev => ({ ...prev, contacts: true }));
      const res = await axios.post(APIURL + "/fetchchats", { userId,search });
      if (res.status = 200) {
        const { chats } = res.data;
        setaccounts(chats);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(prev => ({ ...prev, contacts: false }));
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

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = [];
    const newPreviews = [];
    let processedCount = 0;

    files.forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        newImages.push(reader.result);
        newPreviews.push(URL.createObjectURL(file));
        processedCount++;
        
        if (processedCount === files.length) {
          setSelectedImages(prev => [...prev, ...newImages]);
          setImagePreview(prev => [...prev, ...newPreviews]);
        }
      };
    });
    
    // Reset file input
    e.target.value = '';
  };

  // Remove selected image
  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  // Send message using Socket.IO
  function chatwith() {
    if (message.trim() === "" && selectedImages.length === 0) return;
    if (!_id) return;
    
    // Check if socket is initialized
    if (!socket) {
      console.error("Socket connection not established");
      return;
    }
    
    setLoading(prev => ({ ...prev, sending: true }));
    
    // Emit message via socket
    socket.emit("send_message", {
      from: userId,
      to: _id,
      message: message,
      images: selectedImages
    });
    
    // Optimistically add message to UI
    const newMessage = {
      _id: Date.now().toString(),
      from: userId,
      to: _id,
      message: message,
      images: selectedImages,
      timestamp: new Date()
    };
    
    setchats(prevChats => [...prevChats, newMessage]);
    setmessage("");
    setSelectedImages([]);
    setImagePreview([]);
    
    // Clear file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
    
    // Also emit stop typing event
    socket.emit("stop_typing", { from: userId, to: _id });
    
    setTimeout(() => {
      setLoading(prev => ({ ...prev, sending: false }));
    }, 500);
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
      setLoading(prev => ({ ...prev, messages: true }));
      const res = await axios.post(APIURL + "/fetchmessage", { userId, _id });
      if (res.status = 200) {
        const { chats } = res.data;
        setchats(chats);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(prev => ({ ...prev, messages: false }));
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

  // Handle fullscreen image
  const openFullscreen = (imageSrc) => {
    setFullscreenImage(imageSrc);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  // Download image function
  const downloadImage = (imageSrc) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `chat-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Emoji data
  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
    '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
    '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
    '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈',
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
    '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏',
    '🙌', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
    '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
    '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐'
  ];

  // Add emoji to message
  const addEmoji = (emoji) => {
    setmessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

// console.log(formData);

  return (
    <div className="flex h-screen overflow-hidden gradient-light">
      {/* Sidebar/Contact List */}
      <div className="w-full sm:w-80 md:w-96 lg:w-1/3 xl:w-1/4 flex flex-col glass-effect border-r border-white/20 custom-scrollbar">
        {/* Header */}
        <div className="flex items-center p-2 sm:p-4 border-b border-white/20 gradient-primary">
            {formData?.profile ? (
          <motion.div 
            className='w-10 h-10 rounded-full mr-3 cursor-pointer ring-2 ring-white/50' 
            onClick={viweprofile}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
              <img className='w-full h-full object-cover rounded-full' src={formData?.profile} alt="" />
          </motion.div>
            )
             : (
              <motion.div 
                className='w-10 h-10 rounded-full mr-3 cursor-pointer ring-2 ring-white/50'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
              <img className='w-full h-full object-cover rounded-full' src="https://cdn-icons-png.flaticon.com/128/9408/9408175.png" alt="" />
          </motion.div>
            )}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              onChange={(e)=>setsearch(e.target.value)}
              className="w-full py-1 sm:py-2 pl-8 sm:pl-10 pr-2 sm:pr-4 text-xs sm:text-sm glass-effect border border-white/30 rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              placeholder="Search"
            />
          </div>
        </div>
        
        {/* Scrollable Conversation List */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {loading.user ? (
            <Loader size="lg" text="Loading profile..." />
          ) : profil ? 
            <motion.div 
              className="h-full p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full glass-effect rounded-2xl p-6 overflow-y-auto custom-scrollbar">
                {/* Profile Image */}
                <div className="flex flex-col items-center mb-6">
                  <motion.div 
                    className="w-32 h-32 rounded-full border-4 border-white/30 overflow-hidden mb-4 shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img 
                      src={formData?.profile || '/default-avatar.png'} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </motion.div> 
                  {/* Username */}
                  {showedit?
                    <input type="text" name="username" placeholder="Username"
                    onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} value={formData.username || ""} 
                    className="w-full px-4 py-2 glass-effect border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-gray-800 placeholder-gray-500"/>
                  :
                  <motion.h2 
                    className="text-xl font-semibold text-gray-800 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {formData.username || 'Username'}
                  </motion.h2>
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
                    className="w-full px-4 py-2 glass-effect border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-gray-800 placeholder-gray-500"/>
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
                    <motion.button 
                    onClick={() => saveChanges()} 
                      className="w-full gradient-success text-white hover:shadow-lg px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Save Profile</span>
                    </motion.button>
                    :
                    <motion.button 
                      onClick={()=>setShowedit(true)} 
                      className="w-full gradient-primary text-white hover:shadow-lg px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="text-sm font-medium">Edit Profile</span>
                    </motion.button>
                  }
                </div>
                
                {/* Logout Button */}
                <div className="mt-4">
                  <motion.button 
                    onClick={() => logOutuser()}
                    className="w-full gradient-secondary text-white hover:shadow-lg px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Log Out</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          :
            <div className="relative h-full pb-16">
              <div className='fixed bottom-4 right-4 z-10'>
                <motion.button 
                  onClick={() => showcontact(true)} 
                  className='w-12 sm:w-14 h-12 sm:h-14 gradient-primary rounded-full shadow-lg flex items-center justify-center'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <svg className='w-6 sm:w-7 h-6 sm:h-7 text-white' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/>
                  </svg>
                </motion.button>
              </div>
              
              {loading.contacts ? (
                <Loader size="md" text="Loading contacts..." />
              ) : accounts.length === 0 ? (
                <div className="text-center text-gray-500 p-8">
                  <p>No contacts found</p>
                </div>
              ) : (
                accounts.map((account, index) => (
                  <motion.div 
                key={index} 
                onClick={() => {
                  setid(account._id); 
                  setchatter(account);
                  // Clear message count for this contact
                  setMessageCounts(prev => ({ ...prev, [account._id]: 0 }));
                }}
                className="sidebar-item flex items-center p-2 sm:p-3 border-b border-white/10 glass-effect hover:bg-white/20 cursor-pointer transition-all duration-300 mx-1 sm:mx-2 my-1 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative mr-3">
                  <motion.img 
                    src={account.profile} 
                    alt="Profile" 
                    className="w-8 sm:w-10 h-8 sm:h-10 rounded-full ring-2 ring-white/30 shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  />
                  {/* Online indicator */}
                  {onlineUsers.includes(account._id) && (
                    <span className="online-indicator absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                  )}
                  {/* Message Count Badge */}
                  {messageCounts[account._id] > 0 && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      {messageCounts[account._id] > 9 ? '9+' : messageCounts[account._id]}
                    </motion.div>
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
                      className="text-xs sm:text-sm font-semibold text-gray-800 truncate"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {account.username}
                    </motion.p>
                    <motion.p 
                      className={`text-xs font-medium truncate hidden sm:block ${
                        onlineUsers.includes(account._id) 
                          ? 'text-green-600' 
                          : 'text-gray-500'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {onlineUsers.includes(account._id) ? 'online' : 'offline'}
                    </motion.p>
                  </div>
                  <motion.p 
                    className="text-xs sm:text-sm text-gray-600 truncate hidden sm:block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {account.email}
                  </motion.p>
                </motion.div>
                {/* Message Count Badge */}
                {messageCounts[account._id] > 0 && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {messageCounts[account._id] > 9 ? '9+' : messageCounts[account._id]}
                  </motion.div>
                )}
              </motion.div>
                ))
              )}
            </div>
          }
        </div>
      </div> 
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col glass-effect">
        {contact ?
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-2 sm:p-4 border-b border-white/20 gradient-primary">
              <motion.button 
                onClick={() => showcontact(false)} 
                className="flex items-center justify-center w-6 sm:w-8 h-6 sm:h-8 rounded-full glass-effect hover:bg-white/20 text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} className="sm:w-5 sm:h-5" />
              </motion.button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Newcontact />
            </div>
          </div>
        :
          <div className="flex flex-col h-full">
            {/* Chat header */}
            <motion.div 
              className="flex items-center px-2 sm:px-4 py-2 sm:py-3 border-b border-white/20 gradient-primary"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {chater && (
                <div className="flex items-center">
                  <div className="relative">
                    <img 
                      src={chater.profile || "/api/placeholder/40/40"} 
                      alt={chater.username} 
                      className="w-6 sm:w-8 h-6 sm:h-8 rounded-full mr-2 sm:mr-3 ring-2 ring-white/50" 
                    />
                    {/* Online indicator */}
                    {onlineUsers.includes(chater._id) && (
                      <span className="online-indicator absolute bottom-0 right-0 w-2 h-2 bg-green-400 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-semibold text-white">{chater.username}</h2>
                    <p className={`text-xs font-medium ${
                      onlineUsers.includes(chater._id) 
                        ? 'text-green-200' 
                        : 'text-gray-300'
                    }`}>
                      {onlineUsers.includes(chater._id) 
                        ? 'Online' 
                        : 'Offline'}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
            
            {/* Messages area - scrollable */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 custom-scrollbar">
              {chats && chats.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <p className="text-lg">No messages yet</p>
                    <p className="text-sm">Start the conversation!</p>
                  </div>
                </div>
              ) : (
                chats && chats.map((chat, index) => (
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
                        <motion.div 
                          className="message-bubble gradient-primary text-white rounded-2xl rounded-br-md p-2 sm:p-3 mb-1 max-w-xs sm:max-w-sm shadow-lg"
                          initial={{ opacity: 0, scale: 0.8, x: 20 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {chat.message && <p className="text-xs sm:text-sm mb-2">{chat.message}</p>}
                          {chat.images && chat.images.length > 0 && (
                            <div className="space-y-2">
                              {chat.images.map((image, imgIndex) => (
                                <motion.img
                                  key={imgIndex}
                                  src={image}
                                  alt="Shared image"
                                  className="w-full max-w-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.4, delay: imgIndex * 0.1 }}
                                  whileHover={{ scale: 1.02 }}
                                  onClick={() => openFullscreen(image)}
                                />
                              ))}
                            </div>
                          )}
                        </motion.div>
                        <span className="text-xs text-gray-500">
                          {new Date(chat.Date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}<br></br>
                          {new Date(chat.Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <img 
                          src={formData.profile || "/api/placeholder/32/32"} 
                          alt="You" 
                          className="w-6 sm:w-8 h-6 sm:h-8 rounded-full ring-2 ring-white/30 shadow-md" 
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
                          className="w-6 sm:w-8 h-6 sm:h-8 rounded-full ring-2 ring-white/30 shadow-md" 
                        />
                      </div>
                      <div className="flex flex-col">
                        <motion.div 
                          className="message-bubble glass-effect rounded-2xl rounded-bl-md p-2 sm:p-3 mb-1 max-w-xs sm:max-w-sm shadow-lg"
                          initial={{ opacity: 0, scale: 0.8, x: -20 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {chat.message && <p className="text-xs sm:text-sm text-gray-800 mb-2">{chat.message}</p>}
                          {chat.images && chat.images.length > 0 && (
                            <div className="space-y-2">
                              {chat.images.map((image, imgIndex) => (
                                <motion.img
                                  key={imgIndex}
                                  src={image}
                                  alt="Shared image"
                                  className="w-full max-w-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.4, delay: imgIndex * 0.1 }}
                                  whileHover={{ scale: 1.02 }}
                                  onClick={() => openFullscreen(image)}
                                />
                              ))}
                            </div>
                          )}
                        </motion.div>
                        <span className="text-xs text-gray-500">
                          {new Date(chat.Date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}<br></br>
                          {new Date(chat.Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
                ))
              )}
              
              {/* Typing indicator */}
              {_id && typingUsers[_id] && (
                <div className="flex mb-4">
                  <div className="mr-2 flex-shrink-0">
                    <img 
                      src={chater ? chater.profile : "/api/placeholder/32/32"} 
                      alt="Contact" 
                      className="w-8 h-8 rounded-full ring-2 ring-white/30 shadow-md" 
                    />
                  </div>
                  <div className="glass-effect rounded-2xl rounded-bl-md p-3 inline-flex items-center shadow-lg">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input section - fixed at bottom */}
            <motion.div 
              className="border-t border-white/20 p-2 sm:p-3 glass-effect"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {_id ? (
                <div className="flex flex-col">
                  {/* Image Preview */}
                  {imagePreview.length > 0 && (
                    <motion.div 
                      className="flex flex-wrap gap-2 p-2 mb-2 glass-effect rounded-xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {imagePreview.map((preview, index) => (
                        <motion.div 
                          key={index}
                          className="relative"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <img 
                            src={preview} 
                            alt="Preview" 
                            className="w-16 h-16 object-cover rounded-lg" 
                          />
                          <motion.button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            ×
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                  
                  <div className="flex items-center">
                    <motion.label 
                      htmlFor="image-upload"
                      className="p-1 sm:p-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Paperclip className="w-4 sm:w-5 h-4 sm:h-5" />
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </motion.label>
                  <input
                    type="text"
                    placeholder="Type your message"
                    onChange={handleTyping}
                    onKeyPress={handleKeyPress}
                    value={message}
                    className="chat-input flex-1 border-0 outline-none px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-transparent text-gray-800 placeholder-gray-500"
                  />
                  <div className="relative hidden sm:block">
                    <motion.button 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-1 sm:p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Smile className="w-4 sm:w-5 h-4 sm:h-5" />
                    </motion.button>
                    
                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                      <motion.div
                        className="absolute bottom-full right-0 mb-2 w-64 h-48 glass-effect rounded-xl p-3 shadow-xl border border-white/20 z-50"
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="grid grid-cols-8 gap-1 h-full overflow-y-auto custom-scrollbar">
                          {emojis.map((emoji, index) => (
                            <motion.button
                              key={index}
                              onClick={() => addEmoji(emoji)}
                              className="text-lg hover:bg-white/20 rounded p-1 transition-colors"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {emoji}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                    <motion.button 
                      onClick={chatwith} 
                      className="p-1 sm:p-2 gradient-primary rounded-full text-white hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center"
                      disabled={!message.trim() && selectedImages.length === 0 || loading.sending}
                      whileHover={{ scale: loading.sending ? 1 : 1.1 }}
                      whileTap={{ scale: loading.sending ? 1 : 0.9 }}
                    >
                      {loading.sending ? (
                        <motion.div
                          className="w-4 h-4 border-2 border-purple-300/50 border-t-purple-200 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <Send className="w-4 sm:w-5 h-4 sm:h-5" />
                      )}
                    </motion.button>
                  </div>
                </div>
              ) : (
                <motion.div 
                  className="text-center text-gray-600 py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center">
                      <Send className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-lg font-medium">Select a contact to start chatting</p>
                    <p className="text-sm text-gray-500">Choose someone from your contacts to begin a conversation</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        }
      </div>
      
      {/* Click outside to close emoji picker */}
      {showEmojiPicker && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowEmojiPicker(false)}
        />
      )}
      
      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <motion.div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeFullscreen}
        >
          <motion.div
            className="relative max-w-4xl max-h-full p-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-2 -right-2 flex gap-2 z-10">
              <motion.button
                onClick={() => downloadImage(fullscreenImage)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Download image"
              >
                <Download size={16} />
              </motion.button>
              <motion.button
                onClick={closeFullscreen}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Close"
              >
                <X size={20} />
              </motion.button>
            </div>
            <img
              src={fullscreenImage}
              alt="Fullscreen view"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;