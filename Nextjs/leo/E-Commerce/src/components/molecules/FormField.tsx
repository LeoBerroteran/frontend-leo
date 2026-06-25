import React, { forwardRef } from 'react';
import { Label } from '../atoms/Label';
import { Input, InputProps } from '../atoms/Input';

interface FormFieldProps extends InputProps {
  label: string;
  error?: string | boolean;
  required?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, required, id, className = '', ...props }, ref) => {
    return (
      <div className={`space-y-2 ${className}`}>
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
        <div className="relative">
          <Input 
            id={id} 
            ref={ref} 
            error={!!error} 
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props} 
          />
        </div>
        {error && typeof error === 'string' && (
          <p className="mt-1 text-sm text-red-500 animate-fade-in-up" id={`${id}-error`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
