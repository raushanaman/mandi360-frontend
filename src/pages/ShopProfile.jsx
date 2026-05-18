import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../utils/api';
import axios from 'axios';
import {
  HiOutlineBadgeCheck, HiOutlineLocationMarker, HiOutlinePhone,
  HiOutlineStar, HiOutlineArrowLeft, HiOutlineHeart, HiOutlineShare, HiOutlineTrash,
} from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const TAG_COLORS = {
  'Best Seller': 'bg-amber-500 text-white',
  'New':         'bg-blue-500 text-white',
  'Popular':     'bg-purple-500 text-white',
  'Trending':    'bg-red-500 text-white',
  'Fresh':       'bg-emerald-500 text-white',
  'Organic':     'bg-green-500 text-white',
};

const ShopProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [shop,     setShop]     = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState('products');

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const [shopRes, prodRes, revRes] = await Promise.all([
          axios.get(`${API}/shops/${id}`),
          axios.get(`${API}/products/shop/${id}`),
          axios.get(`${API}/reviews/${id}`),
        ]);
        setShop(shopRes.data);
        setProducts(prodRes.data);
        setReviews(revRes.data);
      } catch {
        setShop(null);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!shop) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-6">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-5xl mb-6">🏪</div>
      <h2 className="text-3xl font-black text-slate-900 mb-2">Shop Not Found</h2>
      <p className="text-slate-500 mb-6">This shop doesn't exist or may have been removed.</p>
      <Link to="/shops" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-500 transition-colors">
        Browse All Shops
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Cover Banner */}
      <div className="relative h-56 md:h-72 overflow-hidden bg-slate-200">
        {shop.image && <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute top-5 left-6">
          <Link to="/shops" className="inline-flex items-center gap-2 bg-white/20 backdrop-blur border border-white/30 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition-all">
            <HiOutlineArrowLeft size={15} /> Back
          </Link>
        </div>

        <div className="absolute top-5 right-6 flex gap-2">
          <button className="w-9 h-9 bg-white/20 backdrop-blur border border-white/30 text-white rounded-xl flex items-center justify-center hover:bg-white/30 transition-all">
            <HiOutlineHeart size={17} />
          </button>
          <button className="w-9 h-9 bg-white/20 backdrop-blur border border-white/30 text-white rounded-xl flex items-center justify-center hover:bg-white/30 transition-all">
            <HiOutlineShare size={17} />
          </button>
        </div>

        <div className="absolute bottom-6 left-6">
          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 inline-block ${
            shop.status === 'open' ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-slate-300'
          }`}>
            {shop.status === 'open' ? '● Open Now' : '● Closed'}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-lg">{shop.name}</h1>
        </div>
      </div>

      {/* Shop Info Card */}
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 -mt-6 relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-white shadow-lg flex-shrink-0 ring-2 ring-slate-100 bg-slate-100">
              {shop.image && <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-500 font-bold text-xs uppercase tracking-widest">{shop.category}</span>
                <HiOutlineBadgeCheck className="text-blue-500" size={16} />
              </div>
              <div className="flex flex-wrap gap-4 text-slate-500 text-sm">
                {shop.city && (
                  <span className="flex items-center gap-1.5">
                    <HiOutlineLocationMarker size={14} className="text-slate-400" /> {shop.city}
                  </span>
                )}
                {shop.phone && (
                  <span className="flex items-center gap-1.5">
                    <HiOutlinePhone size={14} className="text-slate-400" /> {shop.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <HiOutlineStar size={14} className="text-amber-400" />
                  <span className="font-bold text-slate-900">{shop.rating || 0}</span>
                  <span className="text-slate-400">({shop.reviews || 0} reviews)</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex gap-1 mb-8 bg-white rounded-2xl border border-slate-100 p-1.5 w-fit shadow-sm">
          {['products', 'reviews'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                tab === t ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t === 'products' ? `📦 Products (${products.length})` : `⭐ Reviews (${reviews.length})`}
            </button>
          ))}
        </div>

        {tab === 'products' && (
          <>
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-4xl mb-4">📦</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No products yet</h3>
                <p className="text-slate-500">This shop hasn't added any products yet.</p>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {products.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} shopName={shop.name} shopId={shop._id} />
                ))}
              </motion.div>
            )}
          </>
        )}

        {tab === 'reviews' && (
          <ReviewsSection shopId={id} reviews={reviews} setReviews={setReviews} user={user} setShop={setShop} />
        )}
      </main>
    </div>
  );
};

const ProductCard = ({ product, index, shopName, shopId }) => {
  const navigate  = useNavigate();
  const allImages = product.images?.length ? product.images : (product.image ? [product.image] : []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
    >
      <div className="relative h-44 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden">
        {allImages[0] ? (
          <img src={allImages[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <span className="text-6xl">{product.emoji || '📦'}</span>
        )}
        {allImages.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {allImages.length} photos
          </span>
        )}
        {product.tag && (
          <span className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full ${TAG_COLORS[product.tag] || 'bg-slate-900 text-white'}`}>
            {product.tag}
          </span>
        )}
        {(!product.inStock || product.stock === 0) && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 text-sm mb-1 leading-tight">{product.name}</h3>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed line-clamp-2">{product.desc}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-black text-slate-900">₹{product.price}</span>
          <span className="text-xs font-bold text-red-500">View Details →</span>
        </div>
      </div>
    </motion.div>
  );
};

const ReviewsSection = ({ shopId, reviews, setReviews, user, setShop }) => {
  const [form,         setForm]         = useState({ rating: 5, comment: '' });
  const [reviewImages, setReviewImages] = useState([]);
  const [saving,       setSaving]       = useState(false);
  const [error,        setError]        = useState('');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const hasReviewed = user && reviews.some(r => r.user?._id === user._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.comment.trim()) return;
    setSaving(true); setError('');
    try {
      const fd = new FormData();
      fd.append('rating', form.rating);
      fd.append('comment', form.comment);
      reviewImages.forEach(f => fd.append('images', f));
      const { data } = await axios.post(
        `${API}/reviews/${shopId}`,
        fd, { headers: { ...headers, 'Content-Type': 'multipart/form-data' } }
      );
      setReviews(prev => [data, ...prev]);
      setShop(prev => ({ ...prev, reviews: reviews.length + 1 }));
      setForm({ rating: 5, comment: '' });
      setReviewImages([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting review');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (reviewId) => {
    await axios.delete(`${API}/reviews/${reviewId}`, { headers });
    setReviews(prev => prev.filter(r => r._id !== reviewId));
  };

  const toggleHelpful = async (reviewId) => {
    try {
      const { data } = await axios.patch(`${API}/reviews/${reviewId}/helpful`, {}, { headers });
      setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, helpful: Array(data.helpful).fill('') } : r));
    } catch {}
  };

  return (
    <div className="space-y-8">
      {/* Write Review */}
      {user && !hasReviewed && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
        >
          <h3 className="font-black text-slate-900 mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating */}
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button" onClick={() => setForm(f => ({ ...f, rating: s }))}
                  className={`text-2xl transition-transform hover:scale-110 ${
                    s <= form.rating ? 'text-amber-400' : 'text-slate-200'
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="text-sm text-slate-500 ml-2 font-semibold">{form.rating}/5</span>
            </div>
            <textarea
              required rows={3} placeholder="Share your experience..."
              value={form.comment}
              onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400 resize-none"
            />
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Photos (optional, max 3)</label>
              <input type="file" accept="image/*" multiple
                onChange={e => setReviewImages(Array.from(e.target.files).slice(0, 3))}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 file:font-bold hover:file:bg-slate-200"
              />
              {reviewImages.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {reviewImages.map((f, i) => (
                    <img key={i} src={URL.createObjectURL(f)} alt="" className="w-14 h-14 rounded-lg object-cover border border-slate-200" />
                  ))}
                </div>
              )}
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              type="submit" disabled={saving}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-red-500 transition-colors disabled:opacity-60"
            >
              {saving ? 'Submitting...' : 'Submit Review'}
            </motion.button>
          </form>
        </motion.div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-5xl mb-4">⭐</div>
          <h3 className="font-bold text-slate-900 mb-1">No reviews yet</h3>
          <p className="text-slate-500 text-sm">Be the first to review this shop</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {reviews.map(r => (
              <motion.div key={r._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                      {r.user?.firstName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{r.user?.firstName} {r.user?.lastName}</p>
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={`text-sm ${s <= r.rating ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                        ))}
                        <span className="text-xs text-slate-400 ml-1">{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                  {user?._id === r.user?._id && (
                    <button onClick={() => handleDelete(r._id)}
                      className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all flex-shrink-0"
                    >
                      <HiOutlineTrash size={15} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">{r.comment}</p>
                {r.images?.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {r.images.map((img, i) => (
                      <img key={i} src={img} alt="" className="w-16 h-16 rounded-lg object-cover border border-slate-100" />
                    ))}
                  </div>
                )}
                <button onClick={() => toggleHelpful(r._id)}
                  className="mt-2 text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors"
                >
                  👍 Helpful ({r.helpful?.length || 0})
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ShopProfile;
