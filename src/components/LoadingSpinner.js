'use client';

export default function LoadingSpinner({ message = "Cargando..." }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8 relative">
          {/* Animated background circle */}
          <div className="w-20 h-20 bg-emerald-200 rounded-full animate-ping absolute inset-0 opacity-30"></div>
          
          {/* Main logo container */}
          <div className="relative w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center animate-bounce">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="animate-pulse"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <line x1="9" x2="15" y1="10" y2="10"/>
              <line x1="12" x2="12" y1="7" y2="13"/>
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Feedback App</h2>
        <p className="text-gray-600 animate-pulse">{message}</p>
        
        {/* Loading dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
