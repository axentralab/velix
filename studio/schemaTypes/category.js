export const category = {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Category Name',
      type: 'string',
      description: 'e.g. Men, Women, Kids, Hoodie, Shoes',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'parentCategory',
      title: 'Parent Category (optional)',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Select a parent if this is a subcategory (e.g. T-Shirt under Men)',
    },
    {
      name: 'gender',
      title: 'Gender Filter',
      type: 'string',
      description: 'Which gender section does this category appear under?',
      options: {
        list: [
          { title: '👨 Men', value: 'men' },
          { title: '👩 Women', value: 'women' },
          { title: '🧒 Unisex / All', value: 'unisex' },
          { title: '👦 Kids', value: 'kids' },
        ],
        layout: 'radio',
      },
    },
    {
      name: 'image',
      title: 'Category Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'description',
      title: 'Short Description',
      type: 'string',
      description: 'Optional tagline shown on the category card',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower number = shown first',
      initialValue: 10,
    },
    {
      name: 'featured',
      title: '⭐ Show on Homepage',
      type: 'boolean',
      initialValue: true,
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
      title: 'name',
      subtitle: 'gender',
      media: 'image',
      parent: 'parentCategory.name',
    },
    prepare({ title, subtitle, media, parent }) {
      const genderMap = { men: '👨', women: '👩', unisex: '🧒', kids: '👦' }
      return {
        title: parent ? `↳ ${title}` : title,
        subtitle: parent
          ? `Subcategory of: ${parent}`
          : subtitle
            ? `${genderMap[subtitle] || ''} ${subtitle}`
            : 'All Genders',
        media,
      }
    },
  },
}
