import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineMapPin } from 'react-icons/hi2';
import { HiOutlineStar, HiOutlineShoppingBag, HiOutlineLocationMarker } from 'react-icons/hi';

const STATS = [
  { value: '500+', label: 'Local Shops' },
  { value: '50K+', label: 'Happy Customers' },
  { value: '7',    label: 'Categories' },
  { value: '4.8★', label: 'Avg Rating' },
];

const FLOATING_CATEGORIES = [
  { emoji: '🛒', label: 'Groceries',   delay: 0    },
  { emoji: '💻', label: 'Electronics', delay: 0.6  },
  { emoji: '👗', label: 'Clothing',    delay: 1.2  },
  { emoji: '🥐', label: 'Bakery',      delay: 1.8  },
];

const Hero = () => {
  return (
    <section className="relative bg-white overflow-hidden">

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-50 rounded-full -translate-y-1/2 translate-x-1/3 -z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-50 rounded-full translate-y-1/2 -translate-x-1/3 -z-0" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-50 rounded-full -translate-x-1/2 -translate-y-1/2 -z-0 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 lg:flex items-center gap-16">

        {/* ── Left Side ── */}
        <div className="lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.15em] mb-6"
            >
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              Now Live in Your City
            </motion.span>

            {/* Headline */}
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-6">
              GLOBAL <br />
              <span className="text-red-500 relative">
                STYLE,
                {/* underline squiggle */}
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 8 Q75 2 150 8 Q225 14 298 8" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4"/>
                </svg>
              </span>
              <br />LOCAL HEART.
            </h1>

            <p className="text-base text-slate-500 max-w-md mb-8 leading-relaxed">
              Shop world-class brands or support the shop next door. Panda brings the entire marketplace to your doorstep.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-slate-900 text-white px-7 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-red-500 transition-colors shadow-xl shadow-slate-900/20 text-sm"
                >
                  SHOP GLOBAL <HiOutlineArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/shops">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-white text-slate-900 border-2 border-slate-200 px-7 py-4 rounded-2xl font-black flex items-center gap-3 hover:border-slate-900 transition-colors text-sm"
                >
                  FIND LOCAL <HiOutlineMapPin size={18} />
                </motion.button>
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="text-center"
                >
                  <p className="text-xl font-black text-slate-900">{stat.value}</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right Side ── */}
        <div className="lg:w-1/2 mt-14 lg:mt-0 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="relative"
          >
            {/* Decorative ring */}
            <div className="absolute inset-0 rounded-[4rem] border-[16px] border-slate-100 scale-105 -z-10" />

            {/* Main image */}
            <div className="w-full aspect-square bg-slate-100 rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl relative">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000"
                alt="Fashion"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />

              {/* Dark overlay gradient at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {/* Floating order card — bottom left */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 hidden md:block min-w-[180px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    <HiOutlineShoppingBag size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Order</p>
                    <p className="font-bold text-slate-900 text-sm">Fresh Basket</p>
                    <p className="text-xs text-emerald-500 font-bold">Delivering Now ●</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating rating card — top right */}
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-8 -right-8 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 hidden md:block"
              >
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    <HiOutlineStar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Rated</p>
                    <p className="font-black text-slate-900 text-lg leading-none">4.9 ★</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating location card — bottom right */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute bottom-8 right-4 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl hidden md:flex items-center gap-2"
              >
                <HiOutlineLocationMarker size={14} className="text-red-400" />
                <span className="text-xs font-bold">22 shops nearby</span>
              </motion.div>
            </div>

            {/* Floating category pills */}
            {FLOATING_CATEGORIES.map((cat, i) => {
              const positions = [
                'top-4 left-4',
                'top-4 right-20',
                'bottom-24 right-2',
                'top-1/2 -left-6',
              ];
              return (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + cat.delay, type: 'spring' }}
                  className={`absolute ${positions[i]} bg-white border border-slate-100 shadow-lg rounded-full px-3 py-1.5 flex items-center gap-1.5 hidden lg:flex`}
                >
                  <span className="text-sm">{cat.emoji}</span>
                  <span className="text-xs font-bold text-slate-700">{cat.label}</span>
                </motion.div>
              );
            })}

            {/* Decorative red blob */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-red-500 rounded-full -z-10 opacity-80 blur-sm" />
            {/* Decorative slate blob */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-slate-200 rounded-full -z-10" />
          </motion.div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="relative -mb-1">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 30 Q360 60 720 30 Q1080 0 1440 30 L1440 60 L0 60 Z" fill="#f8fafc"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
