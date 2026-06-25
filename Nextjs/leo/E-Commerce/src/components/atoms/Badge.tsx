import React from 'react';

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'primary' | 'secondary' | 'success' | 'warning' }> = ({ 
  children, 
  variant = 'primary' 
}) => {
  const variants = {
    primary: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    secondary: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};
