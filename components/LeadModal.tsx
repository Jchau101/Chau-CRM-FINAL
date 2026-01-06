
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Lead, PipelineStage } from '../types';
import { STAGES } from '../constants';

interface LeadModalProps {
  lead?: Lead;
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Partial<Lead>) => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({ lead, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '',
    company: '',
    email: '',
    value: 0,
    stage: PipelineStage.CONTACTER,
    notes: ''
  });

  // Reset form when modal opens/closes or when lead changes
  useEffect(() => {
    if (isOpen) {
      if (lead) {
        setFormData({
          name: lead.name || '',
          company: lead.company || '',
          email: lead.email || '',
          value: lead.value || 0,
          stage: lead.stage || PipelineStage.CONTACTER,
          notes: lead.notes || ''
        });
      } else {
        setFormData({
          name: '',
          company: '',
          email: '',
          value: 0,
          stage: PipelineStage.CONTACTER,
          notes: ''
        });
      }
    }
  }, [isOpen, lead]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure all required fields are present
    const leadToSave: Partial<Lead> = {
      name: formData.name || '',
      company: formData.company || '',
      email: formData.email || '',
      value: formData.value || 0,
      stage: formData.stage || PipelineStage.CONTACTER,
      notes: formData.notes || ''
    };
    
    onSave(leadToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/5 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-attio border border-gray-200 p-8 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-8">
          {lead ? 'Edit' : 'Create'} Lead
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-white border border-gray-200 rounded-attio px-3 py-2 text-sm transition-all"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Company</label>
              <input 
                type="text" 
                required
                className="w-full bg-white border border-gray-200 rounded-attio px-3 py-2 text-sm transition-all"
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-white border border-gray-200 rounded-attio px-3 py-2 text-sm transition-all"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Value (USD)</label>
              <input 
                type="text" 
                required
                placeholder="0.00"
                className="w-full bg-white border border-gray-200 rounded-attio px-3 py-2 text-sm transition-all"
                value={formData.value ? formData.value.toLocaleString() : ''}
                onChange={e => {
                  // Remove all non-digit characters
                  const raw = e.target.value.replace(/[^\d]/g, '');
                  // Parse as integer, default to 0 if empty
                  const num = raw === '' ? 0 : parseInt(raw, 10);
                  setFormData({ ...formData, value: num });
                }}
                onBlur={e => {
                  // Format on blur
                  const num = formData.value || 0;
                  e.target.value = num.toLocaleString();
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stage</label>
              <select 
                className="w-full bg-white border border-gray-200 rounded-attio px-3 py-2 text-sm transition-all"
                value={formData.stage || PipelineStage.CONTACTER}
                onChange={e => setFormData({ ...formData, stage: e.target.value as PipelineStage })}
                required
              >
                {STAGES.map(s => (
                  <option key={s} value={s}>
                    {s === PipelineStage.CONTACTER ? 'Contacter' :
                     s === PipelineStage.QUALIFIED ? 'Qualified' :
                     s === PipelineStage.NEGOTIATION ? 'Negotiation' :
                     s === PipelineStage.CLOSED ? 'Closed' : s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Notes</label>
            <textarea 
              rows={3}
              className="w-full bg-white border border-gray-200 rounded-attio px-3 py-2 text-sm transition-all"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
             <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-attio border border-gray-200 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 bg-black text-white py-2.5 rounded-attio text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
            >
              Save Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
