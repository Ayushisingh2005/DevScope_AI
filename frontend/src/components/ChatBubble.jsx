import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Code2 } from 'lucide-react';

const ChatBubble = ({ role, content, language }) => {
  const isUser = role === 'user';
  const displayLang = language && language !== 'N/A' ? language.toUpperCase() : null;

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-8 relative group`}>
      
      {!isUser && displayLang && (
        <div className="absolute -top-3 left-4 px-2 py-1 bg-blue-600 rounded-md flex items-center gap-1.5 shadow-lg shadow-blue-500/40 z-10 border border-white/20 animate-in zoom-in duration-300">
          <Code2 size={10} className="text-white" />
          <span className="text-[9px] font-black tracking-widest text-white">
            {displayLang}
          </span>
        </div>
      )}

      <div className={`max-w-[90%] md:max-w-[85%] px-6 py-5 rounded-2xl shadow-2xl backdrop-blur-md border transition-all duration-500
        ${isUser 
          ? 'bg-blue-600/90 border-white/20 rounded-tr-none text-white' 
          : 'bg-[#0d0f16]/90 border-white/5 rounded-tl-none text-gray-200'}`}>
        
        {!isUser && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-blue-400/50 rounded-full"></div>
            </div>
            <div className="text-[10px] uppercase font-black tracking-[0.3em] text-blue-400/80">
                DevScope Intelligence Portal
            </div>
          </div>
        )}

        <div className="text-[13px] leading-relaxed prose prose-invert max-w-none">
          <ReactMarkdown
            components={{
              // CUSTOM HEADER STYLING
              h3: ({node, ...props}) => (
                <h3 className="text-blue-400 font-black text-[11px] tracking-[0.2em] uppercase mt-6 mb-3 flex items-center gap-2 border-l-2 border-blue-500 pl-3" {...props} />
              ),
              // CUSTOM BOLD STYLING
              strong: ({node, ...props}) => (
                <span className="text-white font-bold bg-white/5 px-1 rounded" {...props} />
              ),
              // CUSTOM LIST STYLING
              li: ({node, ...props}) => (
                <li className="list-none mb-2 relative pl-5 before:content-['▹'] before:absolute before:left-0 before:text-blue-500" {...props} />
              ),
              // CUSTOM DIVIDER
              hr: () => <hr className="border-white/5 my-6" />,
              // PARAGRAPH SPACING
              p: ({node, ...props}) => <p className="mb-4 text-gray-400 last:mb-0" {...props} />
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;