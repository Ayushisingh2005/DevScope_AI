// frontend/src/components/Sidebar.jsx
import React from 'react';
import { LayoutDashboard, BarChart3, Upload, MessageSquare, History } from 'lucide-react';

const Sidebar = ({ onAction, activeTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'analytics', icon: BarChart3 },
    { id: 'upload', icon: Upload },
    { id: 'chat', icon: MessageSquare },
    { id: 'history', icon: History },
  ];

  return (
    // CHANGED: fixed top-0 left-0 h-full
    <aside className="fixed top-0 left-0 h-full w-20 border-r border-white/10 bg-black/40 backdrop-blur-xl flex flex-col items-center py-8 gap-10 z-50">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onAction(item.id)}
          className={`p-3 rounded-xl transition-all duration-300 ${
            activeTab === item.id 
            ? 'bg-blue-600/20 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-blue-400' 
            : 'text-gray-500 hover:text-white hover:bg-white/5'
          }`}
        >
          <item.icon size={24} />
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;