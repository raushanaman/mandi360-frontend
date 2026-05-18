import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import { CATEGORIES } from '../data/shopsData';
import { HiOutlineStar, HiOutlineLocationMarker, HiOutlineLightningBolt, HiOutlineShieldCheck, HiOutlineHeart } from 'react-icons/hi';
import { HiOutlineTruck } from 'react-icons/hi';
import API from '../utils/api';
import axios from 'axios';

const FEATURES = [
  {
    icon: <HiOutlineLightningBolt size={24} />,
    color: 'bg-amber-50 text-amber-600',
    title: 'Fast Local Delivery',
    desc: 'Get products from nearby shops delivered to your door within hours.',
  },
  {
    icon: <HiOutlineShieldCheck size={24} />,
    color: 'bg-emerald-50 text-emerald-600',
    title: 'Verified Shops',
    desc: 'Every shop on Mandi-360 is verified and trusted by the local community.',
  },
  {
    icon: <HiOutlineHeart size={24} />,
    color: 'bg-red-50 text-red-500',
    title: 'Support Local',
    desc: 'Your purchase directly supports neighborhood shop owners and families.',
  },
  {
    icon: <HiOutlineTruck size={24} />,
    color: 'bg-blue-50 text-blue-600',
    title: 'Free Delivery',
    desc: 'Enjoy free delivery on all local shop orders, no minimum required.',
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const Home = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);

  useEffect(() => {
    axios.get(`${API}/shops`)
      .then(r => setShops(r.data.slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Hero />

      {/* ── Category Strip ── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 flex-shrink-0 pr-2 border-r border-slate-200">
              Browse
            </span>
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={`/products/${cat.id}`}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all text-sm font-semibold text-slate-600 group"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">{cat.emoji}</span>
                  {cat.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <FeaturedProducts />

      {/* ── Local Shops Section ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div {...fadeUp()} className="flex justify-between items-end mb-10">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-red-500 mb-2">Near You</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Local Shops in Your Area</h2>
            <p className="text-slate-500 mt-1">Support community businesses near you</p>
          </div>
          <button
            onClick={() => navigate('/shops')}
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-900 border-2 border-slate-900 px-5 py-2.5 rounded-xl hover:bg-slate-900 hover:text-white transition-all"
          >
            View All Shops →
          </button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shops.map((shop, i) => (
            <motion.div
              key={shop._id}
              {...fadeUp(i * 0.1)}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="relative h-44 overflow-hidden bg-slate-100">
                {shop.image
                  ? <img src={shop.image} alt={shop.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  : <div className="w-full h-full flex items-center justify-center text-5xl">{CATEGORIES.find(c => c.id === shop.category)?.emoji || '🏪'}</div>
                }
                <span className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                  shop.status === 'open' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                }`}>
                  {shop.status === 'open' ? '● Open' : '● Closed'}
                </span>
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-700 text-[10px] font-bold px-2 py-1 rounded-full">
                  {CATEGORIES.find(c => c.id === shop.category)?.emoji}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-base text-slate-900 leading-tight mb-1">{shop.name}</h3>
                <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
                  <HiOutlineLocationMarker size={13} />
                  <span>{shop.city || 'Local'}</span>
                </div>
                <div className="flex items-center gap-1 mb-4">
                  <HiOutlineStar className="text-amber-400 fill-amber-400" size={14} />
                  <span className="text-sm font-bold text-slate-800">{shop.rating || 0}</span>
                  <span className="text-xs text-slate-400">({shop.reviews || 0} reviews)</span>
                </div>
                <Link
                  to={`/shop/${shop._id}`}
                  className="mt-auto block text-center py-2.5 rounded-xl border-2 border-slate-900 text-slate-900 text-sm font-bold hover:bg-slate-900 hover:text-white transition-all duration-200"
                >
                  Visit Shop
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All button */}
        <div className="sm:hidden mt-6 text-center">
          <button
            onClick={() => navigate('/shops')}
            className="text-sm font-bold text-slate-900 border-2 border-slate-900 px-6 py-3 rounded-xl hover:bg-slate-900 hover:text-white transition-all"
          >
            View All Shops →
          </button>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="bg-white border-y border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-red-500 mb-2">Why Mandi-360</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Built for your neighborhood</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp(i * 0.1)}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          {...fadeUp()}
          className="relative bg-slate-900 rounded-3xl overflow-hidden p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10 text-center md:text-left">
            <span className="text-5xl block mb-4">🛒</span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
              Own a local shop?
            </h2>
            <p className="text-slate-400 max-w-md">
              List your shop on Mandi-360 for free and start reaching thousands of customers in your neighborhood today.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-3 flex-shrink-0">
            <Link to="/register-shop">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-red-500 text-white px-8 py-4 rounded-2xl font-black hover:bg-red-600 transition-colors shadow-xl text-sm whitespace-nowrap"
              >
                Register Your Shop →
              </motion.button>
            </Link>
            <p className="text-center text-xs text-slate-500">Free forever · No credit card needed</p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
