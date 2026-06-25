'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '../../components/templates/ProtectedRoute';
import { FormField } from '../../components/molecules/FormField';
import { Button } from '../../components/atoms/Button';
import { useAuth } from '../../context/AuthContext';
import { addProduct } from '../../utils/storage';
import { useRouter } from 'next/navigation';

export default function PublicarPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !description || !price || !category || !image) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('El precio debe ser un número válido mayor a 0.');
      return;
    }

    const newProduct = {
      id: crypto.randomUUID(),
      name,
      description,
      price: priceNum,
      category,
      image,
      sellerId: user?.id || 'unknown'
    };

    addProduct(newProduct);
    router.push('/');
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">
          Subir un nuevo producto
        </h1>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            
            <FormField
              label="Nombre del Producto"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Camiseta de algodón"
              required
            />
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-white"
                placeholder="Detalla las características del producto..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Precio ($)"
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
              
              <FormField
                label="Categoría"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ej: Ropa, Electrónica..."
                required
              />
            </div>

            <FormField
              label="URL de la Imagen"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              required
            />

            <div className="pt-4 flex justify-end">
              <Button type="submit" size="lg">
                Publicar Producto
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
