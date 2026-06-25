'use client';

import React, { use, useEffect, useState } from 'react';
import { getProducts } from '../../../utils/storage';
import { Product } from '../../../types';
import { Button } from '../../../components/atoms/Button';
import { Badge } from '../../../components/atoms/Badge';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const products = getProducts();
    const found = products.find((p: Product) => p.id === resolvedParams.id);
    setProduct(found || null);
    setLoading(false);
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Producto no encontrado</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">El producto que buscas no existe o fue eliminado.</p>
        <Link href="/">
          <Button variant="outline">← Volver al catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

      {/* Breadcrumb */}
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver al catálogo
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">

          {/* Image Section */}
          <div className="w-full lg:w-1/2 bg-slate-100 dark:bg-slate-900 relative">
            {/* Fixed aspect ratio on mobile, full height on desktop */}
            <div className="aspect-square lg:aspect-auto lg:h-full min-h-[260px] sm:min-h-[360px]">
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x600?text=Sin+Imagen';
                }}
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col">

            {/* Category Badge */}
            <div className="mb-3">
              <Badge variant="primary">{product.category}</Badge>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-6 flex-1">
              {product.description}
            </p>

            {/* Divider */}
            <div className="border-t border-slate-100 dark:border-slate-700 pt-6">

              {/* Price + Buy */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Precio</p>
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                {user ? (
                  <Link href={`/checkout/${product.id}`} className="w-full sm:w-auto">
                    <Button size="lg" fullWidth className="sm:!w-auto">
                      🛒 Comprar ahora
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" fullWidth className="sm:!w-auto">
                      Inicia sesión para comprar
                    </Button>
                  </Link>
                )}
              </div>

              {/* Seller info */}
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>
                  Vendido por:{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {product.sellerId === 'system' ? 'Tienda Oficial' : 'Vendedor Externo'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
