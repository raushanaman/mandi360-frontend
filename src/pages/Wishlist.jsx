import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineHeart, HiOutlineTrash } from 'react-icons/hi';
import { useCart } from '../context/CartContext';

const API = 'http://localhost:5000/api';

const Wishlist = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/user/wishlist`, { headers })
      .then(r => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const remove = async (productId) => {
    await axios.patch(`${API}/user/wishlist/${productId}`, {}, { headers });
    setItems(prev => prev.filter(p => p._id !== productId));
  };

  const moveToCart = (product) => {
    addToCart({
      id:     product._id,
      name:   product.name,
      price:  product.price,
      emoji:  product.emoji || '📦',
      image:  product.images?.[0] || product.image || null,
      type:   'local',
      shop:   '',
      shopId: product.shop || null,
    });
    remove(product._id);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <HiOutlineHeart className="text-red-500" size={26} /> My Wishlist
          </h1>
          <p className="text-slate-500 text-sm mt-1">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-28 text-center"
          >
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-5xl mb-6">🤍</div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Wishlist is empty</h2>
            <p className="text-slate-500 mb-6">Save products you love to buy later</p>
            <button onClick={() => navigate('/shops')}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-500 transition-colors"
            >
              Browse Shops
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {items.map(product => {
                const img = product.images?.[0] || product.image;
                return (
                  <motion.div key={product._id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                  >
                    <div className="h-44 bg-slate-100 overflow-hidden relative cursor-pointer"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      {img
                        ? <img src={img} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        : <div className="w-full h-full flex items-center justify-center text-5xl">{product.emoji || '📦'}</div>
                      }
                      <button onClick={e => { e.stopPropagation(); remove(product._id); }}
                        className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-400 hover:text-red-600 shadow-sm transition-colors"
                      >
                        <HiOutlineTrash size={15} />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 text-sm truncate mb-1">{product.name}</h3>
                      <p className="font-black text-slate-900 mb-3">₹{product.price?.toLocaleString()}</p>
                      <button onClick={() => moveToCart(product)} disabled={!product.inStock}
                        className="w-full bg-slate-900 text-white py-2 rounded-xl text-xs font-bold hover:bg-red-500 transition-colors disabled:opacity-40"
                      >
                        {product.inStock ? 'Move to Cart' : 'Out of Stock'}
                      </button>
                    </div>
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

export default Wishlist;
