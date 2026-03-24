import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiOutlineUser, HiOutlineMail, HiOutlineLockClosed,
  HiOutlinePhone, HiOutlineLocationMarker, HiOutlineOfficeBuilding,
  HiOutlineEye, HiOutlineEyeOff,
} from 'react-icons/hi';

const STEPS = [
  { emoji: '📝', text: 'Fill your details' },
  { emoji: '✅', text: 'Verify your account' },
  { emoji: '🛍️', text: 'Start shopping locally' },
];

const Register = () => {
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    shopName: '', category: 'Grocery', phone: '', address: '',
  });
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel (Form) ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-sm py-8"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <span className="text-4xl">🐼</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">PANDA</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h1 className="text-2xl font-black text-slate-900 mb-1">Create account</h1>
            <p className="text-slate-500 text-sm mb-6">Join Panda — free and takes 1 minute.</p>

            {/* Role Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
              {[{ id: 'user', label: '🛍️  Shopper' }, { id: 'merchant', label: '🏪  Merchant' }].map(opt => (
                <button
                  key={opt.id} type="button" onClick={() => setRole(opt.id)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${role === opt.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <AnimatePresence mode="wait">
                {role === 'user' ? (
                  <motion.div key="user" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Aman"   icon={<HiOutlineUser size={16} />} />
                      <Field label="Last Name"  name="lastName"  value={form.lastName}  onChange={handleChange} placeholder="Sharma" icon={<HiOutlineUser size={16} />} />
                    </div>
                    <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" icon={<HiOutlineMail size={16} />} />
                    <PasswordField value={form.password} onChange={handleChange} show={showPassword} onToggle={() => setShowPassword(s => !s)} />
                  </motion.div>
                ) : (
                  <motion.div key="merchant" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="space-y-4">
                    <Field label="Shop Name" name="shopName" value={form.shopName} onChange={handleChange} placeholder="e.g. Aman General Store" icon={<HiOutlineOfficeBuilding size={16} />} />
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Category</label>
                      <select name="category" value={form.category} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 px-3.5 py-3 rounded-xl text-sm outline-none focus:border-slate-400 focus:bg-white transition-all cursor-pointer">
                        {['Grocery', 'Electronics', 'Clothing', 'Sports', 'Cosmetics', 'Furniture', 'Bakery'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="shop@example.com" icon={<HiOutlineMail size={16} />} />
                    <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 00000 00000" icon={<HiOutlinePhone size={16} />} />
                    <Field label="Address" name="address" value={form.address} onChange={handleChange} placeholder="Street, City, Pincode" icon={<HiOutlineLocationMarker size={16} />} />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-red-500 transition-colors text-sm mt-2"
              >
                {role === 'user' ? 'Create Account' : 'Register My Shop'}
              </motion.button>
            </form>
          </div>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-slate-900 hover:text-red-500 transition-colors">Sign in</Link>
          </p>
        </motion.div>
      </div>

      {/* ── Right Panel (Graphic) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 flex-col justify-between overflow-hidden p-12">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80"
          alt="Shopping"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-slate-900 via-slate-900/95 to-red-900/40" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-red-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl" />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
              <circle cx="8" cy="8" r="6" fill="white" opacity="0.9"/>
              <circle cx="28" cy="8" r="6" fill="white" opacity="0.9"/>
              <circle cx="8" cy="8" r="3" fill="#94a3b8"/>
              <circle cx="28" cy="8" r="3" fill="#94a3b8"/>
              <circle cx="18" cy="20" r="14" fill="white"/>
              <ellipse cx="12" cy="17" rx="4" ry="4.5" fill="#1e293b"/>
              <ellipse cx="24" cy="17" rx="4" ry="4.5" fill="#1e293b"/>
              <circle cx="12" cy="17" r="2" fill="white"/>
              <circle cx="24" cy="17" r="2" fill="white"/>
              <circle cx="12.5" cy="17" r="1" fill="#1e293b"/>
              <circle cx="24.5" cy="17" r="1" fill="#1e293b"/>
              <ellipse cx="18" cy="23" rx="2.5" ry="1.5" fill="#1e293b"/>
              <path d="M15 25.5 Q18 28 21 25.5" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            </svg>
            <span className="text-2xl font-black text-white tracking-tight">PANDA</span>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Join thousands of<br />
              <span className="text-red-400">happy shoppers.</span>
            </h2>
            <p className="text-slate-400 text-base mb-10 leading-relaxed">
              Create your free account and start discovering the best local shops in your city.
            </p>

            <div className="space-y-5">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.text}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{s.emoji}</div>
                  <div>
                    <p className="text-white font-semibold text-sm">{s.text}</p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="absolute left-[2.75rem] mt-10 w-0.5 h-5 bg-white/10" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 grid grid-cols-3 gap-4"
        >
          {[{ value: '500+', label: 'Local Shops' }, { value: '50K+', label: 'Customers' }, { value: '4.8★', label: 'Avg Rating' }].map(stat => (
            <div key={stat.label} className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10 text-center">
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-slate-400 text-xs font-semibold mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const Field = ({ label, name, type = 'text', value, onChange, placeholder, icon }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:border-slate-400 focus:bg-white transition-all"
      />
    </div>
  </div>
);

const PasswordField = ({ value, onChange, show, onToggle }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Password</label>
    <div className="relative">
      <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
      <input type={show ? 'text' : 'password'} name="password" value={value} onChange={onChange}
        placeholder="Min. 8 characters"
        className="w-full bg-slate-50 border border-slate-200 pl-10 pr-11 py-3 rounded-xl text-sm outline-none focus:border-slate-400 focus:bg-white transition-all"
      />
      <button type="button" onClick={onToggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
        {show ? <HiOutlineEyeOff size={16} /> : <HiOutlineEye size={16} />}
      </button>
    </div>
  </div>
);

export default Register;
