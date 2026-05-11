import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const config = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01',
  useCdn: true,
};

export const client = sanityClient(config);
const builder = imageUrlBuilder(client);

// Safe image URL helper
export const urlFor = (source) => {
  if (!source) return '';
  try {
    return builder.image(source).url();
  } catch {
    return '';
  }
};

// ── Products ─────────────────────────────────────────────────────────────────
export async function fetchProducts() {
  const query = `*[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    slug,
    "category": category->name,
    "categorySlug": category->slug.current,
    subcategory,
    price,
    originalPrice,
    onSale,
    featured,
    newArrival,
    topSelling,
    freeDelivery,
    description,
    gender,
    sizes,
    colors,
    stock,
    "image": mainImage.asset->url,
    "images": images[].asset->url
  }`;

  const products = await client.fetch(query);
  return products.map((p) => ({
    id: p._id,
    name: p.name || 'Untitled Product',
    slug: p.slug?.current || p._id,
    category: p.category || 'Uncategorized',
    categorySlug: p.categorySlug || '',
    subcategory: p.subcategory || '',
    price: p.price ?? 0,
    originalPrice: p.originalPrice || null,
    onSale: p.onSale ?? false,
    featured: p.featured ?? false,
    newArrival: p.newArrival ?? false,
    topSelling: p.topSelling ?? false,
    freeDelivery: p.freeDelivery ?? false,
    description: p.description || '',
    gender: p.gender || 'unisex',
    sizes: p.sizes || [],
    colors: p.colors || [],
    stock: p.stock ?? 0,
    image: p.image || '',
    images: p.images || [],
  }));
}

// ── Categories ────────────────────────────────────────────────────────────────
export async function fetchCategories() {
  const query = `*[_type == "category"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    gender,
    description,
    featured,
    "image": image.asset->url
  }`;
  return await client.fetch(query);
}

// ── Shop Category Tree (parent + children) ────────────────────────────────────
// Returns parent categories with their subcategories nested inside
export async function fetchShopCategoryTree() {
  // Fetch all parent categories (no parentCategory set)
  const parentsQuery = `*[_type == "category" && !defined(parentCategory)] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    gender,
    "image": image.asset->url
  }`;

  // Fetch all subcategories (have a parentCategory)
  const childrenQuery = `*[_type == "category" && defined(parentCategory)] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    gender,
    "parentSlug": parentCategory->slug.current,
    "parentId": parentCategory->_id
  }`;

  const [parents, children] = await Promise.all([
    client.fetch(parentsQuery),
    client.fetch(childrenQuery),
  ]);

  // Nest children under their parent
  return parents.map((parent) => ({
    ...parent,
    children: children
      .filter((c) => c.parentId === parent._id)
      .map((c) => c.name),
  }));
}

// ── Banners ───────────────────────────────────────────────────────────────────
export async function fetchBanners() {
  const query = `*[_type == "banner" && active == true] | order(order asc) {
    _id,
    title,
    subtitle,
    offerText,
    buttonText,
    buttonLink,
    secondaryButtonText,
    secondaryButtonLink,
    bgColor,
    "heroImage": heroImage.asset->url,
    "mobileImage": mobileImage.asset->url
  }`;
  return await client.fetch(query);
}

// ── Blog Posts ────────────────────────────────────────────────────────────────
export async function fetchPosts() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    author,
    category,
    publishedAt,
    readTime,
    featured,
    tags,
    "image": thumbnail.asset->url
  }`;
  return await client.fetch(query);
}

export async function fetchPostBySlug(slug) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    author,
    category,
    publishedAt,
    readTime,
    content,
    tags,
    "image": thumbnail.asset->url
  }`;
  return await client.fetch(query, { slug });
}

// ── Testimonials ──────────────────────────────────────────────────────────────
export async function fetchTestimonials() {
  const query = `*[_type == "testimonial"] | order(_createdAt desc) {
    _id,
    name,
    review,
    rating,
    featured,
    "avatar": avatar.asset->url
  }`;
  return await client.fetch(query);
}

// ── FAQs ──────────────────────────────────────────────────────────────────────
export async function fetchFaqs() {
  const query = `*[_type == "faq"] | order(order asc) {
    _id,
    question,
    answer,
    category
  }`;
  return await client.fetch(query);
}

// ── Site Settings ─────────────────────────────────────────────────────────────
export async function fetchSettings() {
  const query = `*[_type == "settings"][0] {
    siteName,
    tagline,
    "logo": logo.asset->url,
    contact,
    social,
    footerText,
    footerAbout,
    seo,
    announcementBar
  }`;
  return await client.fetch(query);
}
