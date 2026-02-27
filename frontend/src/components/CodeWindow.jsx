import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Clipboard, Check } from 'lucide-react';

const CodeWindow = ({ code }) => {
  const [copied, setCopied] = useState(false);
  if (!code) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl my-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#12141c]/90 backdrop-blur-xl group">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
        </div>
        <button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors">
          {copied ? <Check size={14} className="text-green-400" /> : <Clipboard size={14} />}
        </button>
      </div>
      <SyntaxHighlighter language="python" style={atomDark} customStyle={{ background: 'transparent', padding: '20px', margin: 0, fontSize: '13px' }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeWindow;