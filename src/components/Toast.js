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
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    toastListeners.forEach(listener => listener({ id, remove: true }));
  }, 4000);
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
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => {
        const config = toastTypes[toast.type];
        const Icon = config.icon;
        
        return (
          <div
            key={toast.id}
            className={`
              ${config.bgLight} ${config.borderColor} ${config.textColor}
              border-l-4 rounded-xl p-4 shadow-lg backdrop-blur-sm
              animate-in slide-in-from-right-full duration-300
              max-w-sm min-w-[300px]
            `}
          >
            <div className="flex items-center space-x-3">
              <Icon className={`w-5 h-5 ${config.textColor}`} />
              <p className="font-medium">{toast.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
