export const banner = {
  name: 'banner',
  title: 'Hero Banner',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Banner Title',
      type: 'string',
      description: 'Main heading shown on the hero section',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Smaller text below the main heading',
    },
    {
      name: 'offerText',
      title: 'Offer Text / Badge',
      type: 'string',
      description: 'e.g. "Up to 50% OFF" or "New Arrivals 2025"',
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'mobileImage',
      title: 'Mobile Image (optional)',
      type: 'image',
      options: { hotspot: true },
      description: 'Separate image optimized for mobile screens',
    },
    {
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'e.g. "Shop Now" or "Explore Collection"',
      initialValue: 'Shop Now',
    },
    {
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
      description: 'e.g. /shop or /collections/men',
      initialValue: '/shop',
    },
    {
      name: 'secondaryButtonText',
      title: 'Secondary Button Text (optional)',
      type: 'string',
      description: 'e.g. "View Lookbook"',
    },
    {
      name: 'secondaryButtonLink',
      title: 'Secondary Button Link (optional)',
      type: 'string',
    },
    {
      name: 'bgColor',
      title: 'Background Color (optional)',
      type: 'string',
      description: 'Hex color code, e.g. #F5F5F5. Used if no image or as overlay tint.',
    },
    {
      name: 'active',
      title: '✅ Active (Show this banner)',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower = shown first in slider',
      initialValue: 1,
    },
  ],

  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'offerText',
      media: 'heroImage',
      active: 'active',
    },
    prepare({ title, subtitle, media, active }) {
      return {
        title: `${active ? '🟢' : '🔴'} ${title}`,
        subtitle: subtitle || 'No offer text',
        media,
      }
    },
  },
}
