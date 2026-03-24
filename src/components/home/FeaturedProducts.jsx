// src/components/home/FeaturedProducts.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Card from '../common/Card';

const PRODUCTS = [
  { id: 1, name: 'Fresh Organic Vegetables Box', category: 'Groceries', price: 299, originalPrice: 399, discount: 25, rating: 4.8, reviews: 312, badge: 'Best Seller', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80' },
  { id: 2, name: 'Wireless Bluetooth Earbuds', category: 'Electronics', price: 1499, originalPrice: 2499, discount: 40, rating: 4.6, reviews: 189, badge: 'Hot', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80' },
  { id: 3, name: 'Men\'s Casual Slim Fit Shirt', category: 'Clothing', price: 599, originalPrice: 999, discount: 40, rating: 4.5, reviews: 245, badge: 'New', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80' },
  { id: 4, name: 'Artisan Sourdough Bread', category: 'Bakery', price: 149, originalPrice: null, discount: null, rating: 4.9, reviews: 421, badge: 'Fresh', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80' },
  { id: 5, name: 'Matte Lipstick Collection', category: 'Cosmetics', price: 449, originalPrice: 699, discount: 36, rating: 4.7, reviews: 334, badge: null, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80' },
  { id: 6, name: 'Yoga & Fitness Mat', category: 'Sports', price: 799, originalPrice: 1299, discount: 38, rating: 4.4, reviews: 156, badge: null, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
  { id: 7, name: 'Minimalist Wooden Shelf', category: 'Furniture', price: 2499, originalPrice: 3499, discount: 29, rating: 4.6, reviews: 98, badge: 'Trending', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80' },
  { id: 8, name: 'Smart LED Desk Lamp', category: 'Electronics', price: 899, originalPrice: 1499, discount: 40, rating: 4.5, reviews: 203, badge: null, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80' },
];

const FeaturedProducts = () => (
  <section className="max-w-7xl mx-auto px-6 py-16">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-end mb-10"
    >
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-red-500 mb-2">Featured</p>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Trending Products</h2>
        <p className="text-slate-500 mt-1">Handpicked deals from local shops near you</p>
      </div>
      <Link
        to="/products"
        className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-900 border-2 border-slate-900 px-5 py-2.5 rounded-xl hover:bg-slate-900 hover:text-white transition-all"
      >
        View All →
      </Link>
    </motion.div>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {PRODUCTS.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
        >
          <Card product={product} />
        </motion.div>
      ))}
    </div>

    <div className="sm:hidden mt-6 text-center">
      <Link to="/products" className="text-sm font-bold text-slate-900 border-2 border-slate-900 px-6 py-3 rounded-xl hover:bg-slate-900 hover:text-white transition-all inline-block">
        View All Products →
      </Link>
    </div>
  </section>
);

export default FeaturedProducts;
