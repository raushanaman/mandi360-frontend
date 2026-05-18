import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSearch } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import API from '../utils/api';

const TAG_COLORS = {
  'Best Seller': 'bg-amber-500 text-white',
  'New':         'bg-blue-500 text-white',
  'Popular':     'bg-purple-500 text-white',
  'Trending':    'bg-red-500 text-white',
  'Fresh':       'bg-emerald-500 text-white',
  'Organic':     'bg-green-500 text-white',
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const img = product.images?.[0] || product.image;

  return (
    <motion.div
      layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative h-44 bg-slate-100 overflow-hidden">
        {img
          ? <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-5xl">{product.emoji || '📦'}</div>
        }
        {product.tag && (
          <span className={`absolute top-2 left-2 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${TAG_COLORS[product.tag] || 'bg-slate-900 text-white'}`}>
            {product.tag}
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-1">{product.shop?.name || ''}</p>
        <h3 className="font-bold text-slate-900 text-sm truncate mb-1">{product.name}</h3>
        <p className="text-xs text-slate-400 line-clamp-2 mb-3">{product.desc}</p>
        <div className="flex items-center justify-between">
          <span className="font-black text-slate-900">₹{product.price?.toLocaleString()}</span>
          <button
            onClick={e => {
              e.stopPropagation();
              addToCart({ id: product._id, name: product.name, price: product.price, emoji: product.emoji || '📦', image: img || null, type: 'local', shop: product.shop?.name || '', shopId: product.shop?._id || null });
            }}
            disabled={!product.inStock}
            className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-red-500 transition-colors disabled:opacity-40"
          >
            + Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get('q') || '';

  const [results,  setResults]  = useState([]);
  const [similar,  setSimilar]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [query,    setQuery]    = useState(q);

  useEffect(() => {
    setQuery(q);
    if (!q.trim()) return;
    setLoading(true);
    axios.get(`${API}/products/search?q=${encodeURIComponent(q)}`)
      .then(r => { setResults(r.data.results || []); setSimilar(r.data.similar || []); })
      .catch(() => { setResults([]); setSimilar([]); })
      .finally(() => setLoading(false));
  }, [q]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-100 sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <form onSubmit={handleSearch} className="relative max-w-xl">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 rounded-xl text-sm outline-none focus:border-slate-400 focus:bg-white transition-all"
            />
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {loading ? (
          <div className="flex items-center justify-center py-28">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Search Results */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {results.length > 0 ? `Results for "${q}"` : `No results for "${q}"`}
                  </h2>
                  {results.length > 0 && (
                    <p className="text-sm text-slate-400 mt-0.5">{results.length} product{results.length !== 1 ? 's' : ''} found</p>
                  )}
                </div>
              </div>

              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-slate-100">
                  <div className="text-5xl mb-3">🔍</div>
                  <h3 className="font-bold text-slate-900 mb-1">No products found</h3>
                  <p className="text-slate-500 text-sm">Try different keywords or browse categories</p>
                </div>
              ) : (
                <AnimatePresence>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {results.map(p => <ProductCard key={p._id} product={p} />)}
                  </div>
                </AnimatePresence>
              )}
            </div>

            {/* Similar Products */}
            {similar.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-5">
                  Similar Products You May Like
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {similar.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
