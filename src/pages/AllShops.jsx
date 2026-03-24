// src/pages/AllShops.jsx
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSearch, HiOutlineFilter, HiOutlineSparkles } from 'react-icons/hi';
import { CATEGORIES, SHOPS } from '../data/shopsData';
import { ShopCard, Pagination } from '../components/common/ShopCard';

const PER_PAGE = 8;

const STATS = [
  { value: `${SHOPS.length}+`, label: 'Registered Shops' },
  { value: '7',                label: 'Categories'        },
  { value: '50K+',             label: 'Happy Customers'   },
  { value: '4.8★',             label: 'Average Rating'    },
];

const AllShops = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch]               = useState(() => searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy]               = useState('rating');
  const [page, setPage]                   = useState(1);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearch(q);
    setPage(1);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = SHOPS;
    if (activeCategory !== 'all') list = list.filter(s => s.category === activeCategory);
    if (search.trim()) list = list.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === 'rating')   return [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === 'reviews')  return [...list].sort((a, b) => b.reviews - a.reviews);
    if (sortBy === 'distance') return [...list].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    return list;
  }, [search, activeCategory, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleFilter = (val) => { setActiveCategory(val); setPage(1); };
  const handleSearch = (e)   => { setSearch(e.target.value); setPage(1); };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero Banner ── */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/3 blur-2xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
              <HiOutlineSparkles size={12} /> Explore Local
            </span>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-3">
              All Local Shops
            </h1>
            <p className="text-slate-400 mb-8 text-lg">Discover {SHOPS.length}+ registered shops in your community</p>

            {/* Search */}
            <div className="relative max-w-xl">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search by shop name or city..."
                className="w-full bg-white/10 backdrop-blur border border-white/20 text-white placeholder-slate-500 pl-12 pr-4 py-4 rounded-2xl outline-none focus:bg-white/15 focus:border-white/40 transition-all text-sm font-medium"
              />
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4"
              >
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom wave */}
        <svg viewBox="0 0 1440 40" fill="none" className="w-full -mb-1">
          <path d="M0 20 Q360 40 720 20 Q1080 0 1440 20 L1440 40 L0 40 Z" fill="#f8fafc"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Filter + Sort Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400 mr-1">
                <HiOutlineFilter size={13} /> Filter
              </span>
              {[{ id: 'all', label: 'All', emoji: '🏪' }, ...CATEGORIES].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleFilter(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    activeCategory === cat.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-white'
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={e => { setSortBy(e.target.value); setPage(1); }}
              className="bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 px-4 py-2 rounded-xl outline-none focus:border-slate-400 cursor-pointer flex-shrink-0"
            >
              <option value="rating">⭐ Top Rated</option>
              <option value="reviews">💬 Most Reviewed</option>
              <option value="distance">📍 Nearest First</option>
            </select>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{paginated.length}</span> of{' '}
            <span className="font-bold text-slate-900">{filtered.length}</span> shops
            {activeCategory !== 'all' && (
              <span> in <span className="font-bold text-red-500">
                {CATEGORIES.find(c => c.id === activeCategory)?.label}
              </span></span>
            )}
          </p>
          {search && (
            <span className="text-xs bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-full font-bold">
              Search: "{search}"
            </span>
          )}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {paginated.length > 0 ? (
            <motion.div
              key={`${activeCategory}-${page}-${search}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginated.map(shop => <ShopCard key={shop.id} shop={shop} />)}
              </div>
              {totalPages > 1 && (
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-28 text-center"
            >
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-5xl mb-6">🔍</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No shops found</h3>
              <p className="text-slate-500">Try a different search term or category.</p>
              <button onClick={() => { setSearch(''); setActiveCategory('all'); }}
                className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-red-500 transition-colors">
                Clear Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AllShops;
