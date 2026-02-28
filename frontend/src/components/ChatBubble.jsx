import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Code2, Terminal } from 'lucide-react';

const ChatBubble = ({ role, content, language }) => {
  const isUser = role === 'user';
  const displayLang = language && language !== 'N/A' ? language.toUpperCase() : null;

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-10 relative group`}>
      
      {/* 1. FLOATING LANGUAGE BADGE */}
      {!isUser && displayLang && (
        <div className="absolute -top-3 left-6 px-2.5 py-1 bg-blue-600 rounded-md flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] z-20 border border-white/20 animate-in zoom-in duration-300">
          <Code2 size={10} className="text-white" />
          <span className="text-[9px] font-black tracking-widest text-white">
            {displayLang}
          </span>
        </div>
      )}

      {/* 2. THE BUBBLE CONTAINER */}
      <div className={`max-w-[92%] md:max-w-[85%] px-7 py-6 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-700
        ${isUser 
          ? 'bg-blue-600/80 border-white/20 rounded-tr-none text-white ml-12' 
          : 'bg-[#0d0f16]/80 border-white/10 rounded-tl-none text-gray-200 mr-12'}`}>
        
        {/* 3. AI HEADER TAG */}
        {!isUser && (
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/5">
            <div className="flex items-center gap-2.5">
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-blue-400/30 rounded-full"></div>
                </div>
                <div className="text-[9px] uppercase font-black tracking-[0.4em] text-blue-400/90">
                    Neural Intelligence Briefing
                </div>
            </div>
            <Terminal size={10} className="text-gray-600" />
          </div>
        )}

        {/* 4. STRUCTURED MARKDOWN CONTENT */}
        <div className="text-[13px] leading-[1.8] prose prose-invert max-w-none">
          <ReactMarkdown
            components={{
              // STYLING HEADERS AS "MODULES"
              h3: ({node, ...props}) => (
                <h3 className="text-white font-black text-[11px] tracking-[0.25em] uppercase mt-8 mb-4 flex items-center gap-3 
                               bg-white/5 py-2 px-3 rounded-r-lg border-l-2 border-blue-500 w-fit" {...props} />
              ),
              // STYLING BOLD AS "HIGHLIGHTS"
              strong: ({node, ...props}) => (
                <span className="text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]" {...props} />
              ),
              // STYLING LISTS AS "TECHNICAL AUDITS"
              li: ({node, ...props}) => (
                <li className="list-none mb-3 relative pl-6 text-gray-300 before:content-['⚡'] before:absolute before:left-0 before:text-[10px] before:top-1 before:opacity-50" {...props} />
              ),
              // STYLING PARAGRAPHS
              p: ({node, ...props}) => (
                <p className="mb-5 text-gray-400 font-medium last:mb-0 selection:bg-blue-500/30" {...props} />
              ),
              // CUSTOM DIVIDER
              hr: () => <hr className="border-white/5 my-8 shadow-sm" />,
              // BLOCKQUOTE STYLING
              blockquote: ({node, ...props}) => (
                <div className="border-l-2 border-gray-700 pl-4 py-1 italic text-gray-500 my-4" {...props} />
              )
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