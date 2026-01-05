
import React, { useState } from 'react';
import { MOCK_LEADS } from '../constants';
import { GlassCard } from '../components/GlassCard';
import { Search, Filter, Download, MoreHorizontal, Plus } from 'lucide-react';

export const Leads: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLeads = MOCK_LEADS.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">A unified list of all your potential customers and partners.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-1.5 rounded-attio bg-black text-white text-xs font-medium hover:bg-gray-800 transition-all">
          <Plus size={14} />
          Import Leads
        </button>
      </header>

      <GlassCard className="p-0 border-none bg-transparent">
        <div className="mb-4 flex flex-col md:flex-row gap-2 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="Filter leads..."
              className="w-full bg-white border border-gray-200 rounded-attio py-1.5 pl-9 pr-3 text-xs focus:ring-1 focus:ring-black transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-1.5 rounded-attio bg-white border border-gray-200 text-xs font-medium hover:bg-gray-50 transition-colors">
              <Filter size={14} className="text-gray-400" />
              Filter
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-1.5 rounded-attio bg-white border border-gray-200 text-xs font-medium hover:bg-gray-50 transition-colors">
              <Download size={14} className="text-gray-400" />
              Export
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-attio overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#fcfcfc] border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-r-0">Name</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-r-0">Company</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-r-0">Stage</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-r-0">Value</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-r-0 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-2.5 border-r border-gray-50 last:border-r-0">
                      <div className="flex items-center gap-2">
                        <img src={`https://picsum.photos/seed/${lead.id}/32`} className="w-6 h-6 rounded-sm border border-gray-100" />
                        <div>
                          <p className="text-xs font-semibold text-gray-900">{lead.name}</p>
                          <p className="text-[10px] text-gray-400">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 border-r border-gray-50 last:border-r-0">{lead.company}</td>
                    <td className="px-4 py-2.5 border-r border-gray-50 last:border-r-0">
                      <span className="px-1.5 py-0.5 rounded-sm bg-gray-100 text-gray-600 text-[9px] font-bold uppercase border border-gray-200">
                        {lead.stage}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs font-bold text-gray-900 border-r border-gray-50 last:border-r-0">${lead.value.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right">
                      <button className="p-1 text-gray-300 hover:text-black hover:bg-gray-100 rounded-sm transition-all opacity-0 group-hover:opacity-100">
                        <MoreHorizontal size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
