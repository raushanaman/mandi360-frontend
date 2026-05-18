import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiOutlineTrash, HiOutlineTruck,
  HiOutlineShieldCheck, HiOutlineRefresh, HiOutlineTag,
} from 'react-icons/hi';
import { HiOutlineBuildingStorefront } from 'react-icons/hi2';
import PaymentButton from '../components/PaymentButton';

const TRUST_BADGES = [
  { icon: <HiOutlineShieldCheck size={18} />, label: 'Secure Checkout'  },
  { icon: <HiOutlineTruck       size={18} />, label: 'Free Delivery'    },
  { icon: <HiOutlineRefresh     size={18} />, label: 'Easy Returns'     },
];

const Cart = () => {
  const { items, removeItem, updateQty } = useCart();
  const [coupon, setCoupon] = useState('');
  const firstName = localStorage.getItem('firstName') || 'User';

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
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{firstName}'s Bag</h1>
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
                  <PaymentButton amount={total} />

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

const CartRow = ({ item, onRemove, onQty }) => {
  const stockLeft = item.stock ?? Infinity;
  const isLowStock = stockLeft !== Infinity && stockLeft <= 5 && stockLeft > 0;
  const isOutOfStock = stockLeft === 0;

  return (
  <motion.div
    layout
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20, height: 0 }}
    className="flex items-center gap-5 p-5 border-b border-slate-100 last:border-0"
  >
    {/* Product visual */}
    <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 border border-slate-100 overflow-hidden relative">
      {item.image
        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        : <span>{item.emoji}</span>
      }
      {isOutOfStock && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <span className="text-[10px] font-black text-red-600">OUT</span>
        </div>
      )}
    </div>

    <div className="flex-1 min-w-0">
      <h3 className="font-bold text-slate-900 text-sm leading-tight mb-0.5">{item.name}</h3>
      <p className="text-xs text-slate-400 font-semibold mb-2">
        {item.type === 'local' ? `🏪 ${item.shop}` : `🌐 ${item.brand}`}
      </p>

      {/* Stock badges */}
      {isOutOfStock ? (
        <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-600 mb-2">
          Out of Stock
        </span>
      ) : isLowStock ? (
        <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 mb-2">
          Only {stockLeft} left!
        </span>
      ) : null}

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
            disabled={isOutOfStock}
            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-emerald-500 transition-colors font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed"
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
};

export default Cart;
