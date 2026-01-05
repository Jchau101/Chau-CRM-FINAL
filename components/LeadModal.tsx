
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Lead, PipelineStage } from '../types';
import { STAGES } from '../constants';

interface LeadModalProps {
  lead?: Lead;
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({ lead, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Lead>>(
    lead || {
      name: '',
      company: '',
      email: '',
      value: 0,
      stage: PipelineStage.PROSPECTING,
      notes: ''
    }
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: lead?.id || Math.random().toString(36).substr(2, 9),
      createdAt: lead?.createdAt || new Date().toISOString().split('T')[0],
      ...(formData as Lead)
    });
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
                type="number" 
                required
                className="w-full bg-white border border-gray-200 rounded-attio px-3 py-2 text-sm transition-all"
                value={formData.value}
                onChange={e => setFormData({ ...formData, value: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stage</label>
              <select 
                className="w-full bg-white border border-gray-200 rounded-attio px-3 py-2 text-sm transition-all"
                value={formData.stage}
                onChange={e => setFormData({ ...formData, stage: e.target.value as PipelineStage })}
              >
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
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
