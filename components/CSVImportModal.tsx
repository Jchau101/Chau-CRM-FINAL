import React, { useState, useRef } from 'react';
import { X, Upload, Check, AlertCircle } from 'lucide-react';
import { csvService, CSVMapping } from '../services/csvService';
import { Lead, PipelineStage } from '../types';
import { STAGE_LABELS } from '../types';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (leads: Partial<Lead>[]) => Promise<void>;
}

export const CSVImportModal: React.FC<CSVImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'importing' | 'success'>('upload');
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<CSVMapping[]>([]);
  const [importResult, setImportResult] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (file: File) => {
    try {
      const result = await csvService.parseCSV(file);
      if (result.data && result.data.length > 0) {
        const headers = Object.keys(result.data[0]);
        setCsvHeaders(headers);
        setCsvData(result.data);
        const suggestedMappings = csvService.suggestMappings(headers);
        setMappings(suggestedMappings);
        setStep('mapping');
      }
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert('Error parsing CSV file. Please check the format.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleMappingChange = (csvColumn: string, crmField: CSVMapping['crmField']) => {
    setMappings(prev =>
      prev.map(m => m.csvColumn === csvColumn ? { ...m, crmField } : m)
    );
  };

  const handlePreview = () => {
    // This would normally validate and show preview
    // For now, just move to preview step
    setStep('preview');
  };

  const handleImport = async () => {
    setStep('importing');
    const result = csvService.validateAndMap(csvData, mappings);
    
    if (result.success && result.preview.length > 0) {
      await onImport(result.preview);
      setImportResult(result);
      setStep('success');
    } else {
      alert('Import failed. Please check your mappings and try again.');
      setStep('mapping');
    }
  };

  const reset = () => {
    setStep('upload');
    setCsvData([]);
    setCsvHeaders([]);
    setMappings([]);
    setImportResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-lg border border-gray-200 p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            reset();
            onClose();
          }}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Import Leads from CSV</h2>

        {step === 'upload' && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
              dragActive
                ? 'border-blue-400 bg-blue-50/50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Upload size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drag CSV file here or click to upload
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Supported format: CSV files up to 5MB
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
            >
              Choose File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />
          </div>
        )}

        {step === 'mapping' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-600 mb-4">
              Map your CSV columns to CRM fields. Required fields: Name, Email
            </p>
            <div className="space-y-3">
              {mappings.map((mapping, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-all">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{mapping.csvColumn}</p>
                  </div>
                  <div className="w-8 text-center text-gray-400">→</div>
                  <select
                    value={mapping.crmField}
                    onChange={e => handleMappingChange(mapping.csvColumn, e.target.value as CSVMapping['crmField'])}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black"
                  >
                    <option value="skip">Skip</option>
                    <option value="name">Name</option>
                    <option value="company">Company</option>
                    <option value="email">Email</option>
                    <option value="value">Value</option>
                    <option value="stage">Stage</option>
                    <option value="notes">Notes</option>
                  </select>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep('upload')}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handlePreview}
                className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
              >
                Preview Import
              </button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Preview of leads to be imported (showing first 5)
            </p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-xs font-bold text-gray-600 uppercase">Name</th>
                    <th className="px-4 py-2 text-xs font-bold text-gray-600 uppercase">Company</th>
                    <th className="px-4 py-2 text-xs font-bold text-gray-600 uppercase">Email</th>
                    <th className="px-4 py-2 text-xs font-bold text-gray-600 uppercase">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {csvData.slice(0, 5).map((row, i) => {
                    const lead: Partial<Lead> = {};
                    mappings.forEach(m => {
                      if (m.crmField !== 'skip' && row[m.csvColumn]) {
                        (lead as any)[m.crmField] = row[m.csvColumn];
                      }
                    });
                    return (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">{lead.name || '-'}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{lead.company || '-'}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{lead.email || '-'}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">${lead.value?.toLocaleString() || '0'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep('mapping')}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleImport}
                className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
              >
                Import Leads
              </button>
            </div>
          </div>
        )}

        {step === 'importing' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600">Importing leads...</p>
          </div>
        )}

        {step === 'success' && importResult && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <Check size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Import Successful!</h3>
              <p className="text-sm text-gray-600">
                {importResult.imported} leads imported successfully
                {importResult.skipped > 0 && `, ${importResult.skipped} skipped`}
              </p>
            </div>
            {importResult.errors.length > 0 && (
              <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle size={16} className="text-amber-600 mt-0.5" />
                  <p className="text-sm font-medium text-amber-900">Import Warnings</p>
                </div>
                <ul className="text-xs text-amber-700 space-y-1 max-h-32 overflow-y-auto">
                  {importResult.errors.slice(0, 10).map((error: string, i: number) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={() => {
                reset();
                onClose();
              }}
              className="w-full py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

