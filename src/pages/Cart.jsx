// src/pages/Cart.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiOutlineTrash, HiOutlineTruck, HiOutlineArrowRight,
  HiOutlineShieldCheck, HiOutlineRefresh, HiOutlineTag,
} from 'react-icons/hi';
import { HiOutlineBuildingStorefront } from 'react-icons/hi2';

const INITIAL_ITEMS = [
  { id: 1, name: 'Panda Pro Sneakers',    price: 2999, type: 'global', qty: 1, brand: 'Official Store', emoji: '👟' },
  { id: 2, name: 'Fresh Alphonso Mangoes', price: 600, type: 'local',  qty: 2, shop: 'Fresh Basket',    emoji: '🥭' },
];

const TRUST_BADGES = [
  { icon: <HiOutlineShieldCheck size={18} />, label: 'Secure Checkout'  },
  { icon: <HiOutlineTruck       size={18} />, label: 'Free Delivery'    },
  { icon: <HiOutlineRefresh     size={18} />, label: 'Easy Returns'     },
];

const Cart = () => {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [coupon, setCoupon] = useState('');

  const removeItem  = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const updateQty   = (id, delta) => setItems(prev =>
    prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
  );

  const subtotal    = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery    = 0;
  const total       = subtotal + delivery;
  const totalItems  = items.reduce((sum, i) => sum + i.qty, 0);

  const localItems  = items.filter(i => i.type === 'local');
  const globalItems = items.filter(i => i.type === 'global');

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Bag</h1>
              <p className="text-slate-500 text-sm mt-1">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
            </div>
            <Link to="/shops" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {items.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-28 text-center"
          >
            <div className="w-28 h-28 bg-slate-100 rounded-full flex items-center justify-center text-6xl mb-6">🛍️</div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Your bag is empty</h2>
            <p className="text-slate-500 mb-8">Looks like you haven't added anything yet.</p>
            <Link to="/shops"
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-500 transition-colors"
            >
              Start Shopping →
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* ── Items List ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Local Items */}
              {localItems.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                      <HiOutlineBuildingStorefront size={17} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Local Shop Pickups</p>
                      <p className="text-xs text-slate-400">Delivered within 2-4 hours</p>
                    </div>
                    <span className="ml-auto bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      Free Delivery
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <AnimatePresence>
                      {localItems.map(item => (
                        <CartRow key={item.id} item={item} onRemove={removeItem} onQty={updateQty} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Global Items */}
              {globalItems.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                      <HiOutlineTruck size={17} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Global Shipping</p>
                      <p className="text-xs text-slate-400">Delivered in 3-5 business days</p>
                    </div>
                    <span className="ml-auto bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full">
                      Standard Shipping
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <AnimatePresence>
                      {globalItems.map(item => (
                        <CartRow key={item.id} item={item} onRemove={removeItem} onQty={updateQty} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                {TRUST_BADGES.map(b => (
                  <div key={b.label} className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col items-center gap-2 text-center">
                    <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                      {b.icon}
                    </div>
                    <p className="text-xs font-bold text-slate-600">{b.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Order Summary ── */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 text-white rounded-2xl overflow-hidden sticky top-24"
              >
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-800">
                  <h2 className="font-black text-lg">Order Summary</h2>
                  <p className="text-slate-400 text-xs mt-0.5">{totalItems} items</p>
                </div>

                <div className="p-6 space-y-4">
                  {/* Item breakdown */}
                  <div className="space-y-2">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-slate-400 truncate mr-2">
                          {item.emoji} {item.name} ×{item.qty}
                        </span>
                        <span className="text-white font-semibold flex-shrink-0">
                          ₹{(item.price * item.qty).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-800 pt-4 space-y-3 text-sm">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal</span>
                      <span className="text-white">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Delivery</span>
                      <span className="text-emerald-400 font-bold">FREE</span>
                    </div>
                  </div>

                  {/* Coupon */}
                  <div className="border-t border-slate-800 pt-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <HiOutlineTag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                        <input
                          type="text"
                          value={coupon}
                          onChange={e => setCoupon(e.target.value)}
                          placeholder="Coupon code"
                          className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 pl-9 pr-3 py-2.5 rounded-xl text-xs outline-none focus:border-slate-500 transition-all"
                        />
                      </div>
                      <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
                    <span className="font-black text-lg">Total</span>
                    <span className="font-black text-2xl">₹{total.toLocaleString()}</span>
                  </div>

                  {/* Checkout Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-red-500 py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 text-sm"
                  >
                    Proceed to Checkout <HiOutlineArrowRight size={16} />
                  </motion.button>

                  <p className="text-center text-xs text-slate-500">
                    🔒 Secured by 256-bit SSL encryption
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CartRow = ({ item, onRemove, onQty }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20, height: 0 }}
    className="flex items-center gap-5 p-5 border-b border-slate-100 last:border-0"
  >
    {/* Product visual */}
    <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 border border-slate-100">
      {item.emoji}
    </div>

    <div className="flex-1 min-w-0">
      <h3 className="font-bold text-slate-900 text-sm leading-tight mb-0.5">{item.name}</h3>
      <p className="text-xs text-slate-400 font-semibold mb-3">
        {item.type === 'local' ? `🏪 ${item.shop}` : `🌐 ${item.brand}`}
      </p>

      <div className="flex items-center gap-3">
        {/* Qty controls */}
        <div className="flex items-center bg-slate-100 rounded-xl overflow-hidden">
          <button
            onClick={() => onQty(item.id, -1)}
            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-red-500 transition-colors font-bold text-lg"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-black text-slate-900">{item.qty}</span>
          <button
            onClick={() => onQty(item.id, +1)}
            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-emerald-500 transition-colors font-bold text-lg"
          >
            +
          </button>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <HiOutlineTrash size={16} />
        </button>
      </div>
    </div>

    <div className="text-right flex-shrink-0">
      <p className="text-lg font-black text-slate-900">₹{(item.price * item.qty).toLocaleString()}</p>
      {item.qty > 1 && (
        <p className="text-xs text-slate-400">₹{item.price.toLocaleString()} each</p>
      )}
    </div>
  </motion.div>
);

export default Cart;
