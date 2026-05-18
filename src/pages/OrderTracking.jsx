import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';

import API from '../utils/api';

const STATUS_META = {
  pending:          { label: 'Pending',          color: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-400'   },
  confirmed:        { label: 'Confirmed',        color: 'bg-blue-100 text-blue-700',       dot: 'bg-blue-500'    },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700',   dot: 'bg-orange-500'  },
  delivered:        { label: 'Delivered',        color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  cancelled:        { label: 'Cancelled',        color: 'bg-red-100 text-red-600',         dot: 'bg-red-400'     },
};

const TIMELINE = [
  { key: 'confirmed',        label: 'Order Confirmed',  icon: '✅' },
  { key: 'pending',          label: 'Being Prepared',   icon: '🍳' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚' },
  { key: 'delivered',        label: 'Delivered',        icon: '🎉' },
];

// Status ka timeline index
const STATUS_ORDER = ['confirmed', 'pending', 'out_for_delivery', 'delivered'];

const OrderTracking = () => {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [orders,   setOrders]  = useState([]);
  const [loading,  setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!user) return;

    const fetchOrders = () => {
      const tok = localStorage.getItem('token');
      axios.get(`${API}/orders/my`, { headers: { Authorization: `Bearer ${tok}` } })
        .then(r => {
          setOrders(r.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, [user]);

  const handleCancel = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(orderId);
    const tok = localStorage.getItem('token');
    try {
      const { data } = await axios.patch(
        `${API}/orders/${orderId}/cancel`,
        { reason: 'Cancelled by user' },
        { headers: { Authorization: `Bearer ${tok}` } }
      );
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: data.status } : o));
    } catch { alert('Could not cancel order'); }
    finally { setCancelling(null); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-black text-slate-900">My Orders</h1>
          <p className="text-slate-500 text-sm mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-4">
        {orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-5xl mb-6">
              <HiOutlineShoppingBag size={40} className="text-slate-300" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">No orders yet</h2>
            <p className="text-slate-500 mb-6">Start shopping from local shops near you</p>
            <button onClick={() => navigate('/shops')}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-500 transition-colors"
            >
              Browse Shops
            </button>
          </motion.div>
        ) : (
          <AnimatePresence>
            {orders.map((order, i) => {
              const meta    = STATUS_META[order.status] || STATUS_META.pending;
              const isOpen  = expanded === order._id;

              return (
                <motion.div key={order._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-5 flex items-center justify-between gap-4 cursor-pointer"
                    onClick={() => setExpanded(isOpen ? null : order._id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        🛍️
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {' · '}{order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="font-black text-slate-900">₹{order.total?.toLocaleString()}</p>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${meta.color}`}>
                          {meta.label}
                        </span>
                      </div>
                      {isOpen ? <HiOutlineChevronUp size={18} className="text-slate-400" /> : <HiOutlineChevronDown size={18} className="text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-5">

                          {/* Timeline */}
                          {order.status !== 'cancelled' && (
                            <div className="flex items-center gap-1">
                              {TIMELINE.map((step, idx) => {
                                const stepIdx = STATUS_ORDER.indexOf(order.status);
                                const done    = idx <= stepIdx;
                                const active  = idx === stepIdx;
                                return (
                                  <div key={step.key} className="flex items-center flex-1">
                                    <div className={`flex flex-col items-center gap-1 flex-shrink-0 transition-all ${
                                      done ? 'opacity-100' : 'opacity-30'
                                    }`}>
                                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base border-2 transition-all ${
                                        active ? 'border-orange-500 bg-orange-50 scale-110 shadow-md' :
                                        done   ? 'border-emerald-500 bg-emerald-50' :
                                                 'border-slate-200 bg-white'
                                      }`}>
                                        {step.icon}
                                      </div>
                                      <p className={`text-[9px] font-bold text-center w-16 ${
                                        active ? 'text-orange-600' : 'text-slate-500'
                                      }`}>{step.label}</p>
                                    </div>
                                    {idx < TIMELINE.length - 1 && (
                                      <div className={`flex-1 h-0.5 mx-1 mb-4 transition-all ${
                                        idx < stepIdx ? 'bg-emerald-400' : 'bg-slate-200'
                                      }`} />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Items */}
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl border border-slate-100 overflow-hidden flex-shrink-0">
                                  {item.image
                                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    : <span>{item.emoji || '📦'}</span>
                                  }
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                                  <p className="text-xs text-slate-400">🏪 {item.shop} · Qty: {item.qty}</p>
                                </div>
                                <p className="font-bold text-slate-900 text-sm flex-shrink-0">₹{(item.price * item.qty).toLocaleString()}</p>
                              </div>
                            ))}
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <div className="text-xs text-slate-400 space-y-0.5">
                              {order.paymentId && <p>💳 {order.paymentId}</p>}
                              {order.paymentMethod === 'cod' && <p>💵 Cash on Delivery</p>}
                              {order.address && <p>📍 {order.address.street}, {order.address.city}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                              {['pending','confirmed'].includes(order.status) && (
                                <button onClick={() => handleCancel(order._id)} disabled={cancelling === order._id}
                                  className="text-xs font-bold text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-60"
                                >
                                  {cancelling === order._id ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                              )}
                              <p className="font-black text-slate-900">₹{order.total?.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
