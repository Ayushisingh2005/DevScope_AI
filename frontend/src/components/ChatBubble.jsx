// User & AI message styles
import React from 'react';

const ChatBubble = ({ role, content }) => {
  const isUser = role === 'user';
  
  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4`}>
      <div className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-xl backdrop-blur-md border 
        ${isUser 
          ? 'bg-blue-600/80 border-white/20 rounded-tr-none' 
          : 'bg-white/5 border-white/10 rounded-tl-none text-gray-200'}`}>
        
        {!isUser && (
          <div className="flex gap-1 mb-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
        <p className="text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
};

export default ChatBubble;