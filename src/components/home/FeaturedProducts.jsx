import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineStar } from 'react-icons/hi';
import API from '../../utils/api';
import axios from 'axios';

const TAG_COLORS = {
  'Best Seller': 'bg-amber-500 text-white',
  'New':         'bg-blue-500 text-white',
  'Popular':     'bg-purple-500 text-white',
  'Trending':    'bg-red-500 text-white',
  'Fresh':       'bg-emerald-500 text-white',
  'Organic':     'bg-green-500 text-white',
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${API}/products/featured`)
      .then(r => setProducts(r.data))
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
        className="flex justify-between items-end mb-10"
      >
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-red-500 mb-2">Featured</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Trending Products</h2>
          <p className="text-slate-500 mt-1">Handpicked products from local shops near you</p>
        </div>
        <Link to="/shops"
          className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-900 border-2 border-slate-900 px-5 py-2.5 rounded-xl hover:bg-slate-900 hover:text-white transition-all"
        >
          Browse Shops →
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((product, i) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
            whileHover={{ y: -6 }}
            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
          >
            <div className="relative h-52 overflow-hidden bg-slate-100">
              {product.image
                ? <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                : <div className="w-full h-full flex items-center justify-center text-5xl">{product.emoji || '📦'}</div>
              }
              {product.tag && (
                <span className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${TAG_COLORS[product.tag] || 'bg-slate-900 text-white'}`}>
                  {product.tag}
                </span>
              )}
            </div>

            <div className="p-4 flex flex-col flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{product.category}</p>
              <h3 className="font-bold text-slate-900 text-sm leading-tight mb-3 line-clamp-2">{product.name}</h3>
              <span className="text-lg font-black text-slate-900 mb-4">₹{product.price}</span>

              <Link
                to={`/shop/${product.shop}`}
                className="mt-auto flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-slate-900 text-slate-900 text-xs font-bold hover:bg-slate-900 hover:text-white transition-colors duration-200"
              >
                🏪 Visit Shop to Buy
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="sm:hidden mt-6 text-center">
        <Link to="/shops" className="text-sm font-bold text-slate-900 border-2 border-slate-900 px-6 py-3 rounded-xl hover:bg-slate-900 hover:text-white transition-all inline-block">
          Browse All Shops →
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;
