'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../atoms/ThemeToggle';
import { Button } from '../atoms/Button';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
  const { user, isInitialized, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-500 hover:to-purple-500 transition-all"
            >
              NexStore
            </Link>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden sm:flex items-center space-x-4">
            <ThemeToggle />

            {isInitialized && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    {user.role === 'admin' && (
                      <>
                        <Link href="/publicar" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          Subir Producto
                        </Link>
                        <Link href="/admin" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
                          Panel Admin
                        </Link>
                      </>
                    )}

                    <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-4">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 transition-colors"
                      >
                        Salir
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link href="/login">
                      <Button variant="outline" className="!py-2 !px-4 text-sm">Entrar</Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="primary" className="!py-2 !px-4 text-sm">Registro</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Right Section */}
          <div className="flex sm:hidden items-center space-x-2">
            <ThemeToggle />
            {isInitialized && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && isInitialized && (
        <div className="sm:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-4 space-y-3 animate-fade-in-up">
          {user ? (
            <>
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{user.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
              </div>
              {user.role === 'admin' && (
                <>
                  <Link
                    href="/publicar"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    📦 Subir Producto
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
                  >
                    ⚙️ Panel de Administración
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 transition-colors"
              >
                🚪 Cerrar Sesión
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button variant="outline" fullWidth>Iniciar Sesión</Button>
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button variant="primary" fullWidth>Crear Cuenta</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
