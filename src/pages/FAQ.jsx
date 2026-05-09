import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const faqData = [
  {
    category: 'Orders & Shipping',
    items: [
      { question: 'What is your return policy?', answer: 'You can return unworn items within 14 days for a full refund. Items must be in original packaging with tags attached.' },
      { question: 'Do you offer international shipping?', answer: 'Yes, we ship worldwide with premium delivery options. International orders typically arrive in 10–14 business days.' },
      { question: 'How do I track my order?', answer: 'Tracking information is emailed once your order ships. You can also track via your account dashboard under "Order History".' },
      { question: 'Can I change or cancel my order?', answer: 'Orders can be changed or cancelled within 2 hours of placement. After that, we begin processing immediately.' },
    ],
  },
  {
    category: 'Products & Sizing',
    items: [
      { question: 'How do I find my size?', answer: 'Each product has a detailed size guide. We recommend measuring your chest, waist, and hips and comparing to our chart.' },
      { question: 'Are your products authentic luxury?', answer: 'Absolutely. Every Velix piece is crafted from premium, responsibly sourced materials with quality guarantees.' },
      { question: 'Do you restock sold-out items?', answer: 'Some items are limited edition and won\'t be restocked. Subscribe to our newsletter to be notified of restocks.' },
    ],
  },
  {
    category: 'Payments & Account',
    items: [
      { question: 'What payment methods do you accept?', answer: 'We accept all major credit/debit cards, PayPal, Apple Pay, Google Pay, and bank transfers for large orders.' },
      { question: 'Is my payment information secure?', answer: 'Yes. We use bank-level SSL encryption. Your card details are never stored on our servers.' },
      { question: 'How do I reset my password?', answer: 'Click "Forgot Password" on the login page. You\'ll receive a reset link within 5 minutes.' },
    ],
  },
];

export default function FAQ() {
  const [openItem, setOpenItem] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...faqData.map((f) => f.category)];

  const filteredData = faqData
    .filter((group) => activeCategory === 'All' || group.category === activeCategory)
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.question.toLowerCase().includes(search.toLowerCase()) ||
          item.answer.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero */}
      <section className="bg-slate-950 py-20 text-center text-white">
        <div className="mx-auto max-w-2xl px-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">FAQ</p>
          <h1 className="mt-3 text-5xl font-bold">Frequently asked questions</h1>
          <p className="mt-4 text-slate-400">Everything you need to know about Velix. Can't find your answer? Contact us.</p>
          <div className="mt-8 relative max-w-sm mx-auto">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="search" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full rounded-full border border-slate-700 bg-slate-800 py-4 pl-10 pr-6 text-sm text-white placeholder-slate-500 outline-none focus:border-slate-500"
            />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition ${activeCategory === cat
                ? 'bg-slate-950 text-white shadow-md'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-400'}`}>
              {cat}
            </button>
          ))}
        </div>

        {filteredData.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            No questions match your search.
          </div>
        ) : (
          filteredData.map((group, gi) => (
            <div key={gi} className="mb-10">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span className="h-1 w-6 bg-gold rounded-full inline-block" />
                {group.category}
              </h2>
              <div className="space-y-3">
                {group.items.map((item, qi) => {
                  const key = `${gi}-${qi}`;
                  const isOpen = openItem === key;
                  return (
                    <div key={qi} className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                      <button
                        onClick={() => setOpenItem(isOpen ? null : key)}
                        className="flex w-full items-center justify-between px-7 py-5 text-left">
                        <span className="text-sm font-semibold text-slate-900 pr-4">{item.question}</span>
                        {isOpen ? <FiChevronUp size={16} className="text-slate-400 flex-shrink-0" /> : <FiChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <p className="px-7 pb-6 text-sm leading-7 text-slate-500">{item.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Still need help */}
      <section className="mx-auto max-w-4xl px-6">
        <div className="rounded-[2rem] bg-slate-950 p-10 text-center text-white">
          <h2 className="text-2xl font-bold">Still have questions?</h2>
          <p className="mt-3 text-slate-400 text-sm">Our support team is available Monday–Friday, 9am–6pm EST.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="rounded-full bg-gold px-8 py-3 text-sm font-semibold text-slate-950 hover:bg-yellow-400 transition">
              Contact support
            </Link>
            <a href="mailto:support@velix.com" className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold text-white hover:border-slate-400 transition">
              Email us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
