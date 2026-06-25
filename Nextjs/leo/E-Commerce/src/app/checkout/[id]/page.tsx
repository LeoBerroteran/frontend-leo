'use client';

import React, { use, useEffect, useState } from 'react';
import { ProtectedRoute } from '../../../components/templates/ProtectedRoute';
import { FormField } from '../../../components/molecules/FormField';
import { Button } from '../../../components/atoms/Button';
import { getProducts, addPurchase } from '../../../utils/storage';
import { Product } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [bank, setBank] = useState('');
  const [reference, setReference] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const products = getProducts();
    const found = products.find((p: Product) => p.id === resolvedParams.id);
    setProduct(found || null);
  }, [resolvedParams.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!bank || !reference || !date) {
      setError('Todos los datos bancarios son obligatorios.');
      return;
    }

    if (reference.length < 5) {
      setError('La referencia debe tener al menos 5 caracteres.');
      return;
    }

    if (!product || !user) return;

    const newPurchase = {
      id: crypto.randomUUID(),
      productId: product.id,
      buyerId: user.id,
      status: 'pending',
      transaction: {
        bank,
        reference,
        date,
        amount: product.price
      }
    };

    addPurchase(newPurchase);
    setSuccess(true);
    
    // Redirect after 3 seconds
    setTimeout(() => {
      router.push('/');
    }, 3000);
  };

  if (!product) return <div className="p-8 text-center">Cargando producto...</div>;

  if (success) {
    return (
      <ProtectedRoute>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">¡Compra Registrada!</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Tu transacción está pendiente de verificación por un administrador.
            Te estamos redirigiendo al inicio...
          </p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href={`/producto/${product.id}`} className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 mb-6 inline-block">
          &larr; Volver al producto
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Resumen del Pedido</h2>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <div className="flex gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-xl" />
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{product.name}</h3>
                  <p className="text-sm text-slate-500">{product.category}</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-slate-900 dark:text-white">
                <span>Total a Pagar:</span>
                <span className="text-indigo-600 dark:text-indigo-400">${product.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
              <h3 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2">Datos de depósito de la tienda</h3>
              <p className="text-sm text-indigo-800 dark:text-indigo-300">
                <strong>Banco:</strong> Banco Nacional<br/>
                <strong>Cuenta:</strong> 0102-1234-5678-9012<br/>
                <strong>Titular:</strong> NexStore C.A.
              </p>
            </div>
          </div>

          {/* Transaction Form */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Datos de Pago</h2>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}
                
                <FormField
                  label="Banco Emisor"
                  id="bank"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  placeholder="Ej: Banesco, Mercantil..."
                  required
                />
                
                <FormField
                  label="Número de Referencia"
                  id="reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="12345678"
                  required
                />

                <FormField
                  label="Fecha de la Transacción"
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />

                <div className="pt-4">
                  <Button type="submit" fullWidth size="lg">
                    Notificar Pago
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
