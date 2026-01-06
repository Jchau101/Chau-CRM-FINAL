
import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Target, MoreHorizontal, ArrowUpRight, DollarSign, Briefcase, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { leadsService } from '../services/leadsService';
import { STAGES } from '../constants';
import { STAGE_LABELS } from '../types';

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
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLeads: 0,
    wonDeals: 0,
    pipelineValue: 0,
    conversionRate: 0,
  });
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = () => {
    if (user) {
      Promise.all([
        leadsService.getDashboardStats(user.id),
        leadsService.fetchLeads(user.id)
      ]).then(([statsData, leadsData]) => {
        setStats(statsData);
        setLeads(leadsData);
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    refreshData();
    
    // Listen for lead changes (delete, create, update)
    const handleLeadChange = () => {
      refreshData();
    };
    
    window.addEventListener('leadChanged', handleLeadChange);
    return () => window.removeEventListener('leadChanged', handleLeadChange);
  }, [user]);

  const dashboardCards = [
    { title: 'Prospects', value: stats.totalLeads.toString(), icon: <Target />, trend: '+0%' },
    { title: 'Pipeline Value', value: stats.pipelineValue > 0 ? `$${(stats.pipelineValue / 1000).toFixed(1)}k` : '$0', icon: <DollarSign />, trend: '+0%' },
    { title: 'Closed', value: stats.wonDeals.toString(), icon: <Briefcase />, trend: '+0%' },
    { title: 'Conversion', value: stats.totalLeads > 0 ? `${stats.conversionRate}%` : '0%', icon: <TrendingUp />, trend: '+0%' },
  ];

  const hasNoData = !loading && stats.totalLeads === 0;

  // Generate chart data from actual leads
  const getChartData = () => {
    if (leads.length === 0) {
      return { stageData: [], velocityData: [] };
    }
    
    // Group by stage for pipeline weight chart
    const stageData = STAGES.map(stage => ({
      name: stage,
      value: leads.filter(l => l.stage === stage).reduce((sum, l) => sum + (l.value || 0), 0),
      count: leads.filter(l => l.stage === stage).length
    }));

    // Create time-based data for velocity (last 7 days of created leads)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      const dayLeads = leads.filter(l => l.createdAt === dateStr);
      return {
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        value: dayLeads.reduce((sum, l) => sum + (l.value || 0), 0),
        secondary: dayLeads.length * 1000 // Target line
      };
    });

    return { stageData, velocityData: last7Days };
  };

  const { stageData, velocityData } = getChartData();

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex justify-between items-end border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back. Here's your performance summary.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-xs font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">Export Data</button>
           <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-black to-gray-800 text-white text-xs font-medium hover:from-gray-800 hover:to-gray-700 transition-all shadow-md">Quick Add</button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardCards.map((card, i) => (
          <GlassCard key={i} className="flex flex-col group p-6 hover:border-black/20 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{card.title}</span>
              <div className="text-gray-300 group-hover:text-gray-900 transition-colors p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100">
                {React.cloneElement(card.icon as React.ReactElement, { size: 18 })}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-gray-900">{loading ? '...' : card.value}</h3>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">{card.trend}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main Content Area - Show empty state if no data */}
      {hasNoData ? (
        <div className="space-y-6">
          <GlassCard className="min-h-[500px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner">
                <Target size={32} className="text-gray-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome to your CRM</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                  Get started by creating your first lead. Navigate to the Pipeline page and click "New Lead" to begin tracking your deals.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="lg:col-span-2 min-h-[450px] bg-gradient-to-br from-white to-blue-50/30 border-blue-100/50">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">Deal Velocity</h3>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm"></div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-200"></div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Target</span>
                   </div>
                </div>
              </div>
              <div className="h-[350px] w-full">
                {velocityData.length > 0 && velocityData.some(d => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={velocityData}>
                      <defs>
                        <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#6b7280'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#6b7280'}} />
                      <Tooltip 
                        cursor={{ stroke: '#d1d5db', strokeWidth: 1 }}
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          borderRadius: '8px', 
                          border: '1px solid #e5e7eb',
                          fontSize: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          padding: '10px 14px'
                        }} 
                      />
                      <Area type="monotone" dataKey="secondary" stroke="#bfdbfe" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                      <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorPrimary)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-gray-400">
                    Add more leads to see velocity trends
                  </div>
                )}
              </div>
            </GlassCard>

            <GlassCard className="min-h-[450px] bg-gradient-to-br from-white to-purple-50/30 border-purple-100/50">
              <h3 className="text-base font-bold text-gray-900 mb-8 pb-4 text-center uppercase tracking-widest border-b border-gray-100">Pipeline Weight</h3>
              <div className="h-[350px] w-full">
                {stageData.length > 0 && stageData.some(d => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stageData.filter(d => d.value > 0)}>
                      <XAxis dataKey="name" hide />
                      <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px', padding: '8px 12px' }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {stageData.filter(d => d.value > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-gray-400">
                    Pipeline data will appear here
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-0 overflow-hidden bg-gradient-to-br from-white to-gray-50/50">
               <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recent Activity</h3>
                 <button className="text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium">View All</button>
               </div>
               <div className="divide-y divide-gray-100">
                 {leads.slice(0, 5).map((lead, i) => (
                   <div key={lead.id} className="flex gap-4 items-center p-4 hover:bg-gray-50/50 transition-colors group">
                     <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:bg-blue-600 transition-colors"></div>
                     <div className="flex-1 min-w-0">
                       <p className="text-xs text-gray-900 font-semibold truncate">
                         {lead.name} <span className="text-gray-400 font-normal">moved to</span> <span className="text-blue-600 font-medium">{STAGE_LABELS[lead.stage] || lead.stage}</span>
                       </p>
                       <p className="text-[10px] text-gray-400 mt-1">{lead.company} • ${lead.value.toLocaleString()}</p>
                     </div>
                     <ArrowUpRight size={14} className="text-gray-300 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                   </div>
                 ))}
                 {leads.length === 0 && (
                   <div className="p-8 text-center text-sm text-gray-400">
                     No activity yet. Create leads to see your timeline.
                   </div>
                 )}
               </div>
            </GlassCard>

            <GlassCard className="p-0 overflow-hidden bg-gradient-to-br from-white to-purple-50/30">
               <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50/50 to-white">
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Stage Distribution</h3>
                 <MoreHorizontal size={14} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
               </div>
               <div className="p-6 space-y-4">
                 {STAGES.map((stage, i) => {
                   const stageCount = leads.filter(l => l.stage === stage).length;
                   const percentage = stats.totalLeads > 0 ? (stageCount / stats.totalLeads) * 100 : 0;
                   return (
                     <div key={stage} className="space-y-2">
                       <div className="flex items-center justify-between">
                         <span className="text-xs font-semibold text-gray-700">{STAGE_LABELS[stage] || stage}</span>
                         <span className="text-[10px] font-bold text-gray-500">{stageCount}</span>
                       </div>
                       <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                         <div 
                           className="h-full rounded-full transition-all duration-500" 
                           style={{ 
                             width: `${percentage}%`, 
                             backgroundColor: COLORS[i % COLORS.length],
                             boxShadow: `0 0 8px ${COLORS[i % COLORS.length]}40`
                           }}
                         ></div>
                       </div>
                     </div>
                   );
                 })}
                 {stats.totalLeads === 0 && (
                   <div className="text-center text-sm text-gray-400 py-4">
                     No data available yet.
                   </div>
                 )}
               </div>
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
};
