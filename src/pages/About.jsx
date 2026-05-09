import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const team = [
  { name: 'Isabelle Fontaine', role: 'Founder & Creative Director', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80' },
  { name: 'Marco Visconti', role: 'Head of Design', img: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sophia Chen', role: 'Lead Stylist', img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80' },
];

const values = [
  { title: 'Craftsmanship', desc: 'Every piece is designed with extraordinary attention to detail and handcrafted by skilled artisans.' },
  { title: 'Sustainability', desc: 'We use only responsibly sourced fabrics from certified suppliers who share our environmental values.' },
  { title: 'Inclusivity', desc: 'Luxury is for everyone. We celebrate diverse body types, styles, and identities in everything we do.' },
  { title: 'Innovation', desc: 'We push boundaries in fashion design, blending heritage techniques with modern aesthetics.' },
];

const milestones = [
  { year: '2019', event: 'Velix founded in Paris with a collection of 12 signature pieces.' },
  { year: '2020', event: 'Expanded to online retail, reaching customers in 45 countries.' },
  { year: '2022', event: 'Launched the Velix Sustainable Line, reducing carbon footprint by 40%.' },
  { year: '2024', event: 'Opened flagship stores in New York, London, and Tokyo.' },
  { year: '2026', event: 'Celebrating 1 million customers worldwide and our biggest collection yet.' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function About() {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.7 }}>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">About us</p>
            <h1 className="mt-3 text-5xl font-bold text-slate-950 leading-tight">Crafting elevated fashion stories.</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Velix is a curated fashion experience with refined products, editorial storytelling, and a design-first mindset.
              Born in Paris, worn worldwide — we believe fashion is the ultimate form of self-expression.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/shop" className="flex items-center gap-2 rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white hover:bg-slate-800 transition">
                Shop now <FiArrowRight />
              </Link>
              <Link to="/contact" className="flex items-center gap-2 rounded-full border border-slate-200 px-8 py-4 text-sm font-semibold text-slate-700 hover:border-slate-400 transition">
                Get in touch
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm">
            <img src="https://images.unsplash.com/photo-1495121605193-b116b5b9c5d5?auto=format&fit=crop&w=1200&q=80"
              alt="Brand story" className="h-[480px] w-full object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: '1M+', label: 'Customers worldwide' },
              { value: '45+', label: 'Countries served' },
              { value: '200+', label: 'Signature designs' },
              { value: '7', label: 'Years of excellence' },
            ].map((stat, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }} className="text-center">
                <p className="text-4xl font-black text-slate-950">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">What drives us</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">Our core values</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="mb-4 h-10 w-10 rounded-full bg-slate-950 flex items-center justify-center text-gold font-bold text-sm">
                0{i + 1}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{v.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-slate-950 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Our journey</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Built milestone by milestone.</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-700 hidden md:block" />
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`flex flex-col md:flex-row md:items-center gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 rounded-3xl border border-slate-700 bg-slate-900 p-6 ${i % 2 === 0 ? 'md:text-right' : ''}`}>
                    <p className="text-gold text-sm font-bold tracking-widest">{m.year}</p>
                    <p className="mt-2 text-slate-300 text-sm leading-7">{m.event}</p>
                  </div>
                  <div className="hidden md:flex h-4 w-4 rounded-full bg-gold border-4 border-slate-950 z-10 flex-shrink-0" />
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">The people</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">Meet the team behind Velix.</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {team.map((member, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.15, duration: 0.5 }}
              className="group rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
              <div className="overflow-hidden">
                <img src={member.img} alt={member.name}
                  className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-12 text-center text-white">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Ready to explore?</p>
          <h2 className="mt-4 text-4xl font-black">Experience luxury fashion today.</h2>
          <p className="mt-4 text-slate-400 max-w-md mx-auto">
            Browse our full collection and discover pieces crafted to elevate every moment of your life.
          </p>
          <Link to="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-10 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-950 hover:bg-yellow-400 transition">
            Shop the collection <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
