'use client';

import { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

let confirmModalListeners = [];
let confirmModalId = 0;

export const confirmModal = {
  show: (title, message, confirmText = 'Confirm', cancelText = 'Cancel') => {
    return new Promise((resolve) => {
      const id = ++confirmModalId;
      const modal = { id, title, message, confirmText, cancelText, resolve };
      confirmModalListeners.forEach(listener => listener(modal));
    });
  }
};

export default function ConfirmModal() {
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const listener = (newModal) => {
      setModal(newModal);
    };
    
    confirmModalListeners.push(listener);
    
    return () => {
      confirmModalListeners = confirmModalListeners.filter(l => l !== listener);
    };
  }, []);

  const handleConfirm = () => {
    if (modal) {
      modal.resolve(true);
      setModal(null);
    }
  };

  const handleCancel = () => {
    if (modal) {
      modal.resolve(false);
      setModal(null);
    }
  };

  if (!modal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-in zoom-in-95 duration-200 transform-gpu">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">{modal.title}</h3>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">{modal.message}</p>
        
        <div className="flex space-x-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] transform-gpu"
          >
            {modal.cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] transform-gpu"
          >
            {modal.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
