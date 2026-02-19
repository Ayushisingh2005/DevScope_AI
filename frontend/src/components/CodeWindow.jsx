// Syntax highlighted code block
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeWindow = ({ code }) => {
  if (!code) return null;

  return (
    <div className="w-full max-w-3xl my-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#12141c]/90 backdrop-blur-xl">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/5">
        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
        <span className="text-[10px] text-gray-500 ml-2 font-mono">devscope_output.py</span>
      </div>
      <SyntaxHighlighter 
        language="python" 
        style={atomDark}
        customStyle={{
          background: 'transparent',
          padding: '20px',
          margin: 0,
          fontSize: '13px',
          lineHeight: '1.6'
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeWindow;