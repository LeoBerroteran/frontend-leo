'use client';

import React, { useState } from 'react';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    const success = login(email, password);
    if (success) {
      router.push('/');
    } else {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm animate-fade-in-up">
          {error}
        </div>
      )}
      
      <FormField
        label="Correo Electrónico"
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ejemplo@correo.com"
        required
      />

      <FormField
        label="Contraseña"
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />

      <div className="pt-2">
        <Button type="submit" fullWidth>
          Iniciar Sesión
        </Button>
      </div>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
        ¿No tienes una cuenta?{' '}
        <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
          Regístrate aquí
        </Link>
      </p>
    </form>
  );
};
