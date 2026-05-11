import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiClock, FiUser } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { fetchPosts } from '../services/sanity.js';
import Loader from '../components/common/Loader.jsx';

const CATEGORIES = ['All', 'Trends', 'Styling', 'Sustainability', 'Style Guide', 'Events'];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        console.error("Error loading blog posts:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  if (loading) return <Loader />;

  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <div className="space-y-20 pb-20">
      {/* Header */}
      <section className="bg-slate-950 py-20 text-white text-center">
        <div className="mx-auto max-w-2xl px-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Journal</p>
          <h1 className="mt-3 text-5xl font-bold">Fashion insights & stories</h1>
          <p className="mt-4 text-slate-400">Trends, styling advice, and behind-the-scenes from the world of Velix.</p>
        </div>
      </section>

      {/* Featured Post */}
      {featured && (
        <section className="mx-auto max-w-6xl px-6">
          <p className="mb-6 text-sm uppercase tracking-[0.3em] text-slate-500">Featured story</p>
          <Link to={`/blog/${featured.slug}`}
            className="group grid gap-8 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
            <div className="overflow-hidden">
              <img src={featured.image} alt={featured.title}
                className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105 lg:h-full" />
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-widest text-slate-500 w-fit">{featured.category}</span>
              <h2 className="mt-4 text-3xl font-bold text-slate-950">{featured.title}</h2>
              <p className="mt-4 text-slate-500 leading-7">{featured.excerpt}</p>
              <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1"><FiUser size={12} /> {featured.author}</span>
                <span className="flex items-center gap-1"><FiClock size={12} /> {featured.readTime}</span>
                <span>{featured.date}</span>
              </div>
              <span className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-950 group-hover:text-gold transition-colors">
                Read article <FiArrowRight />
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* Category Filter */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button key={cat}
              className="rounded-full px-5 py-2.5 text-sm font-medium border border-slate-200 bg-white text-slate-600 hover:border-slate-400 transition">
              {cat}
            </button>
          ))}
        </div>

        {/* Post Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((post, i) => (
            <motion.div key={post.slug} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }}>
              <Link to={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition h-full">
                <div className="overflow-hidden">
                  <img src={post.image} alt={post.title}
                    className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs uppercase tracking-widest text-slate-400">{post.category}</span>
                  <h2 className="mt-2 text-lg font-semibold text-slate-950 leading-snug">{post.title}</h2>
                  <p className="mt-3 text-xs leading-6 text-slate-500 flex-1">{post.excerpt}</p>
                  <div className="mt-5 flex items-center gap-3 text-xs text-slate-400 border-t border-slate-100 pt-4">
                    <span className="flex items-center gap-1"><FiClock size={11} /> {post.readTime}</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter in Blog */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="rounded-[2rem] bg-slate-950 p-10 lg:p-14 flex flex-col lg:flex-row lg:items-center gap-8">
          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Never miss a story</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Subscribe to our journal.</h2>
            <p className="mt-2 text-slate-400 text-sm">New articles every week. No spam, ever.</p>
          </div>
          <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
            <input type="email" required placeholder="your@email.com"
              className="flex-1 rounded-full border border-slate-700 bg-slate-800 px-6 py-4 text-sm text-white placeholder-slate-500 outline-none focus:border-slate-500" />
            <button type="submit"
              className="rounded-full bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-950 hover:bg-yellow-400 transition whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
