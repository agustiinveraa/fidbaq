'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const toastTypes = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500',
    borderColor: 'border-green-500',
    textColor: 'text-green-800',
    bgLight: 'bg-green-50'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-500',
    borderColor: 'border-red-500',
    textColor: 'text-red-800',
    bgLight: 'bg-red-50'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-500',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-800',
    bgLight: 'bg-yellow-50'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-800',
    bgLight: 'bg-blue-50'
  }
};

let toastId = 0;

export const toast = {
  success: (message) => addToast(message, 'success'),
  error: (message) => addToast(message, 'error'),
  warning: (message) => addToast(message, 'warning'),
  info: (message) => addToast(message, 'info')
};

let toastListeners = [];
const addToast = (message, type) => {
  const id = ++toastId;
  const newToast = { id, message, type };
  toastListeners.forEach(listener => listener(newToast));
  
  // Auto remove after 3.5 seconds (like iOS)
  setTimeout(() => {
    toastListeners.forEach(listener => listener({ id, remove: true }));
  }, 3500);
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const listener = (toast) => {
      if (toast.remove) {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      } else {
        setToasts(prev => [...prev, toast]);
      }
    };
    
    toastListeners.push(listener);
    
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 space-y-3 pt-4">
      {toasts.map((toast) => {
        const config = toastTypes[toast.type];
        const Icon = config.icon;
        
        return (
          <div
            key={toast.id}
            className={`
              bg-white border border-gray-200 rounded-2xl p-4 shadow-xl backdrop-blur-lg
              animate-in slide-in-from-top-2 fade-in-50 duration-500
              max-w-sm min-w-[280px] mx-auto
            `}
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${config.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="font-medium text-gray-800 text-sm leading-5">{toast.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
