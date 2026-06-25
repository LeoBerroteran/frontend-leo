import { User } from '../types';

const USERS_KEY = 'ecommerce_users';
const CURRENT_USER_KEY = 'ecommerce_current_user';

// --- USERS ---
export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: User[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};

export const addUser = (user: User): boolean => {
  const users = getUsers();
  if (users.find(u => u.email === user.email)) {
    return false; // User already exists
  }
  users.push(user);
  saveUsers(users);
  return true;
};

// --- AUTH SESSION ---
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
};

export const removeCurrentUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// --- PRODUCTS ---
const PRODUCTS_KEY = 'ecommerce_products';

const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Auriculares Inalámbricos',
    description: 'Auriculares con cancelación de ruido activa.',
    price: 199.99,
    category: 'Electrónica',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    sellerId: 'system'
  },
  {
    id: '2',
    name: 'Teclado Mecánico',
    description: 'Teclado mecánico RGB con switches azules.',
    price: 89.50,
    category: 'Accesorios',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80',
    sellerId: 'system'
  }
];

export const getProducts = () => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(PRODUCTS_KEY);
  if (!data) {
    // Initialize with mock data
    saveProducts(MOCK_PRODUCTS);
    return MOCK_PRODUCTS;
  }
  return JSON.parse(data);
};

export const saveProducts = (products: any[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }
};

export const addProduct = (product: any): void => {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
};

export const updateProduct = (updatedProduct: any): void => {
  const products = getProducts();
  const index = products.findIndex((p: any) => p.id === updatedProduct.id);
  if (index !== -1) {
    products[index] = updatedProduct;
    saveProducts(products);
  }
};

export const deleteProduct = (id: string): void => {
  const products = getProducts();
  const filtered = products.filter((p: any) => p.id !== id);
  saveProducts(filtered);
};

// --- PURCHASES ---
const PURCHASES_KEY = 'ecommerce_purchases';

export const getPurchases = () => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(PURCHASES_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePurchases = (purchases: any[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
  }
};

export const addPurchase = (purchase: any): void => {
  const purchases = getPurchases();
  purchases.push(purchase);
  savePurchases(purchases);
};

export const updatePurchaseStatus = (id: string, status: 'pending' | 'verified'): void => {
  const purchases = getPurchases();
  const index = purchases.findIndex((p: any) => p.id === id);
  if (index !== -1) {
    purchases[index].status = status;
    savePurchases(purchases);
  }
};
