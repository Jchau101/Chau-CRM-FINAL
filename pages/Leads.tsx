
import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Search, Filter, Download, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { Lead } from '../types';
import { useAuth } from '../context/AuthContext';
import { leadsService } from '../services/leadsService';
import { csvService } from '../services/csvService';
import { CSVImportModal } from '../components/CSVImportModal';
import { SavedLists } from '../components/SavedLists';
import { UndoSnackbar } from '../components/UndoSnackbar';
import { STAGE_LABELS } from '../types';

export const Leads: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [currentListId, setCurrentListId] = useState<string | null>(null);
  const [listLeadIds, setListLeadIds] = useState<string[]>([]);
  const [deletedLead, setDeletedLead] = useState<{ lead: Lead; undo: () => void } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const refreshLeads = () => {
    if (user) {
      leadsService.fetchLeads(user.id).then(data => {
        setLeads(data);
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    refreshLeads();
    
    // Listen for lead changes
    const handleLeadChange = () => {
      refreshLeads();
    };
    
    window.addEventListener('leadChanged', handleLeadChange);
    return () => window.removeEventListener('leadChanged', handleLeadChange);
  }, [user]);

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImport = async (importedLeads: Partial<Lead>[]) => {
    if (!user) return;
    
    // Create each imported lead
    for (const leadData of importedLeads) {
      const created = await leadsService.createLead(leadData, user.id);
      if (created) {
        setLeads(prev => [created, ...prev]);
      }
    }
  };

  const handleExport = () => {
    const csvContent = csvService.exportToCSV(filteredLeads);
    const filename = `Chau_Leads_${new Date().toISOString().split('T')[0]}.csv`;
    csvService.downloadCSV(csvContent, filename);
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
    
    // Notify other components
    window.dispatchEvent(new CustomEvent('leadChanged'));
    
    // Show undo snackbar
    setDeletedLead({
      lead,
      undo: async () => {
        const restored = await leadsService.restoreLead(leadId, user.id);
        if (restored) {
          refreshLeads();
          window.dispatchEvent(new CustomEvent('leadChanged'));
        }
        setDeletedLead(null);
      },
    });
    setShowDeleteConfirm(null);
  };

  const handleListSelect = (leadIds: string[]) => {
    setListLeadIds(leadIds);
  };

  const displayedLeads = currentListId && listLeadIds.length > 0
    ? filteredLeads.filter(l => listLeadIds.includes(l.id))
    : filteredLeads;

  return (
    <div className="flex gap-6">
      {/* Saved Lists Sidebar */}
      <div className="w-64 flex-shrink-0">
        <SavedLists
          selectedLeadIds={selectedLeadIds}
          onListSelect={(leadIds) => {
            handleListSelect(leadIds);
            setSelectedLeadIds([]); // Clear checkbox selection when switching lists
          }}
          currentListId={currentListId}
          onCurrentListChange={(listId) => {
            setCurrentListId(listId);
            if (!listId) {
              setListLeadIds([]);
            }
          }}
        />
      </div>

      <div className="flex-1 space-y-6 animate-in fade-in duration-500">
        <header className="flex justify-between items-center border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">A unified list of all your potential customers and partners.</p>
        </div>
        <button 
          onClick={() => setIsImportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-black to-gray-800 text-white text-xs font-medium hover:from-gray-800 hover:to-gray-700 transition-all shadow-sm"
        >
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
            <button 
              onClick={handleExport}
              disabled={filteredLeads.length === 0}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={14} className="text-gray-400" />
              Export
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-attio overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-500">Loading leads...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              {searchTerm ? 'No leads match your search.' : 'No leads yet. Create your first lead from the Pipeline page!'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#fcfcfc] border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-r-0 w-8">
                      <input
                        type="checkbox"
                        checked={displayedLeads.length > 0 && displayedLeads.every(l => selectedLeadIds.includes(l.id))}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedLeadIds(displayedLeads.map(l => l.id));
                          } else {
                            setSelectedLeadIds([]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-r-0">Name</th>
                    <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-r-0">Company</th>
                    <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-r-0">Stage</th>
                    <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-r-0">Value</th>
                    <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-r-0 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayedLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-2.5 border-r border-gray-50 last:border-r-0">
                      <input
                        type="checkbox"
                        checked={selectedLeadIds.includes(lead.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedLeadIds([...selectedLeadIds, lead.id]);
                          } else {
                            setSelectedLeadIds(selectedLeadIds.filter(id => id !== lead.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
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
                        {STAGE_LABELS[lead.stage] || lead.stage}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs font-bold text-gray-900 border-r border-gray-50 last:border-r-0">${lead.value.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setShowDeleteConfirm(lead.id)}
                          className="p-1 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-sm transition-all"
                          title="Delete lead"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button className="p-1 text-gray-300 hover:text-black hover:bg-gray-100 rounded-sm transition-all">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </GlassCard>

      <CSVImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={async (importedLeads) => {
          await handleImport(importedLeads);
          window.dispatchEvent(new CustomEvent('leadChanged'));
        }}
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
    </div>
  );
};
