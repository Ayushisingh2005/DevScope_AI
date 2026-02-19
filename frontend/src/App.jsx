import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Component Imports
import Starfield from './components/Starfield';
import Sidebar from './components/Sidebar';
import ChatBubble from './components/ChatBubble';
import CodeWindow from './components/CodeWindow';
import MetricsBar from './components/MetricsBar';
import InputArea from './components/InputArea';
import IssueGraph from './components/IssueGraph';

const App = () => {
  // --- STATE MANAGEMENT ---
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      output: 'Welcome to DevScope AI. I am ready to analyze your code functions, complexity, and security vulnerabilities. Upload a file or type a query to begin.',
    }
  ]);
  const [input, setInput] = useState("");
  const [graphData, setGraphData] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedFile, setSelectedFile] = useState(null); // NEW: Holds the file before sending

  const scrollRef = useRef(null);
  const graphRef = useRef(null);

  // --- SIDEBAR ACTION HANDLER ---
  const handleSidebarAction = (id) => {
    setActiveTab(id);

    if (id === 'dashboard') {
      setMessages([{ role: 'ai', output: 'Dashboard reset. How can I help you with your code today?' }]);
    }

    if (id === 'analytics') {
      const element = document.getElementById('analytics-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    if (id === 'upload') {
      // Triggers the hidden file input
      document.getElementById('sidebar-file-trigger').click();
    }

    if (id === 'history') {
      fetchHistory();
      alert("Analysis history refreshed from database.");
    }
  };

  // --- DATA FETCHING ---
  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:8000/history');
      // FIXED: Removed the incorrect axios.post call that was here
      setGraphData(res.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  // --- FILE HANDLING (Attach only, don't upload yet) ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Optional: Visual feedback that file is attached
      setMessages(prev => [...prev, { role: 'ai', output: `📎 Attached: ${file.name}. You can now type your query and hit Send.` }]);
    }
  };

  // --- SEND LOGIC (Combines Text + File) ---
  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;

    setActiveTab('chat');
    
    // UI: Create the user message
    const userText = input.trim() || (selectedFile ? `Analyzing file: ${selectedFile.name}` : "");
    const userMessage = { role: 'user', content: userText };
    setMessages(prev => [...prev, userMessage]);
    
    // Capture current states to send
    const currentInput = input;
    const currentFile = selectedFile;

    // Reset inputs immediately for better UX
    setInput("");
    setSelectedFile(null);
    setIsTyping(true);

    const formData = new FormData();
    formData.append('query', currentInput || "Analyze this code.");
    if (currentFile) {
      formData.append('file', currentFile);
    }

    try {
      const res = await axios.post('http://localhost:8000/analyze', formData);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        output: res.data.output,
        code: res.data.code,
        metrics: {
          complexity: res.data.complexity,
          security: res.data.security,
          maintainability: res.data.maintainability
        }
      }]);
      
      // Wait a moment for DB to save then refresh graph
      setTimeout(() => fetchHistory(), 500);
      
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', output: 'Error: Could not connect to the AI engine.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Auto-scroll logic
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    console.log("graphData has changed:", graphData);
  }, [graphData]);

  return (
    <div className="relative min-h-screen flex bg-[#050505] text-white font-sans overflow-hidden">
      <Starfield />

      <Sidebar onAction={handleSidebarAction} activeTab={activeTab} />

      <main className="flex-1 flex flex-col z-10 relative overflow-hidden">
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 pb-40">
          <div className="max-w-4xl mx-auto w-full space-y-8">
            
            {messages.map((msg, idx) => (
              <div key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ChatBubble role={msg.role} content={msg.role === 'user' ? msg.content : msg.output} />
                
                {msg.role === 'ai' && msg.code && (
                  <div className="ml-0 md:ml-4 mt-4 space-y-4">
                    <CodeWindow code={msg.code} />
                    <MetricsBar metrics={msg.metrics} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-blue-400 text-sm italic animate-pulse">
                <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span>DevScope AI is analyzing...</span>
              </div>
            )}

            {/* ANALYTICS SECTION */}
            <div id="analytics-section" className="w-full relative py-10">
                <IssueGraph data={graphData} />
            </div>
            
            <div ref={scrollRef} />
          </div>
        </div>

        {/* Hidden Input specifically for Sidebar 'Upload' button trigger */}
        <input 
          id="sidebar-file-trigger" 
          type="file" 
          className="hidden" 
          onChange={handleFileChange} 
        />

        {/* UPDATED INPUT AREA CALL */}
        <InputArea 
          input={input} 
          setInput={setInput} 
          onSend={handleSend} 
          onFileChange={handleFileChange} 
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      </main>

      <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
    </div>
  );
};

export default App;