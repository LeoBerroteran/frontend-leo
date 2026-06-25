import React from 'react';
import Link from 'next/link';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { Product } from '../../types';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <Link href={`/producto/${product.id}`} className="group block h-full">
      <Card className="h-full flex flex-col transform group-hover:-translate-y-1">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x400?text=Sin+Imagen';
            }}
          />
          <div className="absolute top-3 right-3">
            <Badge variant="primary">{product.category}</Badge>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {product.name}
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 flex-grow">
            {product.description}
          </p>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Ver detalles &rarr;</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
