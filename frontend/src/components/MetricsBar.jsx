// Complexity/Security/Maintainability cards
import React from 'react';
import { Activity, Shield, Wrench } from 'lucide-react';

const MetricCard = ({ icon: Icon, label, value, colorClass }) => (
  <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center gap-1 transition-all hover:bg-white/10">
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-tighter text-gray-400 font-bold">
      <Icon size={12} /> {label}
    </div>
    <div className={`text-sm font-bold ${colorClass}`}>{value}</div>
  </div>
);

const MetricsBar = ({ metrics }) => {
  if (!metrics) return null;
  
  return (
    <div className="flex gap-4 w-full max-w-3xl mt-2">
      <MetricCard icon={Activity} label="Complexity" value={metrics.complexity} colorClass="text-orange-400" />
      <MetricCard icon={Shield} label="Security" value={metrics.security} colorClass="text-blue-400" />
      <MetricCard icon={Wrench} label="Maintainability" value={metrics.maintainability} colorClass="text-emerald-400" />
    </div>
  );
};

export default MetricsBar;