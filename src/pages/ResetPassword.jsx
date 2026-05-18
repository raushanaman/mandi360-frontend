import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineArrowLeft } from 'react-icons/hi';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const strongPwd = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (form.password !== form.confirm)
      return setMessage('Passwords do not match');
    if (!strongPwd.test(form.password))
      return setMessage('Password must be at least 8 characters and include a special character (!@#$% etc.)');

    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setStatus('error'); setMessage(data.message); return; }
      setStatus('success');
      setTimeout(() => navigate('/login'), 2500);
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
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6">
            <HiOutlineLockClosed size={26} className="text-white" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 mb-1">Set New Password</h1>
          <p className="text-slate-500 text-sm mb-6">Choose a strong password for your account.</p>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center"
            >
              <span className="text-3xl block mb-2">✅</span>
              <p className="text-emerald-700 font-bold text-sm">Password reset successful!</p>
              <p className="text-emerald-600 text-xs mt-1">Redirecting to login...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {message && (
                <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2">{message}</p>
              )}

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">New Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                  <input
                    type={show.password ? 'text' : 'password'}
                    value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Min. 8 chars + special character" required
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-11 py-3 rounded-xl text-sm outline-none focus:border-slate-400 focus:bg-white transition-all"
                  />
                  <button type="button" onClick={() => setShow(s => ({ ...s, password: !s.password }))}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {show.password ? <HiOutlineEyeOff size={17} /> : <HiOutlineEye size={17} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Confirm Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                  <input
                    type={show.confirm ? 'text' : 'password'}
                    value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                    placeholder="Re-enter password" required
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-11 py-3 rounded-xl text-sm outline-none focus:border-slate-400 focus:bg-white transition-all"
                  />
                  <button type="button" onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {show.confirm ? <HiOutlineEyeOff size={17} /> : <HiOutlineEye size={17} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={status === 'loading'}
                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-red-500 transition-colors text-sm disabled:opacity-60"
              >
                {status === 'loading' ? 'Resetting...' : 'Reset Password'}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
