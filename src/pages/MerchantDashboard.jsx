import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineTrash, HiOutlinePencil, HiOutlinePlus, HiOutlinePhotograph, HiOutlineX, HiOutlineSearch, HiOutlineUpload } from 'react-icons/hi';

import API from '../utils/api';
const EMPTY = { name: '', price: '', desc: '', tag: '', emoji: '', inStock: true, stock: '' };
const ANGLES = ['Front', 'Back', 'Left Side', 'Right Side', 'Top', 'Bottom'];
const ANGLE_ICONS = ['📸', '🔄', '◀️', '▶️', '⬆️', '⬇️'];
const TAGS = ['Best Seller', 'New', 'Popular', 'Trending', 'Fresh', 'Organic'];

const MerchantDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [shop, setShop] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [angleFiles, setAngleFiles] = useState(Array(6).fill(null));
  const [anglePreviews, setAnglePreviews] = useState(Array(6).fill(null));
  const [dragOver, setDragOver] = useState(null);
  const [variants, setVariants] = useState([]); // [{ label, options: [{value, price, inStock}] }]
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [csvUploading, setCsvUploading] = useState(false);
  const fileRefs = useRef([]);
  const csvRef = useRef();

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'merchant') { navigate('/'); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const shopRes = await axios.get(`${API}/shops/my/shop`, { headers });
      const shopData = Array.isArray(shopRes.data) ? shopRes.data : [shopRes.data];
      setShops(shopData);
      const firstShop = shopData[0] || null;
      setShop(firstShop);
      if (firstShop) {
        const prodRes = await axios.get(`${API}/products/shop/${firstShop._id}`);
        setProducts(prodRes.data);
      }
    } catch (err) {
      if (err.response?.status === 404) { setShop(null); setShops([]); }
    } finally {
      setLoading(false);
    }
  };

  // Shop change hone pe us shop ke products fetch karo
  const handleShopChange = async (shopId) => {
    const selected = shops.find(s => s._id === shopId);
    setShop(selected);
    try {
      const { data } = await axios.get(`${API}/products/shop/${shopId}`);
      setProducts(data);
    } catch {
      setProducts([]);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setAngleFiles(Array(6).fill(null));
    setAnglePreviews(Array(6).fill(null));
    setVariants([]);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, price: p.price, desc: p.desc || '', tag: p.tag || '', emoji: p.emoji || '', inStock: p.inStock, stock: p.stock ?? '' });
    setAngleFiles(Array(6).fill(null));
    const existing = p.images?.length ? p.images : (p.image ? [p.image] : []);
    const previews = Array(6).fill(null);
    existing.forEach((url, i) => { if (i < 6) previews[i] = url; });
    setAnglePreviews(previews);
    setVariants(p.variants || []);
    setShowForm(true);
  };

  // ── Fix 2: Drag & Drop reorder ──
  const handleDragStart = (e, idx) => e.dataTransfer.setData('slotIdx', idx);
  const handleDrop = (e, toIdx) => {
    e.preventDefault();
    const fromIdx = Number(e.dataTransfer.getData('slotIdx'));
    if (fromIdx === toIdx) return;
    const newFiles = [...angleFiles];
    const newPrev  = [...anglePreviews];
    [newFiles[fromIdx], newFiles[toIdx]] = [newFiles[toIdx], newFiles[fromIdx]];
    [newPrev[fromIdx],  newPrev[toIdx]]  = [newPrev[toIdx],  newPrev[fromIdx]];
    setAngleFiles(newFiles);
    setAnglePreviews(newPrev);
    setDragOver(null);
  };

  const handleAngleImage = (slotIdx, file) => {
    if (!file) return;
    // Fix 1: client-side size check (5MB)
    if (file.size > 5 * 1024 * 1024) { alert('Image 5MB se badi nahi honi chahiye'); return; }
    setAngleFiles(prev => { const a = [...prev]; a[slotIdx] = file; return a; });
    setAnglePreviews(prev => { const a = [...prev]; a[slotIdx] = URL.createObjectURL(file); return a; });
  };

  const removeAngle = (slotIdx) => {
    setAngleFiles(prev => { const a = [...prev]; a[slotIdx] = null; return a; });
    setAnglePreviews(prev => { const a = [...prev]; a[slotIdx] = null; return a; });
  };

  // ── Fix 3: Variants ──
  const addVariant = () => setVariants(v => [...v, { label: '', options: [{ value: '', price: '', inStock: true }] }]);
  const removeVariant = (vi) => setVariants(v => v.filter((_, i) => i !== vi));
  const updateVariantLabel = (vi, label) => setVariants(v => v.map((x, i) => i === vi ? { ...x, label } : x));
  const addOption = (vi) => setVariants(v => v.map((x, i) => i === vi ? { ...x, options: [...x.options, { value: '', price: '', inStock: true }] } : x));
  const removeOption = (vi, oi) => setVariants(v => v.map((x, i) => i === vi ? { ...x, options: x.options.filter((_, j) => j !== oi) } : x));
  const updateOption = (vi, oi, key, val) => setVariants(v => v.map((x, i) => i === vi ? { ...x, options: x.options.map((o, j) => j === oi ? { ...o, [key]: val } : o) } : x));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasImage = angleFiles.some(f => f !== null) || anglePreviews.some(p => p !== null);
    if (!hasImage) { alert('Kam se kam 1 image upload karo'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (shop?._id) fd.append('shopId', shop._id);
      fd.append('variants', JSON.stringify(variants));
      anglePreviews.forEach((url, idx) => {
        if (url && !angleFiles[idx]) fd.append('existingImages', url);
        else fd.append('existingImages', '');
      });
      angleFiles.forEach((f, idx) => { if (f) { fd.append('images', f); fd.append('imageSlots', idx); } });

      if (editing) {
        const { data } = await axios.put(`${API}/products/${editing._id}`, fd, {
          headers: { ...headers, 'Content-Type': 'multipart/form-data' },
        });
        setProducts(prev => prev.map(p => p._id === editing._id ? data : p));
      } else {
        const { data } = await axios.post(`${API}/products`, fd, {
          headers: { ...headers, 'Content-Type': 'multipart/form-data' },
        });
        setProducts(prev => [data, ...prev]);
      }
      setShowForm(false);
      // Refresh products for current shop
      if (shop?._id) {
        const { data: refreshed } = await axios.get(`${API}/products/shop/${shop._id}`);
        setProducts(refreshed);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await axios.delete(`${API}/products/${id}`, { headers });
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  // ── Fix 5: CSV Bulk Upload ──
  const handleCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvUploading(true);
    try {
      const fd = new FormData();
      fd.append('csv', file);
      const { data } = await axios.post(`${API}/products/bulk-csv`, fd, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' },
      });
      alert(`✅ ${data.message}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'CSV upload failed');
    } finally {
      setCsvUploading(false);
      e.target.value = '';
    }
  };

  // ── Fix 4: Search & Filter ──
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchTag    = filterTag   ? p.tag === filterTag : true;
    const matchStock  = filterStock === 'in' ? p.inStock : filterStock === 'out' ? !p.inStock : true;
    return matchSearch && matchTag && matchStock;
  });

  const lowStockProducts = products.filter(p => p.inStock && p.stock > 0 && p.stock <= 5);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!shop) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-4xl mb-4">🏪</div>
      <h2 className="text-xl font-black text-slate-900 mb-2">No shop registered yet</h2>
      <p className="text-slate-500 mb-6">Register your shop first to manage products</p>
      <button onClick={() => navigate('/register-shop')}
        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-500 transition-colors"
      >
        Register Shop
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">{shop?.name || 'My Shop'}</h1>
            <p className="text-slate-500 text-sm">{products.length} products · {shop?.category}</p>
          </div>
          <div className="flex items-center gap-2">
            {shops.length > 1 && (
              <select
                value={shop?._id || ''}
                onChange={e => handleShopChange(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-slate-400 bg-white"
              >
                {shops.map(s => <option key={s._id} value={s._id}>🏪 {s.name}</option>)}
              </select>
            )}
            {/* Fix 5: CSV Upload Button */}
            <button onClick={() => csvRef.current.click()} disabled={csvUploading}
              className="flex items-center gap-2 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors disabled:opacity-60"
            >
              <HiOutlineUpload size={15} /> {csvUploading ? 'Uploading...' : 'Bulk CSV'}
            </button>
            <input ref={csvRef} type="file" accept=".csv" className="hidden" onChange={handleCSV} />
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={openAdd}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-500 transition-colors"
            >
              <HiOutlinePlus size={16} /> Add Product
            </motion.button>
          </div>
        </div>

        {/* Fix 4: Search & Filter Bar */}
        <div className="max-w-5xl mx-auto px-6 pb-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <HiOutlineSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400"
            />
          </div>
          <select value={filterTag} onChange={e => setFilterTag(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-slate-400 bg-white"
          >
            <option value="">All Tags</option>
            {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterStock} onChange={e => setFilterStock(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-slate-400 bg-white"
          >
            <option value="">All Stock</option>
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {lowStockProducts.length > 0 && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
            <span className="text-xl mt-0.5">⚠️</span>
            <div>
              <p className="text-sm font-black text-amber-800">Low Stock Alert</p>
              <p className="text-xs text-amber-700 mt-0.5">
                {lowStockProducts.map(p => `${p.name} (${p.stock} left)`).join(' · ')}
              </p>
            </div>
          </div>
        )}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-4xl mb-4">📦</div>
            <h2 className="text-xl font-black text-slate-900 mb-2">{products.length === 0 ? 'No products yet' : 'No results found'}</h2>
            {products.length === 0 && (
              <button onClick={openAdd} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-500 transition-colors mt-4">
                + Add Product
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {filtered.map(p => {
                const imgs = p.images?.length ? p.images : (p.image ? [p.image] : []);
                return (
                  <motion.div key={p._id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                  >
                    <div className="h-44 bg-slate-100 flex items-center justify-center overflow-hidden relative">
                      {imgs[0] ? <img src={imgs[0]} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-5xl">{p.emoji || '📦'}</span>}
                      {imgs.length > 1 && (
                        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          +{imgs.length - 1} more
                        </span>
                      )}
                      <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full ${p.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                      {p.inStock && p.stock > 0 && p.stock <= 5 && (
                        <span className="absolute bottom-2 left-2 bg-amber-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                          ⚠️ Only {p.stock} left
                        </span>
                      )}
                      {p.variants?.length > 0 && (
                        <span className="absolute top-2 left-2 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {p.variants.length} variant{p.variants.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 text-sm mb-0.5 truncate">{p.name}</h3>
                      <p className="text-xs text-slate-400 mb-3 line-clamp-2">{p.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900">₹{p.price}</span>
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(p)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                            <HiOutlinePencil size={15} />
                          </button>
                          <button onClick={() => handleDelete(p._id)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                            <HiOutlineTrash size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
                <h2 className="font-black text-slate-900">{editing ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-all">
                  <HiOutlineX size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">

                {/* Fix 1 + Fix 2: Image slots with drag & drop */}
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Product Images — 6 Angles</p>
                  <p className="text-[10px] text-slate-400 mb-3">Drag slots to reorder · Click empty slot to upload</p>
                  <div className="grid grid-cols-3 gap-2">
                    {ANGLES.map((label, idx) => (
                      <div key={idx} className="space-y-1"
                        draggable={!!anglePreviews[idx]}
                        onDragStart={e => handleDragStart(e, idx)}
                        onDragOver={e => { e.preventDefault(); setDragOver(idx); }}
                        onDragLeave={() => setDragOver(null)}
                        onDrop={e => handleDrop(e, idx)}
                      >
                        <p className="text-[10px] font-bold text-slate-500 text-center">{ANGLE_ICONS[idx]} {label}</p>
                        <div
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                            dragOver === idx ? 'border-red-400 bg-red-50/30 scale-105' :
                            anglePreviews[idx] ? 'border-slate-300 cursor-grab' : 'border-dashed border-slate-200 bg-slate-50 cursor-pointer'
                          }`}
                          onClick={() => !anglePreviews[idx] && fileRefs.current[idx]?.click()}
                        >
                          {anglePreviews[idx] ? (
                            <>
                              <img src={anglePreviews[idx]} alt={label} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => removeAngle(idx)}
                                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                              >✕</button>
                              <button type="button" onClick={() => fileRefs.current[idx]?.click()}
                                className="absolute bottom-1 right-1 w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs"
                              >✎</button>
                            </>
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <HiOutlinePhotograph size={20} className="text-slate-300" />
                              <p className="text-[9px] text-slate-300 mt-1">Upload</p>
                            </div>
                          )}
                        </div>
                        <input ref={el => fileRefs.current[idx] = el} type="file" accept="image/*" className="hidden"
                          onChange={e => handleAngleImage(idx, e.target.files[0])} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Basic fields */}
                <div className="grid grid-cols-2 gap-3">
                  <input required placeholder="Product name" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="col-span-2 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                  <input required type="number" placeholder="Base Price (₹)" value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                  <input type="number" placeholder="Stock Quantity" value={form.stock} min="0"
                    onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                    className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                  <input placeholder="Emoji (optional)" value={form.emoji}
                    onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
                    className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                  <select value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
                    className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-400 bg-white"
                  >
                    <option value="">Select Tag</option>
                    {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select value={form.inStock} onChange={e => setForm(f => ({ ...f, inStock: e.target.value === 'true' }))}
                    className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-400 bg-white"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                  <textarea placeholder="Description" value={form.desc} rows={3}
                    onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                    className="col-span-2 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-400 resize-none"
                  />
                </div>

                {/* Fix 3: Variants */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Variants (Size / Color / Weight)</p>
                    <button type="button" onClick={addVariant}
                      className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1"
                    >
                      <HiOutlinePlus size={13} /> Add Variant
                    </button>
                  </div>
                  {variants.map((v, vi) => (
                    <div key={vi} className="border border-slate-200 rounded-xl p-3 mb-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <input placeholder="Variant label (e.g. Size, Color)" value={v.label}
                          onChange={e => updateVariantLabel(vi, e.target.value)}
                          className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-slate-400"
                        />
                        <button type="button" onClick={() => removeVariant(vi)} className="text-red-400 hover:text-red-600">
                          <HiOutlineTrash size={14} />
                        </button>
                      </div>
                      {v.options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2 pl-2">
                          <input placeholder="Value (e.g. S, Red)" value={opt.value}
                            onChange={e => updateOption(vi, oi, 'value', e.target.value)}
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-slate-400"
                          />
                          <input placeholder="Price ₹" type="number" value={opt.price}
                            onChange={e => updateOption(vi, oi, 'price', e.target.value)}
                            className="w-20 border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-slate-400"
                          />
                          <select value={opt.inStock} onChange={e => updateOption(vi, oi, 'inStock', e.target.value === 'true')}
                            className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none bg-white"
                          >
                            <option value="true">In</option>
                            <option value="false">Out</option>
                          </select>
                          <button type="button" onClick={() => removeOption(vi, oi)} className="text-red-400 hover:text-red-600">
                            <HiOutlineX size={13} />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addOption(vi)}
                        className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 pl-2"
                      >
                        <HiOutlinePlus size={12} /> Add option
                      </button>
                    </div>
                  ))}
                </div>

                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  type="submit" disabled={saving}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-500 transition-colors disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MerchantDashboard;
