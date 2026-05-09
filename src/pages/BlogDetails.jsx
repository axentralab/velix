import { useParams } from 'react-router-dom';

const posts = {
  'luxury-streetwear': {
    title: 'Luxury streetwear trends for 2026',
    content: 'Minimal design, premium fabrics, and street-inspired silhouettes drive the next wave of elevated streetwear.',
  },
  'seasonal-styling': {
    title: 'Seasonal styling for modern essentials',
    content: 'Build a capsule wardrobe with statement pieces, soft neutrals, and polished tailoring for every season.',
  },
};

export default function BlogDetails() {
  const { slug } = useParams();
  const post = posts[slug] || posts['luxury-streetwear'];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-4xl font-bold text-slate-950">{post.title}</h1>
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm leading-8 text-slate-700">{post.content}</p>
      </div>
    </div>
  );
}
