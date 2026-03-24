// src/components/common/Card.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineShoppingBag, HiOutlineStar } from 'react-icons/hi';

const Card = ({ product }) => (
  <motion.div
    whileHover={{ y: -6 }}
    transition={{ type: 'spring', stiffness: 300 }}
    className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col group"
  >
    {/* Image */}
    <div className="relative h-52 overflow-hidden bg-slate-100">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      {product.badge && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
          {product.badge}
        </span>
      )}
      {product.discount && (
        <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-full">
          -{product.discount}%
        </span>
      )}
    </div>

    {/* Info */}
    <div className="p-4 flex flex-col flex-1">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{product.category}</p>
      <h3 className="font-bold text-slate-900 text-sm leading-tight mb-2 line-clamp-2">{product.name}</h3>

      <div className="flex items-center gap-1 mb-3">
        <HiOutlineStar className="text-amber-400 fill-amber-400" size={13} />
        <span className="text-xs font-bold text-slate-700">{product.rating}</span>
        <span className="text-xs text-slate-400">({product.reviews})</span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg font-black text-slate-900">₹{product.price}</span>
        {product.originalPrice && (
          <span className="text-sm text-slate-400 line-through">₹{product.originalPrice}</span>
        )}
      </div>

      <button className="mt-auto flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-red-500 transition-colors duration-200">
        <HiOutlineShoppingBag size={15} />
        Add to Cart
      </button>
    </div>
  </motion.div>
);

export default Card;
