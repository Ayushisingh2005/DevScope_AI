import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const IssueGraph = ({ data }) => {
  // If data exists, this will print in your F12 console
  console.log("Graph is rendering with data:", data);

  return (
    <div className="w-full mt-10 mb-20 animate-in fade-in duration-1000">
      <div className="bg-[#0a0a0c]/80 border border-white/10 p-6 rounded-2xl backdrop-blur-xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            System Stability / Issue Trend
          </h3>
          {data.length > 0 && (
            <span className="text-[10px] text-gray-500">Points: {data.length}</span>
          )}
        </div>

        {/* WE FORCE A HEIGHT OF 300px HERE */}
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#444" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#444" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{backgroundColor: '#050505', border: '1px solid #1e293b', borderRadius: '12px'}}
              />
              <Area 
                type="monotone" 
                dataKey="issues" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorIssues)" 
                dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#000' }}
                activeDot={{ r: 8 }}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default IssueGraph;