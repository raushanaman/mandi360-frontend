import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlineArrowLeft } from 'react-icons/hi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); 
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setStatus('error'); setMessage(data.message); return; }
      setStatus('success');
      setMessage(data.message);
    } catch {
      setStatus('error');
      setMessage('Server error. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-8">
          <HiOutlineArrowLeft size={16} /> Back to Login
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
            <HiOutlineMail size={28} className="text-red-500" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 mb-1">Forgot Password?</h1>
          <p className="text-slate-500 text-sm mb-6">
            Enter your email and we'll send you a reset link.
          </p>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center"
            >
              <span className="text-3xl block mb-2">📬</span>
              <p className="text-emerald-700 font-bold text-sm">Reset link sent!</p>
              <p className="text-emerald-600 text-xs mt-1">Check your email inbox. Link expires in 15 minutes.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === 'error' && (
                <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2">{message}</p>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" required
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={status === 'loading'}
                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-red-500 transition-colors text-sm disabled:opacity-60"
              >
                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
              </motion.button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Remembered it?{' '}
          <Link to="/login" className="font-bold text-slate-900 hover:text-red-500 transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
