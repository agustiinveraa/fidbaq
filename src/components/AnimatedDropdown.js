'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function AnimatedDropdown({ value, onChange, options, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs px-2 py-1 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 transition-all duration-200 hover:scale-105 focus:scale-105 transform-gpu flex items-center space-x-1 min-w-[120px] justify-between"
      >
        <span>{selectedOption?.emoji} {selectedOption?.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 animate-in slide-in-from-top-2 duration-200 transform-gpu">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] transform-gpu flex items-center space-x-2 text-gray-800 font-medium"
            >
              <span>{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
