import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineTrash, HiOutlineRefresh, HiOutlineShoppingBag,
  HiOutlineUsers, HiOutlineOfficeBuilding, HiOutlineChartBar,
} from 'react-icons/hi';

import API from '../utils/api';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [stats,   setStats]   = useState(null);
  const [shops,   setShops]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState('overview');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin') { navigate('/'); return; }
    fetchAll();
  }, [user]);

  // Also fetch when loading completes
  useEffect(() => {
    if (user?.role === 'admin') fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const hdrs  = { Authorization: `Bearer ${token}` };
      const [s, sh] = await Promise.all([
        axios.get(`${API}/admin/stats`, { headers: hdrs }),
        axios.get(`${API}/admin/shops`, { headers: hdrs }),
      ]);
      setStats(s.data);
      setShops(sh.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this shop?')) return;
    const token = localStorage.getItem('token');
    await axios.delete(`${API}/admin/shops/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setShops(prev => prev.filter(s => s._id !== id));
    setStats(prev => ({ ...prev, totalShops: prev.totalShops - 1 }));
  };

  const handleToggle = async (id) => {
    const token = localStorage.getItem('token');
    const { data } = await axios.patch(`${API}/admin/shops/${id}/toggle`, {}, { headers: { Authorization: `Bearer ${token}` } });
    setShops(prev => prev.map(s => s._id === id ? data : s));
  };

  if (loading || !user) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Admin Panel</h1>
            <p className="text-slate-500 text-sm">Mandi-360 Dashboard</p>
          </div>
          <button onClick={fetchAll} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
            <HiOutlineRefresh size={16} /> Refresh
          </button>
        </div>
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 flex gap-1 pb-0">
          {['overview', 'shops'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-bold capitalize border-b-2 transition-colors ${
                tab === t ? 'border-red-500 text-red-500' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Overview Tab ── */}
        {tab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <StatCard icon={<HiOutlineOfficeBuilding size={22} />} label="Total Shops"  value={stats.totalShops}  color="bg-blue-50 text-blue-600" />
              <StatCard icon={<HiOutlineShoppingBag   size={22} />} label="Total Orders" value={stats.totalOrders} color="bg-emerald-50 text-emerald-600" />
              <StatCard icon={<HiOutlineUsers         size={22} />} label="Total Users"  value={stats.totalUsers}  color="bg-purple-50 text-purple-600" />
            </div>

            {/* Top Shops */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <HiOutlineChartBar size={18} className="text-red-500" />
                <h2 className="font-black text-slate-900">Top Shops by Purchases</h2>
              </div>
              {stats.topShops.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-10">No purchase data yet</p>
              ) : (
                <div className="divide-y divide-slate-50">
                  {stats.topShops.map((s, i) => (
                    <div key={s._id} className="flex items-center gap-4 px-6 py-4">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                        i === 0 ? 'bg-yellow-100 text-yellow-700' :
                        i === 1 ? 'bg-slate-100 text-slate-600' :
                        i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'
                      }`}>{i + 1}</span>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm">{s._id || 'Unknown Shop'}</p>
                        <p className="text-xs text-slate-400">₹{(s.revenue || 0).toLocaleString()} revenue</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900">{s.totalPurchases}</p>
                        <p className="text-xs text-slate-400">units sold</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Shops Tab ── */}
        {tab === 'shops' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-black text-slate-900">All Shops ({shops.length})</h2>
            </div>
            <div className="divide-y divide-slate-50">
              <AnimatePresence>
                {shops.map(shop => (
                  <motion.div
                    key={shop._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-4 px-6 py-4"
                  >
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      🏪
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{shop.name}</p>
                      <p className="text-xs text-slate-400">{shop.category} · {shop.city || 'N/A'}</p>
                      <p className="text-xs text-slate-400">
                        Owner: {shop.owner?.firstName} {shop.owner?.lastName} ({shop.owner?.email})
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleToggle(shop._id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          shop.status === 'open'
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {shop.status === 'open' ? 'Open' : 'Closed'}
                      </button>
                      <button
                        onClick={() => handleDelete(shop._id)}
                        className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <HiOutlineTrash size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {shops.length === 0 && (
                <p className="text-slate-400 text-sm text-center py-10">No shops found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>{icon}</div>
    <div>
      <p className="text-2xl font-black text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  </div>
);

export default AdminPanel;
