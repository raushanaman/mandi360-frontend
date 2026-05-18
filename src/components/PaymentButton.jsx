import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineArrowRight, HiOutlineX, HiOutlinePlus, HiOutlineLocationMarker, HiOutlineRefresh } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

import API from '../utils/api';

const loadScript = (src) => new Promise(resolve => {
  if (document.querySelector(`script[src="${src}"]`)) { resolve(true); return; }
  const s = document.createElement('script');
  s.src = src; s.onload = () => resolve(true); s.onerror = () => resolve(false);
  document.body.appendChild(s);
});

const EMPTY_ADDR = { label: 'Home', street: '', city: '', state: '', pincode: '', phone: '' };

const PaymentButton = ({ amount }) => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [showModal,   setShowModal]   = useState(false);
  const [step,        setStep]        = useState('summary'); // summary | address | payment
  const [payMethod,   setPayMethod]   = useState('razorpay');
  const [addresses,   setAddresses]   = useState([]);
  const [selAddr,     setSelAddr]     = useState(null);
  const [newAddr,     setNewAddr]     = useState(EMPTY_ADDR);
  const [addingAddr,  setAddingAddr]  = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [retryData,   setRetryData]   = useState(null); // for payment retry

  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (showModal) fetchAddresses();
  }, [showModal]);

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get(`${API}/user/addresses`, { headers });
      setAddresses(data);
      const def = data.find(a => a.isDefault) || data[0];
      if (def) setSelAddr(def._id);
    } catch {}
  };

  const saveAddress = async () => {
    try {
      const { data } = await axios.post(`${API}/user/addresses`, { ...newAddr, isDefault: addresses.length === 0 }, { headers });
      setAddresses(data);
      setSelAddr(data[data.length - 1]._id);
      setAddingAddr(false);
      setNewAddr(EMPTY_ADDR);
    } catch { alert('Could not save address'); }
  };

  const initiateRazorpay = async (orderData) => {
    const loaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!loaded) { alert('Razorpay SDK failed to load'); setLoading(false); return; }

    const addr = addresses.find(a => a._id === selAddr);
    const options = {
      key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:      orderData.order.amount,
      currency:    'INR',
      name:        'Mandi-360',
      description: 'Order Payment',
      order_id:    orderData.order.id,
      handler: async (response) => {
        setLoading(true);
        try {
          const verifyRes = await axios.post(`${API}/payment/verify`, {
            ...response,
            items: items.map(i => ({
              name:   i.name,
              price:  i.price,
              qty:    i.qty,
              emoji:  i.emoji,
              shop:   i.shop || i.brand || '',
              shopId: i.shopId || null,
              image:  i.image || null,
            })),
            total:         amount,
            address:       addr,
            paymentMethod: 'razorpay',
          }, { headers });
          if (verifyRes.data.success) {
            clearCart();
            setShowModal(false);
            setStep('summary');
            navigate('/orders');
          } else {
            alert('Payment verification failed. Contact support.');
          }
        } catch (err) {
          alert('Verification error: ' + (err.response?.data?.message || err.message));
        } finally {
          setLoading(false);
        }
      },
      modal: {
        ondismiss: () => setLoading(false), // user ne popup band kiya
      },
      prefill: {
        name:    localStorage.getItem('firstName') || '',
        contact: addr?.phone || '',
      },
      theme: { color: '#ef4444' },
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (r) => {
      setLoading(false);
      setRetryData(orderData);
      alert(`Payment failed: ${r.error.description}. Click Retry to try again.`);
    });
    rzp.open();
    // loading false mat karo yahan — handler ya ondismiss karega
  };

  const handleCheckout = async () => {
    if (!token) { alert('Please login first'); return; }
    if (!selAddr && !addingAddr) { alert('Please select or add a delivery address'); return; }
    setLoading(true);
    try {
      if (payMethod === 'cod') {
        const addr = addresses.find(a => a._id === selAddr);
        await axios.post(`${API}/orders`, {
          items: items.map(i => ({
            name:   i.name,
            price:  i.price,
            qty:    i.qty,
            emoji:  i.emoji,
            shop:   i.shop   || '',
            shopId: i.shopId || null,
            image:  i.image  || null,
          })),
          total: amount, address: addr, paymentMethod: 'cod',
        }, { headers });
        clearCart();
        setShowModal(false);
        setStep('summary');
        navigate('/orders');
      } else {
        const orderData = retryData || (await axios.post(`${API}/payment/create-order`, { amount }, { headers })).data;
        setRetryData(null);
        await initiateRazorpay(orderData);
        // loading Razorpay ke handler/ondismiss mein false hoga
        return;
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={() => setShowModal(true)}
        className="w-full bg-red-500 py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 text-sm text-white"
      >
        Proceed to Checkout <HiOutlineArrowRight size={16} />
      </motion.button>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={e => {
              if (e.target === e.currentTarget) {
                setShowModal(false);
                setStep('summary');
              }
            }}
          >
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="font-black text-slate-900">
                  {step === 'summary' ? '🛍️ Order Summary' : step === 'address' ? '📍 Delivery Address' : '💳 Payment'}
                </h2>
                <button onClick={() => { setShowModal(false); setStep('summary'); }} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100">
                  <HiOutlineX size={18} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-6 space-y-4">

                {/* Step 1: Order Summary */}
                {step === 'summary' && (
                  <>
                    <div className="space-y-2">
                      {items.map(item => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-slate-100 flex-shrink-0 flex items-center justify-center">
                            {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <span>{item.emoji}</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                            <p className="text-xs text-slate-400">Qty: {item.qty} · ₹{item.price} each</p>
                          </div>
                          <p className="font-bold text-slate-900 text-sm">₹{(item.price * item.qty).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between font-black text-slate-900">
                      <span>Total</span><span>₹{amount.toLocaleString()}</span>
                    </div>
                    <button onClick={() => setStep('address')}
                      className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-500 transition-colors"
                    >
                      Continue to Address →
                    </button>
                  </>
                )}

                {/* Step 2: Address */}
                {step === 'address' && (
                  <>
                    {addresses.map(addr => (
                      <div key={addr._id} onClick={() => setSelAddr(addr._id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selAddr === addr._id ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <HiOutlineLocationMarker size={14} className="text-red-500" />
                          <span className="text-xs font-black text-slate-900 uppercase">{addr.label}</span>
                          {addr.isDefault && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">Default</span>}
                        </div>
                        <p className="text-sm text-slate-600">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                        {addr.phone && <p className="text-xs text-slate-400 mt-0.5">📞 {addr.phone}</p>}
                      </div>
                    ))}

                    {addingAddr ? (
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">New Address</p>
                        {[
                          { k: 'label',   ph: 'Label (e.g. Home, Work)',  type: 'text' },
                          { k: 'street',  ph: 'Street Address',           type: 'text' },
                          { k: 'city',    ph: 'City',                     type: 'text' },
                          { k: 'state',   ph: 'State',                    type: 'text' },
                          { k: 'pincode', ph: 'Pincode',                  type: 'text' },
                          { k: 'phone',   ph: 'Phone Number',             type: 'tel'  },
                        ].map(({ k, ph, type }) => (
                          <div key={k}>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{ph}</label>
                            <input
                              type={type}
                              placeholder={ph}
                              value={newAddr[k]}
                              onChange={e => setNewAddr(p => ({ ...p, [k]: e.target.value }))}
                              className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900 transition-all"
                            />
                          </div>
                        ))}
                        <div className="flex gap-2 pt-1">
                          <button onClick={saveAddress} className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors">Save Address</button>
                          <button onClick={() => { setAddingAddr(false); setNewAddr(EMPTY_ADDR); }} className="px-4 py-2.5 rounded-xl text-sm font-bold border-2 border-slate-200 text-slate-600 hover:border-slate-400 transition-colors">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setAddingAddr(true)}
                        className="w-full border-2 border-dashed border-slate-200 rounded-xl py-3 text-sm font-bold text-slate-400 hover:border-slate-400 hover:text-slate-600 flex items-center justify-center gap-2 transition-all"
                      >
                        <HiOutlinePlus size={16} /> Add New Address
                      </button>
                    )}

                    <button onClick={() => setStep('payment')} disabled={!selAddr}
                      className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-500 transition-colors disabled:opacity-40"
                    >
                      Continue to Payment →
                    </button>
                  </>
                )}

                {/* Step 3: Payment */}
                {step === 'payment' && (
                  <>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Select Payment Method</p>
                    {[
                      { id: 'razorpay', label: '💳 Pay Online', sub: 'UPI, Cards, Net Banking via Razorpay' },
                      { id: 'cod',      label: '💵 Cash on Delivery', sub: 'Pay when order arrives' },
                    ].map(m => (
                      <div key={m.id} onClick={() => setPayMethod(m.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${payMethod === m.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                        <p className="font-bold text-slate-900 text-sm">{m.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{m.sub}</p>
                      </div>
                    ))}

                    {retryData && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                        <HiOutlineRefresh size={16} className="text-red-500" />
                        <p className="text-xs text-red-600 font-semibold">Previous payment failed. Click below to retry.</p>
                      </div>
                    )}

                    <div className="border-t border-slate-100 pt-3 flex justify-between font-black text-slate-900 text-lg">
                      <span>Total</span><span>₹{amount.toLocaleString()}</span>
                    </div>

                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout} disabled={loading}
                      className="w-full bg-red-500 text-white py-4 rounded-xl font-black text-sm hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
                    >
                      {loading ? 'Processing...' : retryData ? <><HiOutlineRefresh size={16} /> Retry Payment</> : `Place Order · ₹${amount.toLocaleString()}`}
                    </motion.button>
                  </>
                )}
              </div>

              {/* Step indicator */}
              <div className="px-6 py-3 border-t border-slate-100 flex items-center gap-2">
                {['summary','address','payment'].map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <button onClick={() => step !== 'summary' && setStep(s)}
                      className={`w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center transition-all ${step === s ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}
                    >{i + 1}</button>
                    {i < 2 && <div className={`w-8 h-0.5 ${['summary','address'].indexOf(step) > i ? 'bg-slate-900' : 'bg-slate-200'}`} />}
                  </div>
                ))}
                <span className="text-xs text-slate-400 ml-1 capitalize">{step}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PaymentButton;
