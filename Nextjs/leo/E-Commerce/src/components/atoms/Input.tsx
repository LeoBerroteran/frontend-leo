import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface FormFieldProps extends Omit<InputProps, 'error'> {
  label: string;
  error?: string | boolean;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`appearance-none block w-full px-4 py-3 border rounded-xl shadow-sm placeholder-slate-400 
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200
        dark:bg-slate-800 dark:text-white dark:placeholder-slate-500
        ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-500' : 'border-slate-300 dark:border-slate-600'} 
        ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';
