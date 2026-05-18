import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
const CART_KEY = 'mandi360_cart';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      const currentQty = existing ? existing.qty : 0;
      const maxStock = product.stock ?? Infinity;

      if (product.stock !== undefined && product.stock !== null && currentQty >= maxStock) {
        alert('Product is out of stock');
        return prev;
      }
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeItem  = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, delta) => setItems(prev =>
    prev.map(i => {
      if (i.id !== id) return i;
      const maxStock = i.stock ?? Infinity;
      const newQty = i.qty + delta;
      if (delta > 0 && i.stock !== undefined && i.stock !== null && newQty > maxStock) {
        alert('Product is out of stock');
        return i;
      }
      return { ...i, qty: Math.max(1, newQty) };
    })
  );
  const clearCart   = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
