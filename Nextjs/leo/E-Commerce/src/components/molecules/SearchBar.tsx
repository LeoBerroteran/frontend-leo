import React from 'react';
import { Input } from '../atoms/Input';

export const SearchBar: React.FC<{ 
  value: string; 
  onChange: (val: string) => void; 
  placeholder?: string 
}> = ({ value, onChange, placeholder = "Buscar productos..." }) => {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </div>
      <Input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 !rounded-full bg-white/50 backdrop-blur-md border-slate-200 shadow-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all dark:bg-slate-800/50 dark:focus:bg-slate-800"
      />
    </div>
  );
};
