import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-slate-200 dark:hover:border-slate-600 ${className}`}>
      {children}
    </div>
  );
};
