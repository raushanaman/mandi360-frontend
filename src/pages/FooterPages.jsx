import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineClock, HiOutlineCheckCircle, HiOutlineTruck, HiOutlineRefresh, HiOutlineShieldCheck } from 'react-icons/hi';

// ─── New Arrivals ───────────────────────────────────────────────────────────
export const NewArrivals = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-xs font-black uppercase tracking-widest text-red-400 mb-3">Just Landed</p>
        <h1 className="text-5xl font-black tracking-tight mb-3">New Arrivals</h1>
        <p className="text-slate-400 text-lg">Fresh products added by local shops this week</p>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 py-12 text-center">
      <div className="text-6xl mb-4">🆕</div>
      <h2 className="text-2xl font-black text-slate-900 mb-3">New products are added daily</h2>
      <p className="text-slate-500 mb-8 max-w-md mx-auto">Browse our shops to discover the latest products from local merchants near you.</p>
      <Link to="/shops" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-red-500 transition-colors inline-block">
        Browse All Shops →
      </Link>
    </div>
  </div>
);

// ─── Local Deals ────────────────────────────────────────────────────────────
export const LocalDeals = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="bg-red-500 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-xs font-black uppercase tracking-widest text-red-100 mb-3">Save More</p>
        <h1 className="text-5xl font-black tracking-tight mb-3">Local Deals 🔥</h1>
        <p className="text-red-100 text-lg">Best prices from shops in your neighborhood</p>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { emoji: '🛒', title: 'Grocery Deals', desc: 'Fresh produce & daily essentials at lowest prices', link: '/products/groceries' },
          { emoji: '👗', title: 'Fashion Deals', desc: 'Trendy clothing & accessories from local boutiques', link: '/products/clothing' },
          { emoji: '🍰', title: 'Bakery Specials', desc: 'Fresh baked goods & sweet treats daily', link: '/products/bakery' },
        ].map(d => (
          <Link key={d.title} to={d.link}>
            <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-lg transition-all">
              <div className="text-4xl mb-3">{d.emoji}</div>
              <h3 className="font-black text-slate-900 mb-2">{d.title}</h3>
              <p className="text-slate-500 text-sm">{d.desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>
      <div className="text-center">
        <Link to="/shops" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-red-500 transition-colors inline-block">
          Explore All Deals →
        </Link>
      </div>
    </div>
  </div>
);

// ─── Shipping Policy ─────────────────────────────────────────────────────────
export const ShippingPolicy = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="bg-slate-900 text-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-xs font-black uppercase tracking-widest text-red-400 mb-3">Delivery Info</p>
        <h1 className="text-5xl font-black tracking-tight mb-3">Shipping Policy</h1>
        <p className="text-slate-400">Everything you need to know about delivery</p>
      </div>
    </div>
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
      {[
        { icon: <HiOutlineTruck size={24} />, title: 'Local Shop Delivery', color: 'bg-emerald-50 text-emerald-600',
          points: ['Free delivery on all local shop orders', 'Delivered within 2–4 hours of order placement', 'Available within city limits of the shop', 'Real-time order status updates via dashboard'] },
        { icon: <HiOutlineClock size={24} />, title: 'Delivery Timings', color: 'bg-blue-50 text-blue-600',
          points: ['Monday – Saturday: 9:00 AM to 9:00 PM', 'Sunday: 10:00 AM to 6:00 PM', 'Public holidays may have limited delivery', 'Express delivery available for select shops'] },
        { icon: <HiOutlineCheckCircle size={24} />, title: 'Order Confirmation', color: 'bg-purple-50 text-purple-600',
          points: ['Order confirmed instantly after payment', 'Merchant notified immediately', 'You can track status in My Orders', 'SMS/email notification on delivery'] },
        { icon: <HiOutlineRefresh size={24} />, title: 'Failed Delivery', color: 'bg-amber-50 text-amber-600',
          points: ['3 delivery attempts will be made', 'Contact support if delivery fails', 'Full refund for undelivered orders', 'Rescheduling available within 24 hours'] },
      ].map(s => (
        <div key={s.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
            <h2 className="font-black text-slate-900 text-lg">{s.title}</h2>
          </div>
          <ul className="space-y-2">
            {s.points.map(p => (
              <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span> {p}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

// ─── Help Center ─────────────────────────────────────────────────────────────
export const HelpCenter = () => {
  const faqs = [
    { q: 'How do I place an order?', a: 'Browse shops, add products to cart, then proceed to checkout. Select your delivery address and payment method.' },
    { q: 'Can I cancel my order?', a: 'Yes, you can cancel orders that are in "Pending" or "Confirmed" status from My Orders page.' },
    { q: 'How do I track my order?', a: 'Go to My Orders from the header menu. You can see real-time status of all your orders.' },
    { q: 'What payment methods are accepted?', a: 'We accept UPI, Credit/Debit Cards, Net Banking via Razorpay, and Cash on Delivery.' },
    { q: 'How do I become a merchant?', a: 'Register with merchant role, then go to "Sell on Mandi-360" to register your shop.' },
    { q: 'Is delivery free?', a: 'Yes! Delivery is completely free for all local shop orders on Mandi-360.' },
    { q: 'How do I write a review?', a: 'Visit the shop page and scroll to the Reviews section. You can rate and write a review after your purchase.' },
    { q: 'What if I receive a wrong item?', a: 'Contact us at support@mandi360.com within 24 hours with your order ID and photos.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-black uppercase tracking-widest text-red-400 mb-3">We're Here</p>
          <h1 className="text-5xl font-black tracking-tight mb-3">Help Center</h1>
          <p className="text-slate-400">Find answers to common questions</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { emoji: '📦', title: 'Orders & Delivery', link: '#faq' },
            { emoji: '💳', title: 'Payments & Refunds', link: '#faq' },
            { emoji: '🏪', title: 'Merchant Support', link: '/register-shop' },
          ].map(c => (
            <a key={c.title} href={c.link}>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 text-center hover:shadow-md transition-all cursor-pointer">
                <div className="text-3xl mb-2">{c.emoji}</div>
                <p className="font-bold text-slate-900 text-sm">{c.title}</p>
              </div>
            </a>
          ))}
        </div>

        <div id="faq" className="space-y-3">
          <h2 className="text-xl font-black text-slate-900 mb-5">Frequently Asked Questions</h2>
          {faqs.map((f, i) => (
            <details key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm group">
              <summary className="px-6 py-4 font-bold text-slate-900 text-sm cursor-pointer list-none flex items-center justify-between">
                {f.q}
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="px-6 pb-4 text-sm text-slate-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
          <p className="font-black text-slate-900 mb-2">Still need help?</p>
          <p className="text-slate-500 text-sm mb-4">Our support team is available Mon–Sat, 9AM–6PM</p>
          <Link to="/contact" className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors inline-block">
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── Contact Us ──────────────────────────────────────────────────────────────
export const ContactUs = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="bg-slate-900 text-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-xs font-black uppercase tracking-widest text-red-400 mb-3">Reach Out</p>
        <h1 className="text-5xl font-black tracking-tight mb-3">Contact Us</h1>
        <p className="text-slate-400">We'd love to hear from you</p>
      </div>
    </div>
    <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Contact Info */}
      <div className="space-y-5">
        <h2 className="text-xl font-black text-slate-900">Get in Touch</h2>
        {[
          { icon: <HiOutlineMail size={20} />, label: 'Email', value: 'support@mandi360.com', href: 'mailto:support@mandi360.com' },
          { icon: <HiOutlinePhone size={20} />, label: 'Phone', value: '+91 1234 123 412', href: 'tel:+911234123412' },
          { icon: <HiOutlineLocationMarker size={20} />, label: 'Address', value: 'Patna, Bihar, India — 800001', href: null },
          { icon: <HiOutlineClock size={20} />, label: 'Hours', value: 'Mon–Sat: 9AM – 6PM IST', href: null },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center flex-shrink-0">{c.icon}</div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">{c.label}</p>
              {c.href
                ? <a href={c.href} className="font-bold text-slate-900 hover:text-red-500 transition-colors">{c.value}</a>
                : <p className="font-bold text-slate-900">{c.value}</p>
              }
            </div>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-xl font-black text-slate-900 mb-5">Send a Message</h2>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert('Message sent! We\'ll get back to you within 24 hours.'); e.target.reset(); }}>
          <input required placeholder="Your Name" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400" />
          <input required type="email" placeholder="Email Address" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400" />
          <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400 bg-white">
            <option>Order Issue</option>
            <option>Payment Problem</option>
            <option>Merchant Support</option>
            <option>General Inquiry</option>
          </select>
          <textarea required rows={4} placeholder="Describe your issue..." className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400 resize-none" />
          <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-500 transition-colors">
            Send Message →
          </button>
        </form>
      </div>
    </div>
  </div>
);

// ─── Privacy Policy ──────────────────────────────────────────────────────────
export const PrivacyPolicy = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="bg-slate-900 text-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-xs font-black uppercase tracking-widest text-red-400 mb-3">Legal</p>
        <h1 className="text-5xl font-black tracking-tight mb-3">Privacy Policy</h1>
        <p className="text-slate-400">Last updated: January 2025</p>
      </div>
    </div>
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
      {[
        { title: '1. Information We Collect', content: 'We collect information you provide directly: name, email address, phone number, delivery addresses, and payment information. We also collect usage data such as pages visited, products viewed, and orders placed to improve your experience.' },
        { title: '2. How We Use Your Information', content: 'Your information is used to process orders and payments, deliver products to your address, send order confirmations and updates, improve our platform and services, and communicate offers and promotions (with your consent).' },
        { title: '3. Information Sharing', content: 'We share your delivery address and contact details with the merchant fulfilling your order. We do not sell your personal data to third parties. Payment information is processed securely by Razorpay and is never stored on our servers.' },
        { title: '4. Data Security', content: 'We use industry-standard SSL encryption for all data transmission. Passwords are hashed using bcrypt. We regularly audit our security practices to protect your information.' },
        { title: '5. Cookies', content: 'We use cookies to maintain your session, remember your cart, and analyze site traffic. You can disable cookies in your browser settings, though some features may not work correctly.' },
        { title: '6. Your Rights', content: 'You have the right to access, correct, or delete your personal data. You can update your profile information from your account settings. To request data deletion, contact us at support@mandi360.com.' },
        { title: '7. Contact', content: 'For privacy-related questions, contact our Data Protection Officer at privacy@mandi360.com or write to us at Mandi-360, Patna, Bihar, India — 800001.' },
      ].map(s => (
        <div key={s.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-black text-slate-900 mb-3">{s.title}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{s.content}</p>
        </div>
      ))}
    </div>
  </div>
);

// ─── Terms of Service ────────────────────────────────────────────────────────
export const TermsOfService = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="bg-slate-900 text-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-xs font-black uppercase tracking-widest text-red-400 mb-3">Legal</p>
        <h1 className="text-5xl font-black tracking-tight mb-3">Terms of Service</h1>
        <p className="text-slate-400">Last updated: January 2025</p>
      </div>
    </div>
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
      {[
        { title: '1. Acceptance of Terms', content: 'By accessing or using Mandi-360, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.' },
        { title: '2. User Accounts', content: 'You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your password. Notify us immediately of any unauthorized use of your account.' },
        { title: '3. Merchant Responsibilities', content: 'Merchants must provide accurate product descriptions, prices, and availability. Merchants are responsible for fulfilling orders on time. Fraudulent listings will result in immediate account suspension.' },
        { title: '4. Orders & Payments', content: 'All prices are in Indian Rupees (INR). Orders are confirmed only after successful payment. Mandi-360 acts as a marketplace and is not responsible for merchant-side delays.' },
        { title: '5. Cancellations & Refunds', content: 'Users can cancel orders in Pending or Confirmed status. Refunds for online payments are processed within 5–7 business days. COD orders cancelled before delivery incur no charge.' },
        { title: '6. Prohibited Activities', content: 'You may not use Mandi-360 for illegal activities, posting false reviews, creating fake accounts, or attempting to hack or disrupt our services.' },
        { title: '7. Limitation of Liability', content: 'Mandi-360 is not liable for indirect, incidental, or consequential damages. Our maximum liability is limited to the amount paid for the specific order in question.' },
        { title: '8. Changes to Terms', content: 'We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.' },
      ].map(s => (
        <div key={s.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-black text-slate-900 mb-3">{s.title}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{s.content}</p>
        </div>
      ))}
    </div>
  </div>
);

// ─── Cookies Policy ──────────────────────────────────────────────────────────
export const CookiesPolicy = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="bg-slate-900 text-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-xs font-black uppercase tracking-widest text-red-400 mb-3">Legal</p>
        <h1 className="text-5xl font-black tracking-tight mb-3">Cookie Policy</h1>
        <p className="text-slate-400">Last updated: January 2025</p>
      </div>
    </div>
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
      {[
        { title: 'What Are Cookies?', content: 'Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and improve your browsing experience.' },
        { title: 'Cookies We Use', content: null, table: [
          { type: 'Essential', purpose: 'Login session, cart data', duration: 'Session / 7 days' },
          { type: 'Analytics', purpose: 'Page views, traffic analysis', duration: '30 days' },
          { type: 'Preference', purpose: 'Language, theme settings', duration: '1 year' },
        ]},
        { title: 'Managing Cookies', content: 'You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. Note that disabling essential cookies may affect login and cart functionality.' },
        { title: 'Third-Party Cookies', content: 'Razorpay (our payment partner) may set cookies for fraud prevention and payment processing. These are governed by Razorpay\'s own privacy policy.' },
      ].map(s => (
        <div key={s.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-black text-slate-900 mb-3">{s.title}</h2>
          {s.content && <p className="text-sm text-slate-600 leading-relaxed">{s.content}</p>}
          {s.table && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-slate-100">{['Type','Purpose','Duration'].map(h => <th key={h} className="text-left py-2 pr-4 text-xs font-black uppercase tracking-widest text-slate-400">{h}</th>)}</tr></thead>
                <tbody>{s.table.map(r => <tr key={r.type} className="border-b border-slate-50"><td className="py-3 pr-4 font-bold text-slate-900">{r.type}</td><td className="py-3 pr-4 text-slate-600">{r.purpose}</td><td className="py-3 text-slate-600">{r.duration}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);
