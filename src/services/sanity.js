import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const config = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2026-01-01',
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
