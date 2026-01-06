import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface UndoSnackbarProps {
  message: string;
  onUndo: () => void;
  onClose: () => void;
  duration?: number;
}

export const UndoSnackbar: React.FC<UndoSnackbarProps> = ({ 
  message, 
  onUndo, 
  onClose, 
  duration = 5000 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 flex items-center gap-4 min-w-[300px]">
        <span className="text-sm text-gray-900 flex-1">{message}</span>
        <button
          onClick={onUndo}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Undo
        </button>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

