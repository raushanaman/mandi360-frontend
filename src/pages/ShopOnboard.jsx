import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineBuildingStorefront, HiOutlineCheckBadge, HiOutlineRocketLaunch } from 'react-icons/hi2';
import '../styles/Shop.css';

const ShopOnboard = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
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
              <p className="text-slate-500 mb-10 max-w-sm mx-auto">First, tell us the basic details of your business to get started.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <InputField label="Business Name" placeholder="e.g. Aman General Store" />
                <InputField label="Owner Name" placeholder="Aman Raushan" />
              </div>
              <button onClick={() => setStep(2)} className="mt-10 w-full bg-red-500 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-slate-900 transition-all">
                CONTINUE TO CATEGORY
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
               <h2 className="text-3xl font-black text-slate-900 mb-8">What do you sell?</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  {['Grocery', 'Fashion', 'Tech', 'Home'].map(cat => (
                    <button key={cat} className="p-6 border-2 border-slate-100 rounded-3xl hover:border-red-500 font-bold transition-all text-slate-600 hover:text-red-500">
                      {cat}
                    </button>
                  ))}
               </div>
               <button onClick={() => setStep(3)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black">
                FINALIZE SETUP
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
               <p className="text-slate-500 mb-10">Your shop will be live as soon as we verify your address.</p>
               <button className="bg-red-500 text-white px-12 py-5 rounded-2xl font-black flex items-center gap-3 mx-auto">
                 GO TO MY DASHBOARD <HiOutlineRocketLaunch />
               </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const InputField = ({ label, placeholder }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-black uppercase text-slate-400 tracking-widest">{label}</label>
    <input type="text" placeholder={placeholder} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-red-500 transition-all font-medium" />
  </div>
);

export default ShopOnboard;