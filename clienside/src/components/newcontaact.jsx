import React, { useEffect, useState } from 'react';
import { Search, Users, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import APIURL from './path';
import Loader from './Loader';

const Newcontact = () => {
    const[contact,setcontact]=useState([])
    const[loading,setLoading]=useState(true)
    const[search,setsearch]=useState("")
    const userId=localStorage.getItem("userId")

    async function viewusers() {
        try {
          setLoading(true)
          const res=await axios.post(APIURL+"/viewusers",{search,userId})
        //   console.log(res);
          if (res.status=200) {
            const{contacts}=res.data
            setcontact(contacts)
          }
          
        } catch (error) {
          
        } finally {
          setLoading(false)
        }
      }
    useEffect(()=>{
        viewusers()
    },[search])
    console.log(contact);
    console.log(search);
    async function addchattedaccounts(_id) {
        try {
            console.log(_id);
          const res=await axios.post(APIURL+"/chattedaccount",{userId,_id})
            // console.log(res);
            window.location.reload()
            
        } catch (error) {
            
        }
    }

  return (
    <motion.div 
      className="flex flex-col h-screen glass-effect text-gray-800 custom-scrollbar"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Title */}
      <motion.div 
        className="p-2 sm:p-4 font-semibold text-lg sm:text-xl text-white gradient-primary rounded-t-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        New chat
      </motion.div>

      {/* Search Bar */}
      <motion.div 
        className="px-2 sm:px-4 pb-2 sm:pb-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="glass-effect rounded-xl flex items-center p-2 sm:p-3 border border-white/20">
          <Search size={16} className="sm:w-5 sm:h-5 text-gray-600 ml-1 sm:ml-2" />
          <input 
            type="text" 
            placeholder="Search name or number" 
            onChange={(e)=>setsearch(e.target.value)}
            className="chat-input bg-transparent border-none outline-none px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-800 w-full placeholder-gray-500"
          />
          <motion.button 
            className="text-gray-600 p-1 hover:text-gray-800 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </motion.button>
        </div>
        <motion.div 
          className="border-b-2 gradient-primary mt-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.5, delay: 0.3 }}
        ></motion.div>
      </motion.div>

      {/* New Group */}
      <motion.div 
        className="flex items-center p-2 sm:p-3 mx-1 sm:mx-2 rounded-xl glass-effect hover:bg-white/20 cursor-pointer transition-all duration-300 sidebar-item"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        whileHover={{ scale: 1.02, x: 5 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div 
          className="w-10 sm:w-12 h-10 sm:h-12 gradient-success rounded-full flex items-center justify-center mr-2 sm:mr-3 shadow-lg"
          whileHover={{ rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Users size={20} className="sm:w-6 sm:h-6 text-white" />
        </motion.div>
        <span className="text-sm sm:text-base text-gray-800 font-medium">New group</span>
      </motion.div>

      {/* All Contacts Section */}
      <motion.div 
        className="p-2 sm:p-3 text-gray-600 text-xs sm:text-sm font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        All contacts
      </motion.div>
      
      {loading ? (
        <Loader size="md" text="Loading contacts..." />
      ) : contact.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          <p>No contacts found</p>
        </div>
      ) : (
        contact.map((contact,index)=>(
        <motion.div 
          key={index} 
          onClick={()=>addchattedaccounts(contact._id)} 
          className="sidebar-item flex items-center p-2 sm:p-3 mx-1 sm:mx-2 my-1 rounded-xl glass-effect hover:bg-white/20 cursor-pointer transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="w-10 sm:w-12 h-10 sm:h-12 rounded-full mr-2 sm:mr-3 overflow-hidden ring-2 ring-white/30 shadow-lg"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img src={contact.profile} alt={contact.username} className="w-full h-full object-cover" />
          </motion.div>
          <div className="flex flex-col flex-grow">
            <motion.span 
              className="text-sm sm:text-base text-gray-800 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              {contact.username}
            </motion.span>
            {contact.email && 
              <motion.span 
                className="text-gray-600 text-xs sm:text-sm hidden sm:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                {contact.email}
              </motion.span>
            }
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
          >
            <ChevronRight size={16} className="sm:w-5 sm:h-5 text-gray-500" />
          </motion.div>
        </motion.div>
        ))
      )}

      
      {/* Footer */}
      <motion.div 
        className="mt-auto p-2 sm:p-4 text-center text-gray-600 text-xs sm:text-sm glass-effect rounded-b-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.9 }}
      >
        Connect and chat with your contacts
      </motion.div>
    </motion.div>
  );
};

export default Newcontact;