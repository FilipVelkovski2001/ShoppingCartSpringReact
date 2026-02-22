import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { cartApi } from '../api';
import { useAuth } from './AuthContext';
import type { CartDto, ProductDto } from '../dto';

interface CartContextType {
  cart: CartDto;
  loading: boolean;
  addItem: (product: ProductDto, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const emptyCart: CartDto = { id: 0, items: [], total: 0, totalItems: 0 };

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartDto>(emptyCart);
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async (): Promise<void> => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const { data } = await cartApi.getCart();
      setCart(data.data);
    } catch (e) {
      console.error('Failed to fetch cart', e);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = useCallback(async (product: ProductDto, quantity: number = 1): Promise<void> => {
    const { data } = await cartApi.addItem({
      productId: product.id,
      quantity,
      productTitle: product.title,
      productPrice: product.price,
      productThumbnail: product.thumbnail,
    });
    setCart(data.data);
  }, []);

  const updateQuantity = useCallback(async (productId: number, quantity: number): Promise<void> => {
    const { data } = await cartApi.updateQuantity(productId, { quantity });
    setCart(data.data);
  }, []);

  const removeItem = useCallback(async (productId: number): Promise<void> => {
    const { data } = await cartApi.removeItem(productId);
    setCart(data.data);
  }, []);

  const clearCart = useCallback(async (): Promise<void> => {
    await cartApi.clearCart();
    setCart(emptyCart);
  }, []);

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
