import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Terminal, Shield, Zap, Cpu, Activity, Clock, MessageSquare, ChevronRight, ArrowLeft } from 'lucide-react';
import Starfield from './components/Starfield';
import Sidebar from './components/Sidebar';
import ChatBubble from './components/ChatBubble';
import CodeWindow from './components/CodeWindow';
import MetricsBar from './components/MetricsBar';
import InputArea from './components/InputArea';
import IssueGraph from './components/IssueGraph';

// DYNAMIC API URL: This looks for the Railway URL, otherwise defaults to local
const API_URL = import.meta.env.VITE_API_URL || "https://devscope-ai-2.onrender.com";
const App = () => {
  const [messages, setMessages] = useState([{ role: 'ai', output: "Neural Node Active. DevScope AI standing by." }]);
  const [input, setInput] = useState("");
  const [graphData, setGraphData] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); 
  const [historyItems, setHistoryItems] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const scrollRef = useRef(null);

  const fetchGraphData = async () => {
    try {
      const res = await axios.get(`${API_URL}/history`);
      setGraphData(res.data || []);
    } catch (err) { console.error("Metrics Fetch Error", err); }
  };

  const fetchChatHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/chat-history`);
      const sessions = res.data?.filter(m => m.role === 'user') || [];
      setHistoryItems(sessions);
      setActiveTab('history');
    } catch (err) { console.error("History Fetch Error", err); }
  };

  const handleSidebarAction = (id) => {
    if (id === 'dashboard') {
      setMessages([{ role: 'ai', output: "Portal Reset. Memory is fresh." }]);
      setActiveTab('chat'); setShowAnalytics(false);
    }
    if (id === 'history') fetchChatHistory();
    if (id === 'upload') document.getElementById('sidebar-file-trigger')?.click();
  };

  const handleSend = async (forcedQuery = null) => {
    const finalInput = forcedQuery || input;
    if (!finalInput.trim() && !selectedFile) return;

    // Scrub context logic (Kept exactly as requested)
    const ctx = messages.map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.role === 'ai' ? m.output.substring(0, 200) : m.content.substring(0, 200)
    })).slice(-2);

    setActiveTab('chat');
    setMessages(p => [...p, { role: 'user', content: selectedFile ? `File Audit: ${selectedFile.name}` : finalInput }]);
    setInput(""); setIsTyping(true);

    const formData = new FormData();
    formData.append('query', finalInput || "Analysis requested");
    formData.append('context_json', JSON.stringify(ctx));
    if (selectedFile) formData.append('file', selectedFile);

    try {
      const res = await axios.post(`${API_URL}/analyze`, formData);
      const aiResponse = { 
        role: 'ai', 
        output: res.data?.output || "Report finalized.", 
        code: res.data?.code,
        metrics: { 
            complexity: res.data?.complexity || 'N/A', 
            security: res.data?.security || 'N/A', 
            maintainability: res.data?.maintainability || 'N/A' 
        }
      };
      setMessages(p => [...p, aiResponse]);
      if (res.data?.code) { 
          setShowAnalytics(true); 
          setTimeout(fetchGraphData, 600); 
      }
    } catch (err) {
      setMessages(p => [...p, { role: 'ai', output: "### ❌ Neural Sync Failed\nReset using the dashboard." }]);
    } finally { setIsTyping(false); setSelectedFile(null); }
  };

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  return (
    <div className="relative min-h-screen flex bg-[#010103] text-white font-sans overflow-hidden">
      <Starfield /><Sidebar onAction={handleSidebarAction} activeTab={activeTab} />
      <main className="flex-1 pl-20 flex flex-col z-10 relative h-screen">
        <div className="w-full py-3 px-8 bg-black/40 border-b border-white/5 flex justify-between items-center z-30">
          <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Node: Active</span>
          </div>
          <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Llama-3.3-70B • 480MS</div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-5xl mx-auto w-full px-6 md:px-12 pt-10 pb-40">
            {activeTab === 'history' ? (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-4xl font-black mb-12 flex items-center gap-4 text-white"><Clock className="text-blue-500" size={32} /> Archive</h2>
                <div className="grid grid-cols-1 gap-4">
                  {historyItems.map((item, idx) => (
                    <button key={idx} onClick={() => { setMessages([{role:'user', content:item.content}, {role:'ai', output: "Context Restored."}]); setActiveTab('chat'); }}
                      className="group bg-[#0a0c14] border border-white/5 rounded-2xl p-6 text-left transition-all hover:border-blue-500/40">
                      <div className="flex items-center gap-4">
                        <MessageSquare size={16} className="text-blue-500 opacity-40" />
                        <h3 className="text-lg font-bold text-gray-200">{item?.content?.substring(0, 70)}...</h3>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                {messages.length === 1 && !isTyping && (
                  <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in">
                    <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-700 mb-8 drop-shadow-[0_0_30px_rgba(59,130,246,0.4)]">DevScopeAI</h1>
                    <div className="grid grid-cols-24 gap-2 p-5 bg-white/[0.01] border border-white/5 rounded-3xl mb-12 shadow-2xl backdrop-blur-sm max-w-4xl">
                      {[...Array(96)].map((_, i) => ( <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#ef4444', '#22c55e', '#3b82f6'][i%3], animation: `twinkle ${1.5 + Math.random() * 2}s infinite ease-in-out` }} /> ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-4">
                      {[{ label: "Security", icon: Shield, prompt: "Perform a security audit: " }, { label: "Optimize", icon: Zap, prompt: "Optimize this: " }, { label: "Architect", icon: Cpu, prompt: "Review architecture: " }, { label: "Analyze", icon: Terminal, prompt: "Deep analyze: " }].map((item, i) => (
                        <button key={i} onClick={() => handleSend(item.prompt)} className="group p-6 bg-white/[0.03] border border-white/10 rounded-2xl flex flex-col items-start gap-4 hover:bg-blue-600/10 hover:border-blue-500 transition-all text-left">
                            <item.icon size={22} className="text-blue-500 group-hover:scale-110 transition-transform" />
                            <div><span className="block text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">{item.label}</span><span className="block text-xs text-gray-500 italic">Launch Scan</span></div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-12">
                  {messages.map((msg, i) => (
                    <div key={i} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <ChatBubble role={msg.role} content={msg.role === 'user' ? msg.content : msg.output} />
                      {msg.role === 'ai' && msg.code && <div className="md:ml-12 mt-8 space-y-8 border-l border-white/5 pl-8"><CodeWindow code={msg.code} /><MetricsBar metrics={msg.metrics} /></div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {isTyping && <div className="flex items-center gap-4 mt-12 ml-6 text-[9px] font-black text-blue-500 uppercase tracking-widest animate-pulse">Decoding...</div>}
            {showAnalytics && activeTab === 'chat' && <div className="py-32 border-t border-white/5 mt-20"><IssueGraph data={graphData} /></div>}
            <div ref={scrollRef} className="h-40" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#010103] via-[#010103] to-transparent z-40">
            <div className="max-w-4xl mx-auto"><InputArea input={input} setInput={setInput} onSend={() => handleSend()} selectedFile={selectedFile} setSelectedFile={setSelectedFile} /></div>
        </div>
      </main>
      <input id="sidebar-file-trigger" type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />
      <style>{`.grid-cols-24 { grid-template-columns: repeat(24, minmax(0, 1fr)); } @keyframes twinkle { 0%, 100% { opacity: 0.1; } 50% { opacity: 1; } }`}</style>
    </div>
  );
};
export default App;
