import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { fetchFaqs } from '../services/sanity.js';
import Loader from '../components/common/Loader.jsx';

export default function FAQ() {
  const [openItem, setOpenItem] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs()
      .then(setFaqData)
      .catch((err) => console.error('Error loading FAQs:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  // Build unique category list from flat faq docs
  const uniqueCategories = ['All', ...new Set(faqData.map((f) => f.category).filter(Boolean))];

  // Filter flat FAQ list
  const filtered = faqData.filter((item) => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch =
      item.question?.toLowerCase().includes(search.toLowerCase()) ||
      item.answer?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Group filtered items by category for display
  const grouped = filtered.reduce((acc, item) => {
    const cat = item.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-16 pb-20">
      {/* Hero */}
      <section className="bg-slate-950 py-20 text-center text-white">
        <div className="mx-auto max-w-2xl px-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">FAQ</p>
          <h1 className="mt-3 text-5xl font-bold">Frequently asked questions</h1>
          <p className="mt-4 text-slate-400">
            Everything you need to know about Velix. Can't find your answer? Contact us.
          </p>
          <div className="mt-8 relative max-w-sm mx-auto">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full rounded-full border border-slate-700 bg-slate-800 py-4 pl-10 pr-6 text-sm text-white placeholder-slate-500 outline-none focus:border-slate-500"
            />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition ${
                activeCategory === cat
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            No questions match your search.
          </div>
        ) : (
          Object.entries(grouped).map(([groupName, items], gi) => (
            <div key={groupName} className="mb-10">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span className="h-1 w-6 bg-yellow-400 rounded-full inline-block" />
                {groupName}
              </h2>
              <div className="space-y-3">
                {items.map((item) => {
                  const key = item._id;
                  const isOpen = openItem === key;
                  return (
                    <div
                      key={key}
                      className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenItem(isOpen ? null : key)}
                        className="flex w-full items-center justify-between px-7 py-5 text-left"
                      >
                        <span className="text-sm font-semibold text-slate-900 pr-4">
                          {item.question}
                        </span>
                        {isOpen ? (
                          <FiChevronUp size={16} className="text-slate-400 flex-shrink-0" />
                        ) : (
                          <FiChevronDown size={16} className="text-slate-400 flex-shrink-0" />
                        )}
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="px-7 pb-6 text-sm leading-7 text-slate-500">
                              {item.answer}
                            </p>
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
          <p className="mt-3 text-slate-400 text-sm">
            Our support team is available Saturday–Thursday, 10am–7pm BST.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="rounded-full bg-yellow-400 px-8 py-3 text-sm font-semibold text-slate-950 hover:bg-yellow-300 transition"
            >
              Contact support
            </Link>
            <a
              href="mailto:hello@velix.store"
              className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold text-white hover:border-slate-400 transition"
            >
              Email us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
