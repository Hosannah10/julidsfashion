import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { fetchCart, addToCartApi, updateCartItemApi, removeCartItemApi, clearCartApi } from '../services/api';

export type OrderStatus = 'pending' | 'completed';

export interface Product { product: {id:number; wearName:string; price:number; image?: string; category?:string; description?:string} }
export interface CartItem extends Product { id: number; quantity:number; status: OrderStatus }

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (p: Product, q?: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQuantity: (id: number, q: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  loading: boolean;
};

const CartContext = createContext<CartContextType|undefined>(undefined);

export const CartProvider: React.FC<{children:ReactNode}> = ({ children })=>{
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchCart();
        if (Array.isArray(data)) setCartItems(data);
      } catch(e){
        console.warn('fetchCart failed, using local', e);
      } finally { setLoading(false); }
    }
    load();
  },[]);

  const addToCart = async (p: Product, q = 1) => {
    setLoading(true);
    try {
      const payload = { id: p.product.id, quantity: q };
      const item = await addToCartApi(payload);
      // API should return the cart item; otherwise fallback
      setCartItems(prev => {
        const idx = prev.findIndex(x => x.product.id === item.id || x.product.id === p.product.id);
        if (idx > -1) { const copy = [...prev]; copy[idx] = item; return copy; }
        return [...prev, item];
      });
    } catch(e){
      console.warn('addToCartApi failed, fallback local', e);
      setCartItems(prev => {
        const idx = prev.findIndex(x => x.product.id === p.product.id);
        if (idx > -1){ const copy=[...prev]; copy[idx].quantity += q; return copy; }
        return [...prev, {...p, quantity: q} as CartItem];
      });
    } finally { setLoading(false); }
  };

  const removeFromCart = async (id:number) => {
    setLoading(true);
    try {
      await removeCartItemApi(id);
      setCartItems(prev => prev.filter(x => x.id !== id));
    } catch(e){
      console.warn('removeFromCartApi failed, fallback local', e);
      setCartItems(prev => prev.filter(x => x.id !== id));
    } finally { setLoading(false); }
  };

  const updateQuantity = async (id:number, q:number) => {
    setLoading(true);
    try {
      const updated = await updateCartItemApi(id, { quantity: q });
      setCartItems(prev => prev.map(x => x.id === updated.id ? updated : x));
    } catch(e){
      console.warn('updateCartItemApi failed, fallback local', e);
      setCartItems(prev => prev.map(x => x.id === id ? { ...x, quantity: q } : x));
    } finally { setLoading(false); }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await clearCartApi();
      setCartItems([]);
    } catch(e){
      console.warn('clearCartApi failed, clearing local', e);
      setCartItems([]);
    } finally { setLoading(false); }
  };

  const total = cartItems.reduce((s,i)=> s + (i.product.price||0) * (i.quantity||0), 0);

  return <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, total, loading }}>{children}</CartContext.Provider>
}

export const useCart = ()=> {
  const c = useContext(CartContext);
  if(!c) throw new Error('useCart must be used within CartProvider');
  return c;
}
