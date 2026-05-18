import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiOutlineBuildingStorefront, HiOutlineCheckBadge, HiOutlineRocketLaunch } from 'react-icons/hi2';
import API from '../utils/api';
import '../styles/Shop.css';

const CATEGORIES = ['Groceries', 'Electronics', 'Clothing', 'Sports', 'Cosmetics', 'Furniture', 'Bakery'];

const CAT_MAP = {
  groceries: 'groceries', electronics: 'electronics', clothing: 'clothing',
  sports: 'sports', cosmetics: 'cosmetics', furniture: 'furniture', bakery: 'bakery',
};

const ShopOnboard = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', ownerName: '', category: '', phone: '', address: '', city: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/shops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name, category: form.category.toLowerCase(), phone: form.phone, address: form.address, city: form.city }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message);
      setStep(3);
    } catch {
      setError('Server error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-12 max-w-xs mx-auto">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-3 h-3 rounded-full ${step >= s ? 'bg-red-500' : 'bg-slate-300'} transition-colors`} />
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[3rem] p-10 md:p-16 shadow-xl border border-slate-100"
        >
          {step === 1 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl">
                <HiOutlineBuildingStorefront size={40} />
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Register Your Local Shop</h1>
              <p className="text-slate-500 mb-10 max-w-sm mx-auto">Tell us the basic details of your business.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <InputField label="Business Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Aman General Store" />
                <InputField label="Owner Name" name="ownerName" value={form.ownerName} onChange={handleChange} placeholder="Aman Raushan" />
                <InputField label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 00000 00000" />
                <InputField label="City" name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" />
                <div className="md:col-span-2">
                  <InputField label="Address" name="address" value={form.address} onChange={handleChange} placeholder="Street, Area, Pincode" />
                </div>
              </div>
              <button
                onClick={() => { if (form.name && form.phone) setStep(2); else setError('Please fill Business Name and Phone'); }}
                className="mt-10 w-full bg-red-500 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-slate-900 transition-all"
              >
                CONTINUE TO CATEGORY
              </button>
              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <h2 className="text-3xl font-black text-slate-900 mb-8">What do you sell?</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setForm(f => ({ ...f, category: cat }))}
                    className={`p-6 border-2 rounded-3xl font-bold transition-all ${form.category === cat ? 'border-red-500 text-red-500 bg-red-50' : 'border-slate-100 text-slate-600 hover:border-red-500 hover:text-red-500'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button
                onClick={() => { if (form.category) handleSubmit(); else setError('Please select a category'); }}
                disabled={loading}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black disabled:opacity-60"
              >
                {loading ? 'REGISTERING...' : 'FINALIZE SETUP'}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-10">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-2xl"
              >
                <HiOutlineCheckBadge size={50} />
              </motion.div>
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">YOU'RE READY TO SELL!</h2>
              <p className="text-slate-500 mb-10">Your shop is now live on Mandi-360.</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-red-500 text-white px-12 py-5 rounded-2xl font-black flex items-center gap-3 mx-auto hover:bg-slate-900 transition-all"
              >
                GO TO MY DASHBOARD <HiOutlineRocketLaunch />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, placeholder }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-black uppercase text-slate-400 tracking-widest">{label}</label>
    <input type="text" name={name} value={value} onChange={onChange} placeholder={placeholder}
      className="p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-red-500 transition-all font-medium" />
  </div>
);

export default ShopOnboard;
