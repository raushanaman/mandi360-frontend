import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineRefresh, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';
import API from '../utils/api';

const STATUS_META = {
  pending:          { label: 'Pending',          color: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-400'    },
  confirmed:        { label: 'Confirmed',        color: 'bg-blue-100 text-blue-700',       dot: 'bg-blue-500'     },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700',   dot: 'bg-orange-500'   },
  delivered:        { label: 'Delivered',        color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500'  },
  cancelled:        { label: 'Cancelled',        color: 'bg-red-100 text-red-600',         dot: 'bg-red-400'      },
};

const NEXT_STATUS = {
  pending:          'confirmed',
  confirmed:        'out_for_delivery',
  out_for_delivery: 'delivered',
};

const NEXT_LABEL = {
  pending:          'Mark as Confirmed',
  confirmed:        'Out for Delivery 🚚',
  out_for_delivery: 'Mark as Delivered ✅',
};

const MerchantOrders = () => {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [orders,    setOrders]   = useState([]);
  const [loading,   setLoading]  = useState(true);
  const [expanded,  setExpanded] = useState(null);
  const [filter,    setFilter]   = useState('all');
  const [updating,  setUpdating] = useState(null);

  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'merchant') { navigate('/'); return; }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/orders/shop`, { headers });
      setOrders(data);
    } catch { }
    finally { setLoading(false); }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const { data } = await axios.patch(
        `${API}/orders/${orderId}/status`,
        { status: newStatus },
        { headers }
      );
      // Backend se jo status aaya woh use karo
      const updatedStatus = data.order?.status || data.status;
      setOrders(prev => prev.map(o =>
        o._id === orderId ? { ...o, status: updatedStatus } : o
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const stats = {
    total:     orders.length,
    pending:   orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    // Revenue: sirf delivered orders count karo, cancelled aur pending COD exclude
    revenue:   orders
      .filter(o => o.status === 'delivered')
      .reduce((s, o) => s + (o.total || 0), 0),
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Shop Orders</h1>
            <p className="text-slate-500 text-sm">{orders.length} total orders received</p>
          </div>
          <button onClick={fetchOrders} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
            <HiOutlineRefresh size={16} /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: 'Total',     value: stats.total,                  color: 'text-slate-900' },
            { label: 'Pending',   value: stats.pending,                color: 'text-amber-600' },
            { label: 'Confirmed', value: stats.confirmed,              color: 'text-blue-600'  },
            { label: 'Delivered', value: stats.delivered,              color: 'text-emerald-600' },
            { label: 'Revenue',   value: `₹${stats.revenue.toLocaleString()}`, color: 'text-red-500' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'confirmed', 'delivered', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                filter === f ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              {f === 'all' ? `All (${orders.length})` : `${f} (${orders.filter(o => o.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="font-bold text-slate-900 mb-1">No orders here</h3>
            <p className="text-slate-500 text-sm">Orders will appear here when customers purchase from your shop</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((order, i) => {
                const meta   = STATUS_META[order.status] || STATUS_META.pending;
                const isOpen = expanded === order._id;
                const next   = NEXT_STATUS[order.status];

                return (
                  <motion.div key={order._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                  >
                    <div className="p-5 flex items-center justify-between gap-4 cursor-pointer"
                      onClick={() => setExpanded(isOpen ? null : order._id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${meta.dot}`} />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-xs text-slate-400">
                            {order.user?.firstName} {order.user?.lastName} ·{' '}
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${meta.color}`}>
                          {meta.label}
                        </span>
                        <p className="font-black text-slate-900 text-sm">₹{order.total?.toLocaleString()}</p>
                        {isOpen ? <HiOutlineChevronUp size={16} className="text-slate-400" /> : <HiOutlineChevronDown size={16} className="text-slate-400" />}
                      </div>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
                            {/* Customer Info */}
                            <div className="text-xs text-slate-500 space-y-1">
                              <p>👤 {order.user?.firstName} {order.user?.lastName} · {order.user?.email}</p>
                              {order.address && (
                                <p>📍 {typeof order.address === 'object'
                                  ? `${order.address.street || ''}, ${order.address.city || ''}, ${order.address.state || ''} - ${order.address.pincode || ''}`
                                  : order.address}
                                </p>
                              )}
                              <p>
                                {order.paymentMethod === 'cod'
                                  ? <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">💵 Cash on Delivery</span>
                                  : <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">💳 Online Payment</span>
                                }
                                {order.paymentId && <span className="ml-2 text-slate-400">{order.paymentId}</span>}
                              </p>
                            </div>

                            {/* Items */}
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-lg border border-slate-100 overflow-hidden flex-shrink-0">
                                    {item.image
                                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                      : <span>{item.emoji || '📦'}</span>
                                    }
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                                    <p className="text-xs text-slate-400">Qty: {item.qty} · ₹{item.price} each</p>
                                  </div>
                                  <p className="font-bold text-sm text-slate-900">₹{(item.price * item.qty).toLocaleString()}</p>
                                </div>
                              ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-1">
                              {next && (
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                  onClick={() => handleStatusUpdate(order._id, next)}
                                  disabled={updating === order._id}
                                  className={`flex-1 text-white py-2.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-60 ${
                                    next === 'out_for_delivery' ? 'bg-orange-500 hover:bg-orange-600' :
                                    next === 'delivered'        ? 'bg-emerald-600 hover:bg-emerald-700' :
                                    'bg-slate-900 hover:bg-blue-600'
                                  }`}
                                >
                                  {updating === order._id ? 'Updating...' : NEXT_LABEL[order.status]}
                                </motion.button>
                              )}
                              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                  onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                                  disabled={updating === order._id}
                                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60"
                                >
                                  Cancel
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantOrders;
