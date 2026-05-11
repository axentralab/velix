export const product = {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(100),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'T-Shirts', value: 'T-Shirts' },
          { title: 'Hoodies', value: 'Hoodies' },
          { title: 'Sweatshirts', value: 'Sweatshirts' },
          { title: 'Bottoms', value: 'Bottoms' },
          { title: 'Accessories', value: 'Accessories' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Price ($)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    },
    {
      name: 'stock',
      title: 'Stock',
      type: 'number',
      initialValue: 100,
      validation: (Rule) => Rule.required().integer().min(0),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    },
    {
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'newArrival',
      title: 'New Arrival',
      type: 'boolean',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: `${subtitle || 'Uncategorized'}`,
        media,
      }
    },
  },
}
