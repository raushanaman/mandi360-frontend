
import { motion } from 'framer-motion';
import { HiOutlineArrowRight, HiOutlineMapPin, HiOutlineStar } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

const LocalShopSection = () => {
  const localShops = [
    { id: 1, name: "Vikas Kirana Store", category: "Grocery", dist: "0.8 km", rating: 4.8, img: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=400" },
    { id: 2, name: "Modern Electronics", category: "Tech", dist: "1.2 km", rating: 4.5, img: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=400" },
    { id: 3, name: "Rose Boutique", category: "Fashion", dist: "2.5 km", rating: 4.9, img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-red-500 font-black text-xs uppercase tracking-widest">Neighborhood Essentials</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mt-2">SHOPS NEAR YOU</h2>
          </div>
          <Link to="/local-shops" className="hidden md:flex items-center gap-2 font-bold text-slate-900 hover:text-red-500 transition">
            View All Local Shops <HiOutlineArrowRight />
          </Link>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {localShops.map((shop) => (
            <motion.div 
              key={shop.id} 
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group bg-slate-50 rounded-[2.5rem] p-4 border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-64 w-full rounded-[2rem] overflow-hidden mb-6">
                <img src={shop.img} alt={shop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-sm">
                  <HiOutlineStar className="text-yellow-400" /> {shop.rating}
                </div>
              </div>
              
              <div className="px-2 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black text-slate-900 leading-none">{shop.name}</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{shop.category}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-sm mb-6">
                  <HiOutlineMapPin size={14} /> <span>{shop.dist} away</span>
                </div>
                <Link to={`/shop/${shop.id}`}>
                  <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm group-hover:bg-red-500 transition-colors">
                    VISIT SHOP
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LocalShopSection;