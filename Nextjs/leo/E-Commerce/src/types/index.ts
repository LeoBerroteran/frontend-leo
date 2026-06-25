export type Role = 'comun' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
}

export interface Transaction {
  reference: string;
  bank: string;
  date: string;
  amount: number;
}

export interface Purchase {
  id: string;
  productId: string;
  buyerId: string;
  transaction: Transaction;
  status: 'pending' | 'verified';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  sellerId: string;
}
