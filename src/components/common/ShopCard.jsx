import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineStar, HiOutlineLocationMarker } from 'react-icons/hi';
import { CATEGORIES } from '../../data/shopsData';

export const ShopCard = ({ shop }) => {
  const cat = CATEGORIES.find(c => c.id === shop.category);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col"
    >
      <div className="relative h-44 overflow-hidden bg-slate-100">
        {shop.image ? (
          <img src={shop.image} alt={shop.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {cat?.emoji || '🏪'}
          </div>
        )}
        <span className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
          shop.status === 'open' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
        }`}>
          {shop.status === 'open' ? '● Open' : '● Closed'}
        </span>
        {cat && (
          <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full bg-white/90 text-slate-700">
            {cat.emoji} {cat.label}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 text-base leading-tight mb-1">{shop.name}</h3>
        {shop.city && (
          <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
            <HiOutlineLocationMarker size={13} />
            <span>{shop.city}{shop.address ? ` · ${shop.address}` : ''}</span>
          </div>
        )}

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
  );
};

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
        className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:border-slate-900 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        ← Prev
      </button>
      {pages.map(p => (
        <button key={p} onClick={() => onPageChange(p)}
          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
            p === currentPage ? 'bg-slate-900 text-white shadow-lg' : 'border border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900'
          }`}
        >
          {p}
        </button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:border-slate-900 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        Next →
      </button>
    </div>
  );
};
