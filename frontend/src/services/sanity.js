import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const config = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01',
  useCdn: import.meta.env.VITE_SANITY_USE_CDN !== 'false',
};

export const client = sanityClient(config);
const builder = imageUrlBuilder(client);

export const urlFor = (source) => source ? builder.image(source) : '';

export async function fetchProducts() {
  const query = `*[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    slug,
    category,
    price,
    description,
    featured,
    newArrival,
    "imageUrl": image.asset->url
  }`;

  const products = await client.fetch(query);
  return products.map((product) => ({
    id: product._id,
    name: product.name || 'Untitled product',
    category: product.category || 'Uncategorized',
    price: product.price ?? 0,
    description: product.description || '',
    featured: product.featured ?? false,
    newArrival: product.newArrival ?? false,
    slug: product.slug?.current || product._id,
    image: product.imageUrl || '',
  }));
}

export async function fetchPosts() {
  const query = `*[_type == "post"] | order(date desc) {
    _id,
    title,
    slug,
    category,
    author,
    date,
    readTime,
    excerpt,
    featured,
    "image": image.asset->url
  }`;
  const posts = await client.fetch(query);
  return posts.map(post => ({
    ...post,
    slug: post.slug?.current || post._id,
  }));
}

export async function fetchTestimonials() {
  const query = `*[_type == "testimonial"] | order(_createdAt desc)`;
  return await client.fetch(query);
}

export async function fetchFaqs() {
  const query = `*[_type == "faq"] | order(_createdAt asc)`;
  return await client.fetch(query);
}

export async function fetchCategories() {
  const query = `*[_type == "category"] | order(_createdAt asc) {
    _id,
    name,
    slug,
    count,
    "image": image.asset->url
  }`;
  const categories = await client.fetch(query);
  return categories.map(cat => ({
    ...cat,
    slug: cat.slug?.current || cat._id,
  }));
}
