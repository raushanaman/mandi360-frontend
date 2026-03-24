import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaArrowRight 
} from 'react-icons/fa';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section: CTA for Local Merchants */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-red-500 rounded-[2rem] p-10 mb-20 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black tracking-tighter mb-2">Are you a local shop owner?</h2>
            <p className="text-red-100 font-medium">Take your business online with Panda in less than 2 minutes.</p>
          </div>
          <Link to="/register-shop">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: '#ffffff', color: '#ef4444' }}
              whileTap={{ scale: 0.95 }}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl"
            >
              REGISTER YOUR SHOP <FaArrowRight />
            </motion.button>
          </Link>
        </motion.div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black tracking-tighter flex items-center gap-2">
              <span className="text-3xl">🐼</span> PANDA
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              The ultimate bridge between global fashion brands and your favorite neighborhood stores. Quality, speed, and community.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<FaFacebookF />} />
              <SocialIcon icon={<FaTwitter />} />
              <SocialIcon icon={<FaInstagram />} />
              <SocialIcon icon={<FaLinkedinIn />} />
            </div>
          </div>

          {/* Shopping Links */}
          <div>
            <h4 className="font-bold mb-6 text-red-500 uppercase tracking-widest text-xs">Shop</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><Link to="/" className="hover:text-white transition">Global Collection</Link></li>
              <li><Link to="/local-shops" className="hover:text-white transition">Local Marketplace</Link></li>
              <li><Link to="/new-arrivals" className="hover:text-white transition">New Arrivals</Link></li>
              <li><Link to="/deals" className="hover:text-white transition">Local Deals</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-bold mb-6 text-red-500 uppercase tracking-widest text-xs">Support</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><Link to="/track-order" className="hover:text-white transition">Track Order</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition">Shipping Policy</Link></li>
              <li><Link to="/help" className="hover:text-white transition">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-6 text-red-500 uppercase tracking-widest text-xs">Get in Touch</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex items-center gap-3">
                <HiOutlineMail className="text-red-500" size={20} />
                <span>support@panda.com</span>
              </li>
              <li className="flex items-center gap-3">
                <HiOutlinePhone className="text-red-500" size={20} />
                <span>+91 1234123412</span>
              </li>
              <li className="flex items-center gap-3">
                <HiOutlineLocationMarker className="text-red-500" size={20} />
                <span>Patna, Bihar, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-slate-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs font-medium">
            © {currentYear} Panda. All rights reserved. Built for Global & Local Commerce.
          </p>
          <div className="flex gap-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Internal Social Icon Component
const SocialIcon = ({ icon }) => (
  <motion.a 
    href="#" 
    whileHover={{ y: -5, backgroundColor: '#ef4444' }}
    className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-white transition-colors"
  >
    {icon}
  </motion.a>
);

export default Footer;