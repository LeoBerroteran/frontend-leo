'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '../../components/templates/ProtectedRoute';
import { getProducts, getPurchases, updatePurchaseStatus, deleteProduct, updateProduct, addProduct } from '../../utils/storage';
import { Product, Purchase } from '../../types';
import { Badge } from '../../components/atoms/Badge';
import { Button } from '../../components/atoms/Button';
import { FormField } from '../../components/molecules/FormField';
import { useAuth } from '../../context/AuthContext';

// ─── Blank product template ───────────────────────────────────────────────────
const EMPTY_FORM = { name: '', description: '', price: '', category: '', image: '' };

// ─── Reusable Product Form Modal ──────────────────────────────────────────────
interface ProductModalProps {
  title: string;
  initial: typeof EMPTY_FORM;
  onClose: () => void;
  onSave: (data: typeof EMPTY_FORM) => string | null; // returns error string or null
}

function ProductModal({ title, initial, onClose, onSave }: ProductModalProps) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');

  const set = (key: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = onSave(form);
    if (err) setError(err);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <FormField label="Nombre del Producto" id="modal-name" value={form.name} onChange={set('name')} required />

          <div className="space-y-1">
            <label htmlFor="modal-desc" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              id="modal-desc"
              value={form.description}
              onChange={set('description')}
              rows={3}
              className="appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Precio ($)" id="modal-price" type="number" step="0.01" min="0.01" value={form.price} onChange={set('price')} required />
            <FormField label="Categoría" id="modal-category" value={form.category} onChange={set('category')} required />
          </div>

          <FormField label="URL de la Imagen" id="modal-image" value={form.image} onChange={set('image')} placeholder="https://..." required />

          {form.image && (
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Vista previa:</p>
              <img
                src={form.image}
                alt="preview"
                className="w-20 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-600"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Error'; }}
              />
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'ventas' | 'productos'>('ventas');
  const [products, setProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  // Modal modes: null = closed, 'add' = new product, Product = editing existing
  const [modalMode, setModalMode] = useState<null | 'add' | Product>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    setProducts(getProducts());
    setPurchases(getPurchases());
  };

  const handleVerify = (id: string) => {
    updatePurchaseStatus(id, 'verified');
    loadData();
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) {
      deleteProduct(id);
      loadData();
    }
  };

  // Validate and save (add or edit)
  const handleSave = (form: typeof EMPTY_FORM): string | null => {
    const { name, description, price, category, image } = form;
    if (!name.trim() || !description.trim() || !price || !category.trim() || !image.trim()) {
      return 'Todos los campos son obligatorios.';
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) return 'El precio debe ser mayor a 0.';

    if (modalMode === 'add') {
      addProduct({
        id: crypto.randomUUID(),
        name: name.trim(),
        description: description.trim(),
        price: priceNum,
        category: category.trim(),
        image: image.trim(),
        sellerId: user?.id || 'admin',
      });
    } else if (modalMode && typeof modalMode === 'object') {
      updateProduct({
        ...modalMode,
        name: name.trim(),
        description: description.trim(),
        price: priceNum,
        category: category.trim(),
        image: image.trim(),
      });
    }

    loadData();
    setModalMode(null);
    return null;
  };

  const getModalInitial = (): typeof EMPTY_FORM => {
    if (!modalMode || modalMode === 'add') return EMPTY_FORM;
    return {
      name: modalMode.name,
      description: modalMode.description,
      price: modalMode.price.toString(),
      category: modalMode.category,
      image: modalMode.image,
    };
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Panel de Administración
          </h1>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
          <nav className="-mb-px flex space-x-1 sm:space-x-6 overflow-x-auto">
            {(['ventas', 'productos'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:hover:text-slate-300'
                } whitespace-nowrap py-3 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors capitalize`}
              >
                {tab === 'ventas' ? `Ventas (${purchases.length})` : `Productos (${products.length})`}
              </button>
            ))}
          </nav>
        </div>

        {/* ── VENTAS TAB ── */}
        {activeTab === 'ventas' && (
          <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            {purchases.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">No hay transacciones registradas.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                {purchases.map((purchase) => {
                  const prod = products.find(p => p.id === purchase.productId);
                  return (
                    <li key={purchase.id} className="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-semibold text-slate-900 dark:text-white text-sm break-all">
                              Ref: {purchase.transaction.reference}
                            </span>
                            {purchase.status === 'verified'
                              ? <Badge variant="success">Verificado</Badge>
                              : <Badge variant="warning">Pendiente</Badge>}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            <strong>Banco:</strong> {purchase.transaction.bank} &nbsp;·&nbsp;
                            <strong>Fecha:</strong> {purchase.transaction.date} &nbsp;·&nbsp;
                            <strong>Monto:</strong> ${purchase.transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            <strong>Producto:</strong> {prod?.name || 'Desconocido'}
                          </p>
                        </div>
                        {purchase.status === 'pending' && (
                          <Button onClick={() => handleVerify(purchase.id)} size="sm" className="flex-shrink-0 w-full sm:w-auto">
                            ✓ Verificar
                          </Button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* ── PRODUCTOS TAB ── */}
        {activeTab === 'productos' && (
          <>
            {/* Action bar */}
            <div className="flex justify-end mb-4">
              <Button onClick={() => setModalMode('add')} size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar Producto
              </Button>
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              {products.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mb-4">No hay productos en la tienda.</p>
                  <Button onClick={() => setModalMode('add')} size="sm">Agregar el primero</Button>
                </div>
              ) : (
                <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                  {products.map((product) => (
                    <li key={product.id} className="p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center justify-between gap-3">
                        {/* Product info */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover flex-shrink-0 bg-slate-100 dark:bg-slate-700"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/56?text=X'; }}
                          />
                          <div className="min-w-0">
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base truncate">{product.name}</h3>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">${product.price.toFixed(2)}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate hidden sm:block">{product.category}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                          <Button variant="outline" size="sm" onClick={() => setModalMode(product)}>
                            <span className="hidden sm:inline">Editar</span>
                            <svg className="w-4 h-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Button>
                          <Button
                            size="sm"
                            className="border-transparent text-white bg-red-500 hover:bg-red-600 focus:ring-red-500 shadow-none"
                            onClick={() => handleDelete(product.id)}
                          >
                            <span className="hidden sm:inline">Eliminar</span>
                            <svg className="w-4 h-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>

      {/* Product Modal (shared for Add and Edit) */}
      {modalMode !== null && (
        <ProductModal
          title={modalMode === 'add' ? 'Agregar Producto' : 'Editar Producto'}
          initial={getModalInitial()}
          onClose={() => setModalMode(null)}
          onSave={handleSave}
        />
      )}
    </ProtectedRoute>
  );
}
