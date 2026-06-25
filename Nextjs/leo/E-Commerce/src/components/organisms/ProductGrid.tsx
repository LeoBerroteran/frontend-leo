import React from 'react';
import { ProductCard } from '../molecules/ProductCard';
import { Product } from '../../types';

export const ProductGrid: React.FC<{ products: Product[] }> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 dark:text-slate-400 text-lg">No se encontraron productos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
