import React from 'react';
import { Activity, Shield, Wrench } from 'lucide-react';

const getDynamicColor = (value) => {
  const val = value.toLowerCase();
  if (val.includes('n/a')) return 'text-gray-400 border-white/10';
  
  // Extract number if format is "8/10"
  const score = parseInt(val.split('/')[0]);
  
  if (score >= 8 || val.includes('high') || val.includes('low complexity')) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
  if (score >= 5 || val.includes('medium')) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5';
  return 'text-red-400 border-red-500/30 bg-red-500/5';
};

const MetricCard = ({ icon: Icon, label, value }) => {
  const colorStyles = getDynamicColor(value);
  
  return (
    <div className={`flex-1 backdrop-blur-md border rounded-xl p-3 flex flex-col items-center justify-center gap-1 transition-all ${colorStyles}`}>
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-tighter opacity-70 font-bold">
        <Icon size={12} /> {label}
      </div>
      <div className="text-sm font-black">{value}</div>
    </div>
  );
};

const MetricsBar = ({ metrics }) => {
  if (!metrics || metrics.complexity === "N/A") return null;
  
  return (
    <div className="flex gap-4 w-full max-w-3xl mt-2 animate-in fade-in zoom-in duration-500">
      <MetricCard icon={Activity} label="Complexity" value={metrics.complexity} />
      <MetricCard icon={Shield} label="Security" value={metrics.security} />
      <MetricCard icon={Wrench} label="Maintainability" value={metrics.maintainability} />
    </div>
  );
};

export default MetricsBar;