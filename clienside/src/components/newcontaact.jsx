import React, { useEffect, useState } from 'react';
import { Search, Users, ChevronRight } from 'lucide-react';
import axios from 'axios';
import APIURL from './path';

const Newcontact = () => {
    const[contact,setcontact]=useState([])

    const[search,setsearch]=useState("")
    const userId=localStorage.getItem("userId")

    async function viewusers() {
        try {
          const res=await axios.post(APIURL+"/viewusers",{search,userId})
        //   console.log(res);
          if (res.status=200) {
            const{contacts}=res.data
            setcontact(contacts)
          }
          
        } catch (error) {
          
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
            
        } catch (error) {
            
        }
    }

  return (
    <div className="flex flex-col h-screen bg-white text-gray-800">
      {/* Title */}
      <div className="p-4 font-semibold text-xl text-gray-800">
        New chat
      </div>

      {/* Search Bar */}
      <div className="px-4 pb-3">
        <div className="bg-gray-100 rounded-lg flex items-center p-2">
          <Search size={20} className="text-gray-500 ml-2" />
          <input 
            type="text" 
            placeholder="Search name or number" 
            onChange={(e)=>setsearch(e.target.value)}
            className="bg-transparent border-none outline-none px-3 py-1 text-gray-800 w-full"
          />
          <button className="text-gray-500 p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
        </div>
        <div className="border-b border-green-500 mt-1"></div>
      </div>

      {/* New Group */}
      <div className="flex items-center p-3 hover:bg-gray-100 cursor-pointer">
        <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mr-3">
          <Users size={24} className="text-white" />
        </div>
        <span className="text-gray-800 font-medium">New group</span>
      </div>

      {/* Frequently Contacted Section */}
      <div className="p-3 text-gray-500 text-sm">
        All contacts

      </div>
        {contact.map((contact,index)=>(
        <div key={index} onClick={()=>addchattedaccounts(contact._id)} className="flex items-center p-3 hover:bg-gray-100 cursor-pointer">
          <div className="w-12 h-12 rounded-full mr-3 overflow-hidden">
            <img src={contact.profile} alt={contact.username} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col flex-grow">
            <span className="text-gray-800 font-medium">{contact.username}</span>
            {contact.email && <span className="text-gray-500 text-sm">{contact.email}</span>}
          </div>
          {index === 0 && <ChevronRight size={20} className="text-gray-500" />}
        </div>
      ))}

      
      {/* Footer */}
      <div className="mt-auto p-4 text-center text-gray-500 text-sm">
        Send and receive messages with WhatsApp
      </div>
    </div>
  );
};

export default Newcontact;