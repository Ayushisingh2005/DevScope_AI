// Text input & File upload button
import React from 'react';
import { Send, Paperclip } from 'lucide-react';

// const InputArea = ({ input, setInput, onSend, onFileUpload }) => {
//   return (
//     <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-50">
//       <div className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
//         <label className="p-3 text-gray-400 hover:text-white cursor-pointer transition-colors rounded-xl hover:bg-white/5">
//           <Paperclip size={20} />
//           <input type="file" className="hidden" onChange={onFileUpload} />
//         </label>
const InputArea = ({ input, setInput, onSend, onFileChange, selectedFile, setSelectedFile }) => {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-50">
            {/* Added: Attachment Preview Badge */}
            {selectedFile && (
                <div className="mb-2 flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 w-fit px-3 py-1 rounded-full text-[10px] text-blue-400">
                    <span>📎 {selectedFile.name}</span>
                    <button onClick={() => setSelectedFile(null)} className="hover:text-white ml-1">×</button>
                </div>
            )}
            
            <div className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 flex items-center gap-4">
                <label className="p-3 text-gray-400 hover:text-white cursor-pointer transition-colors rounded-xl hover:bg-white/5">
                    <Paperclip size={20} />
                    <input type="file" className="hidden" onChange={onFileChange} />
                </label>

        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          placeholder="Send a message or upload a code file..." 
          className="bg-transparent flex-1 outline-none text-sm text-gray-200 placeholder:text-gray-600"
        />

        <button 
          onClick={onSend}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-95"
        >
          <Send size={18} />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </div>
  );
};

export default InputArea;