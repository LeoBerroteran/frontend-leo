import React, { LabelHTMLAttributes } from 'react';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({ children, required, className = '', ...props }) => {
  return (
    <label 
      className={`block text-sm font-medium text-slate-700 dark:text-slate-200 ${className}`} 
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
    </label>
  );
};
