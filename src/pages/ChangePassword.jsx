import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineArrowLeft } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const strongPwd = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  const isNewStrong = strongPwd.test(form.newPassword);
  const showHint = form.newPassword.length > 0 && !isNewStrong;

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    if (!isNewStrong)
      return setMessage('New password must be at least 8 characters and include a special character');
    if (form.newPassword !== form.confirmPassword)
      return setMessage('New passwords do not match');
    if (form.currentPassword === form.newPassword)
      return setMessage('New password must be different from current password');

    setStatus('loading');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/change-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setStatus('error'); setMessage(data.message); return; }
      setStatus('success');
      // Password change ke baad logout karo — naya login karna padega
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch {
      setStatus('error');
      setMessage('Server error. Try again.');
    }
  };

  // Role ke hisaab se back link
  const backLink = user?.role === 'merchant' ? '/dashboard' : user?.role === 'admin' ? '/admin' : '/';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm"
      >
        <Link to={backLink} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-8">
          <HiOutlineArrowLeft size={16} /> Back
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6">
            <HiOutlineLockClosed size={26} className="text-white" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 mb-1">Change Password</h1>
          <p className="text-slate-500 text-sm mb-6">Enter your current password and choose a new one.</p>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center"
            >
              <span className="text-3xl block mb-2">✅</span>
              <p className="text-emerald-700 font-bold text-sm">Password changed successfully!</p>
              <p className="text-emerald-600 text-xs mt-1">Redirecting...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {message && (
                <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2">{message}</p>
              )}

              {/* Current Password */}
              <PasswordInput
                label="Current Password"
                value={form.currentPassword}
                show={show.current}
                onToggle={() => setShow(s => ({ ...s, current: !s.current }))}
                onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                placeholder="Your current password"
              />

              {/* New Password */}
              <div>
                <PasswordInput
                  label="New Password"
                  value={form.newPassword}
                  show={show.new}
                  onToggle={() => setShow(s => ({ ...s, new: !s.new }))}
                  onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                  placeholder="Min. 8 chars + special character"
                  invalid={showHint}
                />
                {showHint && (
                  <p className="text-red-500 text-xs mt-1">Min. 8 characters + at least one special character (!@#$% etc.)</p>
                )}
              </div>

              {/* Confirm New Password */}
              <PasswordInput
                label="Confirm New Password"
                value={form.confirmPassword}
                show={show.confirm}
                onToggle={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                placeholder="Re-enter new password"
              />

              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={status === 'loading'}
                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-red-500 transition-colors text-sm disabled:opacity-60 mt-2"
              >
                {status === 'loading' ? 'Updating...' : 'Update Password'}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const PasswordInput = ({ label, value, show, onToggle, onChange, placeholder, invalid }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>
    <div className="relative">
      <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
      <input
        type={show ? 'text' : 'password'}
        value={value} onChange={onChange}
        placeholder={placeholder} required
        className={`w-full bg-slate-50 border pl-10 pr-11 py-3 rounded-xl text-sm outline-none transition-all ${invalid ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-slate-400 focus:bg-white'}`}
      />
      <button type="button" onClick={onToggle}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
        {show ? <HiOutlineEyeOff size={17} /> : <HiOutlineEye size={17} />}
      </button>
    </div>
  </div>
);

export default ChangePassword;
