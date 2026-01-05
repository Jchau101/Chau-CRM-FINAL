
import React, { useState } from 'react';
import { MOCK_LEADS, STAGES } from '../constants';
import { Lead, PipelineStage } from '../types';
import { GlassCard } from '../components/GlassCard';
import { Plus, MoreHorizontal, Sparkles, Loader2, GripVertical } from 'lucide-react';
import { LeadModal } from '../components/LeadModal';
import { scoreLeadWithAI } from '../services/geminiService';

export const Pipeline: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scoringId, setScoringId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('leadId', leadId);
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    const leadId = e.dataTransfer.getData('leadId');
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: targetStage } : l));
  };

  const handleDragOver = (e: React.DragOverEvent) => {
    e.preventDefault();
  };

  const handleAddLead = (newLead: Lead) => {
    setLeads(prev => [...prev, newLead]);
  };

  const handleAIScore = async (lead: Lead) => {
    if (scoringId) return;
    setScoringId(lead.id);
    const { score, summary } = await scoreLeadWithAI(lead);
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, aiScore: score, aiSummary: summary } : l));
    setScoringId(null);
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your deals across custom stages.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-3 py-1.5 rounded-attio bg-white border border-gray-200 text-xs font-medium hover:bg-gray-50 transition-colors">Manage stages</button>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-2 px-4 py-1.5 rounded-attio bg-black text-white text-xs font-medium hover:bg-gray-800 transition-all shadow-sm"
           >
             <Plus size={14} />
             New Lead
           </button>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto pb-6">
        <div className="flex gap-4 h-full min-w-max">
          {STAGES.map(stage => (
            <div 
              key={stage} 
              onDrop={(e) => handleDrop(e, stage)}
              onDragOver={handleDragOver}
              className="w-72 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center px-2 py-1 bg-gray-50/50 border border-gray-200/50 rounded-sm">
                <div className="flex items-center gap-2">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stage}</h3>
                  <span className="text-[10px] font-bold text-gray-400">
                    {leads.filter(l => l.stage === stage).length}
                  </span>
                </div>
                <MoreHorizontal size={14} className="text-gray-400 cursor-pointer" />
              </div>

              <div className="flex-1 space-y-3 min-h-[300px]">
                {leads.filter(l => l.stage === stage).map(lead => (
                  <GlassCard 
                    key={lead.id} 
                    className="p-4 cursor-grab active:cursor-grabbing hover:border-black/20 group relative"
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                  >
                    <GripVertical size={14} className="absolute left-1 top-4 text-gray-100 group-hover:text-gray-300 transition-colors" />
                    <div className="pl-2">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 leading-tight">{lead.name}</h4>
                        {lead.aiScore ? (
                          <div className="text-[9px] font-bold px-1 py-0.5 rounded-sm bg-gray-50 text-gray-600 border border-gray-100">
                            SCORE: {lead.aiScore}
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleAIScore(lead)}
                            className="text-gray-300 hover:text-black transition-colors"
                          >
                            {scoringId === lead.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 font-medium mb-4">{lead.company}</p>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                        <span className="text-xs font-bold text-gray-900">${lead.value.toLocaleString()}</span>
                        <div className="flex -space-x-1">
                          <img src={`https://picsum.photos/seed/${lead.id}/24`} alt="" className="w-5 h-5 rounded-sm border border-white ring-1 ring-gray-100" />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-2 border border-dashed border-gray-200 rounded-attio text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:border-gray-300 hover:text-gray-600 transition-all"
                >
                  + Add Item
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddLead} 
      />
    </div>
  );
};
