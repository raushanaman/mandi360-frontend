import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../utils/api';
import axios from 'axios';
import {
  HiOutlineArrowLeft, HiOutlineShoppingCart,
  HiOutlineLocationMarker, HiOutlineTrash,
  HiOutlineChevronLeft, HiOutlineChevronRight,
} from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ANGLE_LABELS = ['Front', 'Back', 'Left Side', 'Right Side', 'Top', 'Bottom'];
const ANGLE_ICONS  = ['📸', '🔄', '◀️', '▶️', '⬆️', '⬇️'];

const TAG_COLORS = {
  'Best Seller': 'bg-amber-500 text-white',
  'New':         'bg-blue-500 text-white',
  'Popular':     'bg-purple-500 text-white',
  'Trending':    'bg-red-500 text-white',
  'Fresh':       'bg-emerald-500 text-white',
  'Organic':     'bg-green-500 text-white',
};

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const { addToCart } = useCart();

  const [product,    setProduct]   = useState(null);
  const [shop,       setShop]      = useState(null);
  const [reviews,    setReviews]   = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [activeImg,  setActiveImg] = useState(0);
  const [dragDir,    setDragDir]   = useState(-1);
  const [zoom,       setZoom]      = useState(false);
  const [zoomPos,    setZoomPos]   = useState({ x: 50, y: 50 });
  const [added,      setAdded]     = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [tab,        setTab]       = useState('description');
  const [selVariants, setSelVariants] = useState({}); // { variantLabel: optionValue }
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewImages, setReviewImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [reviewErr,  setReviewErr]  = useState('');

  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: prod } = await axios.get(`${API}/products/${productId}`);
        setProduct(prod);
        const [shopRes, revRes] = await Promise.all([
          axios.get(`${API}/shops/${prod.shop}`),
          axios.get(`${API}/reviews/${prod.shop}`),
        ]);
        setShop(shopRes.data);
        setReviews(revRes.data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [productId]);

  const baseImages = product?.images?.length
    ? product.images
    : product?.image ? [product.image] : [];

  // Agar images 6 se kam hain toh baaki slots first image se fill karo
  const allImages = baseImages.length > 0
    ? [...baseImages, ...Array(Math.max(0, 6 - baseImages.length)).fill(baseImages[0])]
    : [];

  const prevImg = () => {
    setDragDir(1);
    setActiveImg(i => (i - 1 + allImages.length) % allImages.length);
  };
  const nextImg = () => {
    setDragDir(-1);
    setActiveImg(i => (i + 1) % allImages.length);
  };

  const selectedPrice = (() => {
    if (!product?.variants?.length) return product?.price;
    for (const v of product.variants) {
      const sel = selVariants[v.label];
      if (sel) {
        const opt = v.options.find(o => o.value === sel);
        if (opt?.price) return opt.price;
      }
    }
    return product?.price;
  })();

  const handleAddToCart = () => {
    if (!product.inStock || product.stock === 0) {
      alert('Product is out of stock');
      return;
    }
    addToCart({
      id:       product._id,
      name:     product.name,
      price:    selectedPrice,
      emoji:    product.emoji || '📦',
      image:    allImages[0] || null,
      type:     'local',
      shop:     shop?.name || '',
      shopId:   shop?._id || null,
      variants: selVariants,
      stock:    product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top)  / rect.height) * 100,
    });
  };

  const toggleWishlist = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await axios.patch(`${API}/user/wishlist/${product._id}`, {}, { headers });
      setWishlisted(w => !w);
    } catch {}
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true); setReviewErr('');
    try {
      const fd = new FormData();
      fd.append('rating', reviewForm.rating);
      fd.append('comment', reviewForm.comment);
      reviewImages.forEach(f => fd.append('images', f));
      const { data } = await axios.post(
        `${API}/reviews/${shop._id}`,
        fd, { headers: { ...headers, 'Content-Type': 'multipart/form-data' } }
      );
      setReviews(prev => [data, ...prev]);
      setReviewForm({ rating: 5, comment: '' });
      setReviewImages([]);
    } catch (err) {
      setReviewErr(err.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleHelpful = async (reviewId) => {
    try {
      const { data } = await axios.patch(`${API}/reviews/${reviewId}/helpful`, {}, { headers });
      setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, helpful: Array(data.helpful).fill('') } : r));
    } catch {}
  };

  const deleteReview = async (id) => {
    await axios.delete(`${API}/reviews/${id}`, { headers });
    setReviews(prev => prev.filter(r => r._id !== id));
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const hasReviewed = user && reviews.some(r => r.user?._id === user._id);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="text-6xl mb-4">📦</div>
      <h2 className="text-2xl font-black text-slate-900 mb-2">Product Not Found</h2>
      <button onClick={() => navigate(-1)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-500 transition-colors mt-4">
        Go Back
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-slate-400">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-slate-900 font-semibold transition-colors">
            <HiOutlineArrowLeft size={14} /> Back
          </button>
          <span>/</span>
          {shop && <Link to={`/shop/${shop._id}`} className="hover:text-slate-900 transition-colors">{shop.name}</Link>}
          <span>/</span>
          <span className="text-slate-600 font-semibold truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── LEFT: Image Gallery ── */}
          <div className="space-y-4">
            <div className="flex gap-4">

              {/* Vertical thumbnails - desktop */}
              {allImages.length > 1 && (
                <div className="hidden lg:flex flex-col gap-2 flex-shrink-0">
                  {allImages.map((img, idx) => (
                    <motion.button key={idx} whileHover={{ scale: 1.05 }}
                      onClick={() => { setDragDir(idx > activeImg ? -1 : 1); setActiveImg(idx); }}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImg === idx ? 'border-slate-900 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] font-bold text-center py-0.5">
                        {ANGLE_LABELS[idx] || `${idx + 1}`}
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Main image area */}
              <div className="flex-1 space-y-3">

                {/* Main image */}
                <div
                  className="relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm aspect-square select-none"
                  onMouseEnter={() => setZoom(true)}
                  onMouseLeave={() => setZoom(false)}
                  onMouseMove={handleMouseMove}
                >
                  <AnimatePresence mode="wait" custom={dragDir}>
                    {allImages.length > 0 ? (
                      <motion.img
                        key={activeImg}
                        custom={dragDir}
                        variants={{
                          enter:  d => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
                          center: ()  => ({ x: 0, opacity: 1 }),
                          exit:   d => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
                        }}
                        initial="enter" animate="center" exit="exit"
                        transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                        src={allImages[activeImg]}
                        alt={ANGLE_LABELS[activeImg] || product.name}
                        className="w-full h-full object-cover"
                        style={zoom ? {
                          transform: 'scale(2)',
                          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                          cursor: 'zoom-in',
                        } : {}}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-8xl">
                        {product.emoji || '📦'}
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Angle badge */}
                  {allImages.length > 0 && (
                    <motion.div key={`badge-${activeImg}`}
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className="absolute top-4 left-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 flex items-center gap-1.5"
                    >
                      <span>{ANGLE_ICONS[activeImg] || '📸'}</span>
                      {ANGLE_LABELS[activeImg] || `Photo ${activeImg + 1}`}
                    </motion.div>
                  )}

                  {product.tag && (
                    <span className={`absolute top-4 right-4 text-[10px] font-black uppercase tracking-wide px-3 py-1.5 rounded-full z-10 ${TAG_COLORS[product.tag] || 'bg-slate-900 text-white'}`}>
                      {product.tag}
                    </span>
                  )}

                  {!product.inStock && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                      <span className="bg-slate-900 text-white font-black px-6 py-3 rounded-2xl text-sm">Out of Stock</span>
                    </div>
                  )}


                </div>

                {/* Prev / Next navigation bar */}
                {allImages.length > 0 && (
                  <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                    <button onClick={prevImg}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white font-bold text-sm transition-all"
                    >
                      <HiOutlineChevronLeft size={16} /> Prev
                    </button>
                    <div className="text-center">
                      <p className="text-xs font-black text-slate-900">
                        {ANGLE_ICONS[activeImg]} {ANGLE_LABELS[activeImg] || `Photo ${activeImg + 1}`}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{activeImg + 1} of {allImages.length}</p>
                    </div>
                    <button onClick={nextImg}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white font-bold text-sm transition-all"
                    >
                      Next <HiOutlineChevronRight size={16} />
                    </button>
                  </div>
                )}

                {/* Mobile horizontal thumbnails */}
                {allImages.length > 1 && (
                  <div className="flex lg:hidden gap-2 overflow-x-auto pb-1">
                    {allImages.map((img, idx) => (
                      <motion.button key={idx} whileHover={{ scale: 1.05 }}
                        onClick={() => { setDragDir(idx > activeImg ? -1 : 1); setActiveImg(idx); }}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                          activeImg === idx ? 'border-slate-900 shadow-md' : 'border-slate-200 opacity-60'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] font-bold text-center py-0.5">
                          {ANGLE_LABELS[idx] || `${idx + 1}`}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Angle pills */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                    {allImages.map((_, idx) => (
                      <button key={idx}
                        onClick={() => { setDragDir(idx > activeImg ? -1 : 1); setActiveImg(idx); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                          activeImg === idx
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <span>{ANGLE_ICONS[idx] || '📸'}</span>
                        {ANGLE_LABELS[idx] || `View ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="space-y-6">

            {shop && (
              <Link to={`/shop/${shop._id}`} className="inline-flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors">
                🏪 {shop.name}
                {shop.city && (
                  <span className="flex items-center gap-1 text-slate-400 font-normal normal-case">
                    <HiOutlineLocationMarker size={12} /> {shop.city}
                  </span>
                )}
              </Link>
            )}

            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-3">{product.name}</h1>
              {reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`text-base ${s <= Math.round(avgRating) ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                    ))}
                  </div>
                  <span className="font-black text-slate-900">{avgRating}</span>
                  <span className="text-slate-400 text-sm">({reviews.length} reviews)</span>
                </div>
              )}
              <span className="text-4xl font-black text-slate-900">₹{selectedPrice?.toLocaleString()}</span>
            </div>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="space-y-3">
                {product.variants.map(v => (
                  <div key={v.label}>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{v.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {v.options.map(opt => (
                        <button key={opt.value}
                          onClick={() => setSelVariants(prev => ({ ...prev, [v.label]: opt.value }))}
                          disabled={!opt.inStock}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${
                            selVariants[v.label] === opt.value
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : opt.inStock
                                ? 'border-slate-200 text-slate-700 hover:border-slate-400'
                                : 'border-slate-100 text-slate-300 line-through cursor-not-allowed'
                          }`}
                        >
                          {opt.value}{opt.price ? ` · ₹${opt.price}` : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-red-400'}`} />
              <span className={`text-sm font-bold ${product.inStock ? 'text-emerald-600' : 'text-red-500'}`}>
                {product.inStock ? 'In Stock - Ready to ship' : 'Out of Stock'}
              </span>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all shadow-lg ${
                  added
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-900 text-white hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                <HiOutlineShoppingCart size={20} />
                {added ? '✅ Added to Cart!' : 'Add to Cart'}
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={toggleWishlist}
                className={`w-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                  wishlisted ? 'bg-red-50 border-red-300 text-red-500' : 'border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-400'
                }`}
              >
                {wishlisted ? '❤️' : '🤍'}
              </motion.button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-100">
                {['description', 'details'].map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 py-3.5 text-sm font-bold transition-all ${
                      tab === t ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {t === 'description' ? '📋 Description' : '🏷️ Details'}
                  </button>
                ))}
              </div>
              <div className="p-5">
                {tab === 'description' ? (
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {product.desc || 'No description available.'}
                  </p>
                ) : (
                  <div className="space-y-0 text-sm">
                    {[
                      { label: 'Category', value: product.category },
                      { label: 'Tag',      value: product.tag || '—' },
                      { label: 'Stock',    value: product.inStock ? 'Available' : 'Out of Stock' },
                      { label: 'Shop',     value: shop?.name || '—' },
                      { label: 'City',     value: shop?.city || '—' },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between py-2.5 border-b border-slate-50 last:border-0">
                        <span className="text-slate-400 font-semibold">{row.label}</span>
                        <span className="text-slate-900 font-bold capitalize">{row.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Reviews ── */}
        <div className="mt-14">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Customer Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`text-lg ${s <= Math.round(avgRating) ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                ))}
              </div>
              <span className="font-black text-slate-900 text-lg">{avgRating}</span>
              <span className="text-slate-400">out of 5 · {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              {user && !hasReviewed ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
                  <h3 className="font-black text-slate-900 mb-4">Write a Review</h3>
                  <form onSubmit={submitReview} className="space-y-4">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                          className={`text-3xl transition-all hover:scale-110 ${s <= reviewForm.rating ? 'text-amber-400' : 'text-slate-200'}`}
                        >★</button>
                      ))}
                    </div>
                    <textarea required rows={4} placeholder="Share your experience..."
                      value={reviewForm.comment}
                      onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400 resize-none"
                    />
                    {/* Review photo upload */}
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Add Photos (optional, max 3)</label>
                      <input type="file" accept="image/*" multiple
                        onChange={e => setReviewImages(Array.from(e.target.files).slice(0,3))}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 file:font-bold hover:file:bg-slate-200"
                      />
                      {reviewImages.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {reviewImages.map((f,i) => (
                            <img key={i} src={URL.createObjectURL(f)} alt="" className="w-14 h-14 rounded-lg object-cover border border-slate-200" />
                          ))}
                        </div>
                      )}
                    </div>
                    {reviewErr && <p className="text-red-500 text-xs">{reviewErr}</p>}
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      type="submit" disabled={submitting}
                      className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-500 transition-colors disabled:opacity-60"
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </motion.button>
                  </form>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 text-center">
                  {!user
                    ? <><p className="text-slate-500 text-sm mb-3">Login to write a review</p>
                        <Link to="/login" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-500 transition-colors inline-block">Login</Link></>
                    : <p className="text-slate-500 text-sm">You've already reviewed this shop ✅</p>
                  }
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-4">
              {reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-slate-100">
                  <div className="text-5xl mb-3">⭐</div>
                  <h3 className="font-bold text-slate-900 mb-1">No reviews yet</h3>
                  <p className="text-slate-500 text-sm">Be the first to review</p>
                </div>
              ) : (
                <AnimatePresence>
                  {reviews.map(r => (
                    <motion.div key={r._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black flex-shrink-0">
                            {r.user?.firstName?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{r.user?.firstName} {r.user?.lastName}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {[1,2,3,4,5].map(s => (
                                <span key={s} className={`text-sm ${s <= r.rating ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                              ))}
                              <span className="text-xs text-slate-400 ml-1">
                                {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>
                        {user?._id === r.user?._id && (
                          <button onClick={() => deleteReview(r._id)}
                            className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <HiOutlineTrash size={15} />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-3 leading-relaxed">{r.comment}</p>
                      {/* Review images */}
                      {r.images?.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {r.images.map((img,i) => (
                            <img key={i} src={img} alt="" className="w-16 h-16 rounded-lg object-cover border border-slate-100" />
                          ))}
                        </div>
                      )}
                      {/* Helpful vote */}
                      <button onClick={() => toggleHelpful(r._id)}
                        className="mt-2 text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors"
                      >
                        👍 Helpful ({r.helpful?.length || 0})
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
