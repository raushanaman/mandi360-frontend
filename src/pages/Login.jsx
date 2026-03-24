import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const PERKS = [
  { emoji: '🚀', text: 'Fast local delivery' },
  { emoji: '🏪', text: '500+ verified shops' },
  { emoji: '💸', text: 'Exclusive member deals' },
];

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 flex-col justify-between overflow-hidden p-12">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
          alt="Shopping"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/95 to-red-900/40" />

        {/* Blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-red-500/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/3 blur-2xl" />

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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Your neighborhood,<br />
              <span className="text-red-400">delivered.</span>
            </h2>
            <p className="text-slate-400 text-base mb-10 leading-relaxed">
              Sign in to shop from 500+ local stores and get everything delivered to your door.
            </p>

            <div className="space-y-4">
              {PERKS.map((p, i) => (
                <motion.div
                  key={p.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{p.emoji}</span>
                  <span className="text-slate-300 font-medium">{p.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom testimonial */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/10"
        >
          <p className="text-white/80 text-sm italic mb-3">"Panda changed how I shop. Everything from my local market is now just a tap away!"</p>
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/40?img=47" alt="user" className="w-9 h-9 rounded-full object-cover" />
            <div>
              <p className="text-white text-xs font-bold">Priya Sharma</p>
              <p className="text-slate-400 text-xs">Mumbai · 4.9 ★</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <span className="text-4xl">🐼</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">PANDA</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h1 className="text-2xl font-black text-slate-900 mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm mb-6">Sign in to your Panda account.</p>

            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">Forgot?</Link>
                </div>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                  <input
                    type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-11 py-3 rounded-xl text-sm outline-none focus:border-slate-400 focus:bg-white transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <HiOutlineEyeOff size={17} /> : <HiOutlineEye size={17} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-red-500 transition-colors text-sm mt-2"
              >
                Sign In
              </motion.button>
            </form>
          </div>

          <p className="text-center text-sm text-slate-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-slate-900 hover:text-red-500 transition-colors">Create one free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
