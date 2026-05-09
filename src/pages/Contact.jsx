import { useState } from 'react';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiSend, FiClock } from 'react-icons/fi';

const contactMethods = [
  { icon: <FiMail size={20} />, title: 'Email us', value: 'support@velix.com', sub: 'Reply within 24 hours' },
  { icon: <FiPhone size={20} />, title: 'Call us', value: '+1 (800) 123-4567', sub: 'Mon–Fri, 9am–6pm EST' },
  { icon: <FiMapPin size={20} />, title: 'Visit us', value: '24 Rue du Faubourg, Paris', sub: 'By appointment only' },
  { icon: <FiClock size={20} />, title: 'Live chat', value: 'Available now', sub: 'Avg. response: 3 min' },
];

const topics = ['Order inquiry', 'Product question', 'Return request', 'Styling advice', 'Press & media', 'Other'];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function Contact() {
  const [topic, setTopic] = useState('');
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Contact</p>
          <h1 className="mt-3 text-5xl font-bold text-slate-950">Need help? Reach out.</h1>
          <p className="mt-4 text-slate-500 text-lg">
            Our team is always here to help with orders, styling advice, and anything else.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {contactMethods.map((m, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-gold">{m.icon}</span>
              <p className="text-xs uppercase tracking-widest text-slate-400">{m.title}</p>
              <p className="font-semibold text-slate-900 text-sm">{m.value}</p>
              <p className="text-xs text-slate-400">{m.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Form */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.7 }}>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-2">Send us a message</p>
            <h2 className="text-3xl font-bold text-slate-950 mb-8">We'd love to hear from you.</h2>

            {sent ? (
              <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-10 text-center">
                <div className="text-5xl mb-4">✓</div>
                <h3 className="text-xl font-semibold text-emerald-800">Message sent!</h3>
                <p className="mt-2 text-sm text-emerald-600">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-6 text-sm underline text-emerald-600 hover:text-emerald-800">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Name</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                      placeholder="Your name"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Topic</label>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((t) => (
                      <button key={t} type="button" onClick={() => setTopic(t === topic ? '' : t)}
                        className={`rounded-full px-4 py-2 text-xs font-medium transition border ${topic === t
                          ? 'bg-slate-950 text-white border-slate-950'
                          : 'border-slate-200 text-slate-600 hover:border-slate-400'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Message</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required
                    rows={5} placeholder="How can we help you?"
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition" />
                </div>
                <button type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-slate-800">
                  <FiSend size={15} /> Send message
                </button>
              </form>
            )}
          </motion.div>

          {/* Info Panel */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2, duration: 0.7 }}
            className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Flagship Store</h3>
              <div className="overflow-hidden rounded-2xl aspect-video bg-slate-100">
                <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
                  alt="Store" className="h-full w-full object-cover" />
              </div>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <p>📍 24 Rue du Faubourg Saint-Honoré, Paris 75008</p>
                <p>🕘 Monday – Saturday: 10am – 7pm</p>
                <p>📞 +33 1 23 45 67 89</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Follow us</h3>
              <div className="flex gap-3">
                <a href="#" className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition">
                  <FiInstagram size={18} />
                </a>
                <a href="#" className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition">
                  <FiTwitter size={18} />
                </a>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                @velix — Follow us for daily drops, styling tips, and behind-the-scenes content.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Prompt */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="rounded-[2rem] bg-slate-50 border border-slate-200 p-10 text-center">
          <h2 className="text-2xl font-bold text-slate-950">Looking for quick answers?</h2>
          <p className="mt-3 text-slate-500 text-sm">Check our FAQ page for common questions about orders, returns, and more.</p>
          <a href="/faq" className="mt-6 inline-flex rounded-full bg-slate-950 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition">
            View FAQ
          </a>
        </div>
      </section>
    </div>
  );
}
