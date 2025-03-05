import React from 'react';
import { Search, X, Check, Send, Paperclip, Smile } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200">
        {/* Sidebar Header */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <button className="mr-4">
            <div className="w-6 h-0.5 bg-gray-700 mb-1"></div>
            <div className="w-6 h-0.5 bg-gray-700 mb-1"></div>
            <div className="w-6 h-0.5 bg-gray-700"></div>
          </button>
          
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
        
        {/* Conversation List */}
        <div className="overflow-y-auto h-full">
          {/* Conversation Item 1 */}
          <div className="flex items-center p-3 border-b border-gray-100 bg-white hover:bg-gray-50">
            <div className="relative mr-3">
              <img src="/api/placeholder/40/40" alt="Bill Kuphal" className="w-10 h-10 rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <p className="text-sm font-semibold text-gray-900 truncate">Bill Kuphal</p>
                <p className="text-xs text-gray-500">9:41 AM</p>
              </div>
              <p className="text-sm text-gray-500 truncate">The weather will be perfect for th...</p>
            </div>
          </div>
          
          {/* Conversation Item 2 */}
          <div className="flex items-center p-3 border-b border-gray-100 bg-white hover:bg-gray-50">
            <div className="relative mr-3">
              <img src="/api/placeholder/40/40" alt="Photographers" className="w-10 h-10 rounded-full" />
              <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">80</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <p className="text-sm font-semibold text-gray-900 truncate">Photographers</p>
                <p className="text-xs text-gray-500">9:16 AM</p>
              </div>
              <p className="text-sm text-gray-500 truncate">Here're my latest drone shots</p>
            </div>
          </div>
          
          {/* Conversation Item 3 */}
          <div className="flex items-center p-3 border-b border-gray-100 bg-white hover:bg-gray-50">
            <div className="relative mr-3">
              <img src="/api/placeholder/40/40" alt="Group" className="w-10 h-10 rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <p className="text-sm font-semibold text-gray-900 truncate">Daryl Bogisich, Ian Daniel, +1</p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
              <div className="flex items-center">
                <p className="text-sm text-gray-500 truncate">You: Store is out of stock</p>
                <div className="ml-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10z"></path>
                    <line x1="9" y1="9" x2="15" y2="9"></line>
                    <line x1="9" y1="13" x2="15" y2="13"></line>
                    <line x1="9" y1="17" x2="13" y2="17"></line>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* More conversation items */}
          <div className="flex items-center p-3 border-b border-gray-100 bg-white hover:bg-gray-50">
            <div className="relative mr-3">
              <img src="/api/placeholder/40/40" alt="SpaceX" className="w-10 h-10 rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <p className="text-sm font-semibold text-gray-900 truncate">SpaceX Crew-16 Launch</p>
                <p className="text-xs text-gray-500">Thursday</p>
              </div>
              <p className="text-sm text-gray-500 truncate">I've been there!</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 border-b border-gray-100 bg-white hover:bg-gray-50">
            <div className="relative mr-3">
              <img src="/api/placeholder/40/40" alt="Lela" className="w-10 h-10 rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <p className="text-sm font-semibold text-gray-900 truncate">Lela Walsh</p>
                <p className="text-xs text-gray-500">12/22/21</p>
              </div>
              <p className="text-sm text-gray-500 truncate">Next time it's my turn!</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 border-b border-gray-100 bg-white hover:bg-gray-50">
            <div className="relative mr-3">
              <img src="/api/placeholder/40/40" alt="Roland" className="w-10 h-10 rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <p className="text-sm font-semibold text-gray-900 truncate">Roland Marks</p>
                <p className="text-xs text-gray-500">12/16/21</p>
              </div>
              <p className="text-sm text-gray-500 truncate">@waldo Glad to hear that 😊</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50 hover:bg-gray-100">
            <div className="relative mr-3">
              <img src="/api/placeholder/40/40" alt="Helen" className="w-10 h-10 rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-900 truncate">Helen Flatley</p>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-blue-500 mr-1" />
                  <p className="text-xs text-gray-500">12/13/21</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 truncate">You: Ok</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            <img src="/api/placeholder/40/40" alt="Bill" className="w-8 h-8 rounded-full mr-3" />
            <div>
              <h2 className="text-sm font-semibold">Bill Kuphal</h2>
              <p className="text-xs text-gray-500">Online for 10 mins</p>
            </div>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {/* Message with question */}
          <div className="flex mb-4">
            <div className="mr-2 flex-shrink-0">
              <img src="/api/placeholder/32/32" alt="Bill" className="w-8 h-8 rounded-full" />
            </div>
            <div className="flex flex-col">
              <div className="bg-gray-200 rounded-lg p-3 mb-1 max-w-xs">
                <p className="text-sm">Who was that philosopher you shared with me recently?</p>
              </div>
              <span className="text-xs text-gray-500">2:14 PM</span>
            </div>
          </div>
          
          {/* Reply */}
          <div className="flex justify-end mb-4">
            <div className="bg-blue-100 rounded-lg p-3 mb-1 max-w-xs text-right">
              <p className="text-sm">Roland Barthes</p>
            </div>
            <div className="ml-2 flex-shrink-0">
              <Check className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          
          <div className="text-xs text-gray-500 text-center mb-4">2:16 PM</div>
          
          {/* Message with response */}
          <div className="flex mb-4">
            <div className="mr-2 flex-shrink-0">
              <img src="/api/placeholder/32/32" alt="Bill" className="w-8 h-8 rounded-full" />
            </div>
            <div className="flex flex-col">
              <div className="bg-gray-200 rounded-lg p-3 mb-1 max-w-xs">
                <p className="text-sm">That's him!</p>
              </div>
              <span className="text-xs text-gray-500">2:18 PM</span>
            </div>
          </div>
          
          {/* Message with question */}
          <div className="flex mb-4">
            <div className="mr-2 flex-shrink-0">
              <img src="/api/placeholder/32/32" alt="Bill" className="w-8 h-8 rounded-full" />
            </div>
            <div className="flex flex-col">
              <div className="bg-gray-200 rounded-lg p-3 mb-1 max-w-xs">
                <p className="text-sm">What was his vision statement?</p>
              </div>
              <span className="text-xs text-gray-500">2:18 PM</span>
            </div>
          </div>
          
          {/* Reply with quote and image */}
          <div className="flex justify-end mb-4">
            <div className="bg-blue-100 rounded-lg p-3 mb-1 max-w-md">
              <p className="text-sm mb-2">"Ultimately in order to see a photograph well, it is best to look away or close your eyes."</p>
              <img src="/api/placeholder/300/180" alt="Eye photo" className="w-full h-auto rounded mb-2" />
              <p className="text-sm">Aerial photograph from the Helsinki urban environment division.</p>
            </div>
            <div className="ml-2 flex-shrink-0">
              <Check className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          
          <div className="text-xs text-gray-500 text-center mb-4">2:20 PM</div>
          
          {/* Message with image */}
          <div className="flex mb-4">
            <div className="mr-2 flex-shrink-0">
              <img src="/api/placeholder/32/32" alt="User" className="w-8 h-8 rounded-full" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center bg-gray-200 rounded-lg p-3 mb-1">
                <img src="/api/placeholder/40/40" alt="Thumbnail" className="w-10 h-10 rounded mr-2" />
                <p className="text-sm">Aerial photograph from the Helsinki urban environment division</p>
              </div>
              <span className="text-xs text-gray-500">2:22 PM</span>
            </div>
          </div>
          
          {/* Message with link */}
          <div className="flex mb-4">
            <div className="mr-2 flex-shrink-0">
              <img src="/api/placeholder/32/32" alt="Bill" className="w-8 h-8 rounded-full" />
            </div>
            <div className="flex flex-col">
              <div className="bg-gray-200 rounded-lg p-3 mb-1 max-w-xs">
                <p className="text-sm">Check this <span className="text-blue-500">https://dribbble.com</span></p>
              </div>
              <span className="text-xs text-gray-500">2:22 PM</span>
            </div>
          </div>
          
          {/* Image with video player */}
          <div className="mb-4">
            <div className="relative rounded-lg overflow-hidden">
              <img src="/api/placeholder/600/200" alt="Video thumbnail" className="w-full h-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 ml-1 border-transparent border-l-gray-800"></div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 bg-white px-3 py-1 m-2 rounded-full text-xs font-semibold">
                THE FIRST
              </div>
            </div>
          </div>
        </div>
        
        {/* Message Input */}
        <div className="border-t border-gray-200 p-3 bg-white">
          <div className="flex items-center">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              placeholder="Type your message"
              className="flex-1 border-0 outline-none px-3 py-2 text-sm"
            />
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Smile className="w-5 h-5" />
            </button>
            <button className="p-2 ml-1 bg-gray-200 rounded-full text-gray-500 hover:bg-gray-300">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;