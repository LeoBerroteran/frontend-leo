'use client';

import React, { useEffect, useState } from 'react';
import { getProducts } from '../utils/storage';
import { Product } from '../types';
import { ProductGrid } from '../components/organisms/ProductGrid';
import { SearchBar } from '../components/molecules/SearchBar';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load products on mount
    setProducts(getProducts());
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 animate-fade-in-up">
          Descubre lo Mejor
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto animate-fade-in-up animation-delay-2000">
          Explora nuestro catálogo completo de productos. Encuentra exactamente lo que buscas con nuestra nueva plataforma.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-12 animate-fade-in-up animation-delay-4000">
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          placeholder="Buscar por nombre o categoría..." 
        />
      </div>

      {/* Product Grid */}
      <div className="mt-8">
        <ProductGrid products={filteredProducts} />
      </div>

    </div>
  );
}
