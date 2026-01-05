
import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { DASHBOARD_CARDS } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Target, MoreHorizontal, ArrowUpRight } from 'lucide-react';

const DATA = [
  { name: 'Mon', value: 400, secondary: 240 },
  { name: 'Tue', value: 300, secondary: 139 },
  { name: 'Wed', value: 600, secondary: 980 },
  { name: 'Thu', value: 800, secondary: 390 },
  { name: 'Fri', value: 500, secondary: 480 },
  { name: 'Sat', value: 900, secondary: 380 },
  { name: 'Sun', value: 1100, secondary: 430 },
];

// A sophisticated, energetic yet minimalist palette
const COLORS = ['#2563eb', '#0891b2', '#059669', '#7c3aed', '#db2777'];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex justify-between items-end border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back to Chau. Here's your performance summary.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-3 py-1.5 rounded-attio bg-white border border-gray-200 text-xs font-medium hover:bg-gray-50 transition-colors">Export Data</button>
           <button className="px-4 py-1.5 rounded-attio bg-black text-white text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm">Quick Add</button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DASHBOARD_CARDS.map((card, i) => (
          <GlassCard key={i} className="flex flex-col group p-5 hover:border-black/10">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{card.title}</span>
              <div className="text-gray-300 group-hover:text-black transition-colors">
                {React.cloneElement(card.icon as React.ReactElement, { size: 16 })}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-semibold text-gray-900">{card.value}</h3>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">{card.trend}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2 min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-semibold text-gray-900">Deal Velocity</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-200"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target</span>
               </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#999999'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#999999'}} />
                <Tooltip 
                  cursor={{ stroke: '#e5e5e5', strokeWidth: 1 }}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '4px', 
                    border: '1px solid #e5e5e5',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    padding: '8px 12px'
                  }} 
                />
                <Area type="monotone" dataKey="secondary" stroke="#dbeafe" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPrimary)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="min-h-[400px]">
          <h3 className="text-sm font-semibold text-gray-900 mb-8 text-center uppercase tracking-widest">Pipeline Weight</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA.slice(0, 5)}>
                <XAxis dataKey="name" hide />
                <Tooltip cursor={{fill: '#fcfcfc'}} contentStyle={{ borderRadius: '4px', border: '1px solid #eee' }} />
                <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                  {DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard className="p-0 overflow-hidden">
           <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Timeline</h3>
             <button className="text-xs text-gray-500 hover:text-black transition-colors font-medium">History</button>
           </div>
           <div className="divide-y divide-gray-100">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="flex gap-4 items-center p-4 hover:bg-gray-50/50 transition-colors">
                 <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                 <div className="flex-1">
                   <p className="text-xs text-gray-900 font-medium">Sarah Chen <span className="text-gray-400 font-normal">updated</span> <span className="underline decoration-gray-200">Proposal</span></p>
                   <p className="text-[10px] text-gray-400 mt-0.5">2 hours ago • Nexus Tech</p>
                 </div>
                 <ArrowUpRight size={14} className="text-gray-300" />
               </div>
             ))}
           </div>
        </GlassCard>

        <GlassCard className="p-0 overflow-hidden">
           <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Top Closers</h3>
             <MoreHorizontal size={14} className="text-gray-400" />
           </div>
           <div className="p-4 space-y-6">
             {['John Doe', 'Jane Smith', 'Bob Wilson'].map((name, i) => (
               <div key={i} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-sm bg-gray-100 border border-gray-200 overflow-hidden">
                     <img src={`https://picsum.photos/seed/${name}/40`} className="w-full h-full object-cover opacity-90" />
                   </div>
                   <span className="text-xs font-semibold text-gray-700">{name}</span>
                 </div>
                 <div className="flex items-center gap-4">
                   <div className="w-32 bg-gray-50 rounded-full h-1 overflow-hidden">
                     <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${80 - i * 15}%`, backgroundColor: COLORS[i % COLORS.length] }}></div>
                   </div>
                   <span className="text-[10px] font-bold text-gray-500 w-12 text-right">{24 - i * 5} Deals</span>
                 </div>
               </div>
             ))}
           </div>
        </GlassCard>
      </div>
    </div>
  );
};
