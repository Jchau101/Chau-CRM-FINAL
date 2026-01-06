
import React, { useState, useEffect } from 'react';
import { STAGES } from '../constants';
import { Lead, PipelineStage, STAGE_LABELS } from '../types';
import { GlassCard } from '../components/GlassCard';
import { Plus, MoreHorizontal, Sparkles, Loader2, GripVertical, Trash2 } from 'lucide-react';
import { LeadModal } from '../components/LeadModal';
import { UndoSnackbar } from '../components/UndoSnackbar';
import { scoreLeadWithAI } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { leadsService } from '../services/leadsService';

export const Pipeline: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scoringId, setScoringId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);
  const [deletedLead, setDeletedLead] = useState<{ lead: Lead; undo: () => void } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      leadsService.fetchLeads(user.id).then(data => {
        setLeads(data);
        setLoading(false);
      });
    }
  }, [user]);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('leadId', leadId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedLeadId(leadId);
  };

  const handleDragEnd = () => {
    setDraggedLeadId(null);
    setDragOverStage(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    e.stopPropagation();
    const leadId = e.dataTransfer.getData('leadId');
    if (!user || !leadId) return;
    
    // Find the lead being moved
    const leadToMove = leads.find(l => l.id === leadId);
    if (!leadToMove || leadToMove.stage === targetStage) {
      setDraggedLeadId(null);
      setDragOverStage(null);
      return;
    }
    
    // Optimistically update UI
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: targetStage } : l));
    
    // Update in database
    const updated = await leadsService.updateLead(leadId, { stage: targetStage }, user.id);
    if (updated) {
      // Notify Dashboard to refresh
      window.dispatchEvent(new CustomEvent('leadChanged'));
    } else {
      // Revert on error
      setLeads(prev => prev.map(l => l.id === leadId ? leadToMove : l));
      alert('Failed to update lead stage. Please try again.');
    }
    
    setDraggedLeadId(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragOverEvent, stage: PipelineStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleAddLead = async (newLead: Partial<Lead>) => {
    if (!user) return;
    
    // Ensure stage is set
    if (!newLead.stage) {
      newLead.stage = PipelineStage.CONTACTER;
    }
    
    const created = await leadsService.createLead(newLead, user.id);
    if (created) {
      setLeads(prev => [created, ...prev]);
      // Notify Dashboard to refresh
      window.dispatchEvent(new CustomEvent('leadChanged'));
    } else {
      // Error already shown in service, but refresh list to be safe
      const refreshed = await leadsService.fetchLeads(user.id);
      setLeads(refreshed);
    }
  };

  const handleAIScore = async (lead: Lead) => {
    if (scoringId || !user) return;
    setScoringId(lead.id);
    const { score, summary } = await scoreLeadWithAI(lead);
    const updated = await leadsService.updateLead(lead.id, { aiScore: score, aiSummary: summary }, user.id);
    if (updated) {
      setLeads(prev => prev.map(l => l.id === lead.id ? updated : l));
    }
    setScoringId(null);
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!user) return;
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    // Optimistically remove from UI
    setLeads(prev => prev.filter(l => l.id !== leadId));

    const success = await leadsService.deleteLead(leadId, user.id);
    if (!success) {
      // If delete failed, restore the lead in UI
      setLeads(prev => [...prev, lead]);
      alert('Failed to delete lead. Please try again.');
      setShowDeleteConfirm(null);
      return;
    }
    
    // Notify other components (like Dashboard) that leads have changed
    window.dispatchEvent(new CustomEvent('leadChanged'));
    
    // Show undo snackbar
    setDeletedLead({
      lead,
      undo: async () => {
        const restored = await leadsService.restoreLead(leadId, user.id);
        if (restored) {
          // Refresh leads from server to ensure consistency
          const refreshed = await leadsService.fetchLeads(user.id);
          setLeads(refreshed);
          // Notify Dashboard to refresh
          window.dispatchEvent(new CustomEvent('leadChanged'));
        }
        setDeletedLead(null);
      },
    });
    setShowDeleteConfirm(null);
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

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-500">Loading your pipeline...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto pb-6" onDragEnd={handleDragEnd}>
          <div className="flex gap-4 h-full min-w-max">
            {STAGES.map(stage => {
              const stageLeads = leads.filter(l => l.stage === stage);
              const isDragOver = dragOverStage === stage;
              return (
                <div 
                  key={stage} 
                  onDrop={(e) => handleDrop(e, stage)}
                  onDragOver={(e) => handleDragOver(e, stage)}
                  onDragLeave={handleDragLeave}
                  className={`w-72 flex flex-col gap-4 transition-all duration-200 ${
                    isDragOver ? 'bg-blue-50/50 rounded-lg p-2 -m-2 border-2 border-blue-300 border-dashed' : ''
                  }`}
                >
                  <div className={`flex justify-between items-center px-3 py-2 rounded-lg transition-all ${
                    isDragOver 
                      ? 'bg-blue-100 border-2 border-blue-300 shadow-md' 
                      : 'bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200/50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{STAGE_LABELS[stage] || stage}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isDragOver ? 'bg-blue-200 text-blue-700' : 'bg-white text-gray-500'
                      }`}>
                        {stageLeads.length}
                      </span>
                    </div>
                    <MoreHorizontal size={14} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                  </div>

                  <div className="flex-1 space-y-3 min-h-[300px]">
                    {stageLeads.map(lead => {
                      const isDragging = draggedLeadId === lead.id;
                      return (
                        <GlassCard 
                          key={lead.id} 
                          className={`p-4 cursor-grab active:cursor-grabbing hover:border-blue-300 hover:shadow-lg group relative transition-all duration-200 ${
                            isDragging ? 'opacity-40 scale-95 rotate-1 shadow-xl' : 'hover:scale-[1.02]'
                          }`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, lead.id)}
                          onDragEnd={handleDragEnd}
                        >
                          <GripVertical size={14} className="absolute left-2 top-4 text-gray-200 group-hover:text-gray-400 transition-colors" />
                          <div className="pl-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-gray-900 leading-tight">{lead.name}</h4>
                        <div className="flex items-center gap-1">
                          {lead.aiScore ? (
                            <div className="text-[9px] font-bold px-2 py-1 rounded-md bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200">
                              {lead.aiScore}
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleAIScore(lead)}
                              className="text-gray-300 hover:text-purple-500 transition-colors p-1 rounded hover:bg-purple-50"
                            >
                              {scoringId === lead.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                            </button>
                          )}
                          <button
                            onClick={() => setShowDeleteConfirm(lead.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                            <p className="text-[11px] text-gray-500 font-medium mb-3">{lead.company}</p>
                            
                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                              <span className="text-xs font-bold text-gray-900">${lead.value.toLocaleString()}</span>
                              <div className="flex -space-x-1">
                                <img src={`https://picsum.photos/seed/${lead.id}/24`} alt="" className="w-6 h-6 rounded-md border-2 border-white ring-1 ring-gray-100 shadow-sm" />
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      );
                    })}
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddLead} 
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-lg border border-red-200 p-6 shadow-xl relative">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Lead?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This action can be undone within 5 seconds.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteLead(showDeleteConfirm)}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Undo Snackbar */}
      {deletedLead && (
        <UndoSnackbar
          message="Lead deleted"
          onUndo={deletedLead.undo}
          onClose={() => setDeletedLead(null)}
        />
      )}
    </div>
  );
};
