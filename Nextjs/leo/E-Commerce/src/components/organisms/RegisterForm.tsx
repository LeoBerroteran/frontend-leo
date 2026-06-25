'use client';

import React, { useState } from 'react';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';
import { Label } from '../atoms/Label';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Role } from '../../types';

export const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('comun');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  
  const { register } = useAuth();
  const router = useRouter();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Name validations
    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (trimmedName.length > 50) {
      newErrors.name = 'El nombre no puede tener más de 50 caracteres';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(trimmedName)) {
      newErrors.name = 'El nombre solo puede contener letras y espacios';
    }

    // Email validations
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'El correo no es válido';
    
    // Password validations
    if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (!/(?=.*[A-Z])/.test(password)) {
      newErrors.password = 'La contraseña debe incluir al menos una letra mayúscula';
    } else if (!/(?=.*\d)/.test(password)) {
      newErrors.password = 'La contraseña debe incluir al menos un número';
    } else if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      newErrors.password = 'La contraseña debe incluir al menos un carácter especial';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');

    if (!validate()) return;

    const success = register({
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role
    });

    if (success) {
      router.push('/login');
    } else {
      setGlobalError('El correo electrónico ya está registrado.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {globalError && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm animate-fade-in-up">
          {globalError}
        </div>
      )}

      <FormField
        label="Nombre completo"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Juan Pérez"
        error={errors.name}
        required
      />

      <FormField
        label="Correo Electrónico"
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ejemplo@correo.com"
        error={errors.email}
        required
      />

      <FormField
        label="Contraseña"
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mínimo 6 caracteres, 1 mayúscula, 1 número y 1 símbolo"
        error={errors.password}
        required
      />

      <div className="space-y-2">
        <Label required>Tipo de cuenta</Label>
        <div className="grid grid-cols-2 gap-4">
          <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center transition-all ${role === 'comun' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}>
            <input 
              type="radio" 
              name="role" 
              value="comun" 
              checked={role === 'comun'} 
              onChange={() => setRole('comun')}
              className="sr-only"
            />
            <span className={`font-medium ${role === 'comun' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}>Usuario</span>
          </label>
          <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center transition-all ${role === 'admin' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}>
            <input 
              type="radio" 
              name="role" 
              value="admin" 
              checked={role === 'admin'} 
              onChange={() => setRole('admin')}
              className="sr-only"
            />
            <span className={`font-medium ${role === 'admin' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}>Administrador</span>
          </label>
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" fullWidth>
          Crear cuenta
        </Button>
      </div>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
};
