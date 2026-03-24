// src/pages/ShopProfile.jsx
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineBadgeCheck, HiOutlineLocationMarker, HiOutlinePhone,
  HiOutlineStar, HiOutlineArrowLeft, HiOutlineHeart, HiOutlineShare,
} from 'react-icons/hi';
import { SHOPS, CATEGORIES } from '../data/shopsData';

const PRODUCT_EMOJIS = {
  groceries:   ['🥬', '🥛', '🥚', '🌶️'],
  electronics: ['🎧', '🔌', '🔊', '📱'],
  sports:      ['🧘', '💪', '💧', '🧤'],
  clothing:    ['👘', '🧥', '👔', '🧣'],
  cosmetics:   ['✨', '💄', '🧴', '🧼'],
  furniture:   ['🪑', '📚', '🪞', '💡'],
  bakery:      ['🍞', '🥐', '🎂', '🍪'],
};

const PRODUCTS = {
  groceries:   [
    { id: 1, name: 'Premium Basmati Rice',     price: '₹120', tag: 'Best Seller', desc: '5kg pack, aged 2 years'       },
    { id: 2, name: 'Organic Cold Pressed Oil', price: '₹450', tag: 'Organic',     desc: 'Cold pressed, 1L bottle'      },
    { id: 3, name: 'Farm Fresh Eggs (Dozen)',  price: '₹80',  tag: 'Fresh',       desc: 'Free range, farm fresh'       },
    { id: 4, name: 'Local Spices Combo',       price: '₹299', tag: 'Popular',     desc: 'Set of 8 premium spices'      },
  ],
  electronics: [
    { id: 1, name: 'Wireless Earbuds',         price: '₹1,299', tag: 'New',         desc: '30hr battery, noise cancel' },
    { id: 2, name: 'USB-C Fast Charger',       price: '₹599',   tag: 'Best Seller', desc: '65W GaN charger'            },
    { id: 3, name: 'Bluetooth Speaker',        price: '₹2,499', tag: 'Popular',     desc: '360° sound, waterproof'     },
    { id: 4, name: 'Phone Stand Holder',       price: '₹199',   tag: 'Trending',    desc: 'Adjustable, foldable'       },
  ],
  sports:      [
    { id: 1, name: 'Yoga Mat (6mm)',           price: '₹799',   tag: 'Popular',     desc: 'Anti-slip, eco-friendly'    },
    { id: 2, name: 'Resistance Bands Set',     price: '₹499',   tag: 'Best Seller', desc: '5 resistance levels'        },
    { id: 3, name: 'Water Bottle 1L',          price: '₹349',   tag: 'New',         desc: 'BPA free, insulated'        },
    { id: 4, name: 'Running Gloves',           price: '₹249',   tag: 'Trending',    desc: 'Touchscreen compatible'     },
  ],
  clothing:    [
    { id: 1, name: 'Cotton Kurta',             price: '₹699',   tag: 'New',         desc: '100% pure cotton, M-XXL'    },
    { id: 2, name: 'Denim Jacket',             price: '₹1,899', tag: 'Trending',    desc: 'Slim fit, all seasons'      },
    { id: 3, name: 'Casual Linen Shirt',       price: '₹899',   tag: 'Popular',     desc: 'Breathable, 5 colors'       },
    { id: 4, name: 'Ethnic Dupatta',           price: '₹399',   tag: 'Best Seller', desc: 'Hand embroidered'           },
  ],
  cosmetics:   [
    { id: 1, name: 'Vitamin C Serum',          price: '₹549',   tag: 'Best Seller', desc: '20% concentration, 30ml'    },
    { id: 2, name: 'Matte Lipstick',           price: '₹299',   tag: 'Popular',     desc: '12hr stay, 20 shades'       },
    { id: 3, name: 'Sunscreen SPF 50',         price: '₹399',   tag: 'New',         desc: 'PA++++, non-greasy'         },
    { id: 4, name: 'Face Wash Gel',            price: '₹199',   tag: 'Trending',    desc: 'Salicylic acid, 100ml'      },
  ],
  furniture:   [
    { id: 1, name: 'Wooden Study Table',       price: '₹4,999', tag: 'Popular',     desc: 'Solid wood, 4ft x 2ft'      },
    { id: 2, name: 'Bookshelf 3-Tier',         price: '₹2,799', tag: 'Best Seller', desc: 'MDF board, easy assembly'   },
    { id: 3, name: 'Ergonomic Chair',          price: '₹6,499', tag: 'New',         desc: 'Lumbar support, adjustable' },
    { id: 4, name: 'Bedside Lamp',             price: '₹899',   tag: 'Trending',    desc: 'LED, 3 brightness levels'   },
  ],
  bakery:      [
    { id: 1, name: 'Sourdough Bread Loaf',     price: '₹180',   tag: 'Fresh',       desc: 'Baked fresh every morning'  },
    { id: 2, name: 'Chocolate Croissant',      price: '₹80',    tag: 'Best Seller', desc: 'Buttery, flaky layers'      },
    { id: 3, name: 'Red Velvet Cake Slice',    price: '₹120',   tag: 'Popular',     desc: 'Cream cheese frosting'      },
    { id: 4, name: 'Almond Cookies (6 pcs)',   price: '₹150',   tag: 'New',         desc: 'Crunchy, no preservatives'  },
  ],
};

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
  const shop   = SHOPS.find(s => s.id === parseInt(id));

  if (!shop) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-6">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-5xl mb-6">🏪</div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Shop Not Found</h2>
        <p className="text-slate-500 mb-6">This shop doesn't exist or may have been removed.</p>
        <Link to="/shops" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-500 transition-colors">
          Browse All Shops
        </Link>
      </div>
    );
  }

  const category = CATEGORIES.find(c => c.id === shop.category);
  const products = PRODUCTS[shop.category] || [];
  const emojis   = PRODUCT_EMOJIS[shop.category] || ['🛍️', '🛍️', '🛍️', '🛍️'];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Cover Banner ── */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back button */}
        <div className="absolute top-5 left-6">
          <Link
            to="/shops"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur border border-white/30 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition-all"
          >
            <HiOutlineArrowLeft size={15} /> Back
          </Link>
        </div>

        {/* Action buttons */}
        <div className="absolute top-5 right-6 flex gap-2">
          <button className="w-9 h-9 bg-white/20 backdrop-blur border border-white/30 text-white rounded-xl flex items-center justify-center hover:bg-white/30 transition-all">
            <HiOutlineHeart size={17} />
          </button>
          <button className="w-9 h-9 bg-white/20 backdrop-blur border border-white/30 text-white rounded-xl flex items-center justify-center hover:bg-white/30 transition-all">
            <HiOutlineShare size={17} />
          </button>
        </div>

        {/* Shop name overlay on banner */}
        <div className="absolute bottom-6 left-6">
          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 inline-block ${
            shop.status === 'open' ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-slate-300'
          }`}>
            {shop.status === 'open' ? '● Open Now' : '● Closed'}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-lg">
            {shop.name}
          </h1>
        </div>
      </div>

      {/* ── Shop Info Card ── */}
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 -mt-6 relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
        >
          <div className="flex items-center gap-5">
            {/* Shop avatar */}
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-white shadow-lg flex-shrink-0 ring-2 ring-slate-100">
              <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-500 font-bold text-xs uppercase tracking-widest">
                  {category?.emoji} {category?.label}
                </span>
                <HiOutlineBadgeCheck className="text-blue-500" size={16} title="Verified" />
              </div>
              <div className="flex flex-wrap gap-4 text-slate-500 text-sm">
                <span className="flex items-center gap-1.5">
                  <HiOutlineLocationMarker size={14} className="text-slate-400" />
                  {shop.city} · {shop.distance}
                </span>
                <span className="flex items-center gap-1.5">
                  <HiOutlinePhone size={14} className="text-slate-400" />
                  +91 98765 43210
                </span>
                <span className="flex items-center gap-1.5">
                  <HiOutlineStar size={14} className="text-amber-400" />
                  <span className="font-bold text-slate-900">{shop.rating}</span>
                  <span className="text-slate-400">({shop.reviews} reviews)</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-center">
              <p className="text-lg font-black text-slate-900">942</p>
              <p className="text-xs text-slate-400 font-semibold">Followers</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-500 transition-all text-sm"
            >
              Follow Shop
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ── Products Grid ── */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Available Products</h2>
            <p className="text-slate-500 text-sm mt-0.5">{products.length} items in stock</p>
          </div>
          <select className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm outline-none cursor-pointer font-semibold text-slate-700">
            <option>Sort by: Popularity</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} emoji={emojis[i]} index={i} />
          ))}
        </motion.div>
      </main>
    </div>
  );
};

const ProductCard = ({ product, emoji, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    whileHover={{ y: -6 }}
    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
  >
    {/* Product visual */}
    <div className="relative h-44 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-200/50 rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-slate-200/50 rounded-full -translate-x-1/3 translate-y-1/3" />

      <motion.span
        className="text-6xl relative z-10"
        whileHover={{ scale: 1.15, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {emoji}
      </motion.span>

      {/* Tag badge */}
      <span className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full ${TAG_COLORS[product.tag] || 'bg-slate-900 text-white'}`}>
        {product.tag}
      </span>
    </div>

    {/* Product info */}
    <div className="p-4 flex flex-col flex-1">
      <h3 className="font-bold text-slate-900 text-sm mb-1 leading-tight">{product.name}</h3>
      <p className="text-xs text-slate-400 mb-4 leading-relaxed">{product.desc}</p>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-lg font-black text-slate-900">{product.price}</span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-9 h-9 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors text-lg font-bold shadow-lg shadow-slate-900/20"
        >
          +
        </motion.button>
      </div>
    </div>
  </motion.div>
);

export default ShopProfile;
