export const popupPromotion = {
  name: 'popupPromotion',
  title: 'Popup Promotion',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Promotion Title',
      type: 'string',
      description: 'Main title for the popup promotion',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text content for the popup',
    },
    {
      name: 'image',
      title: 'Popup Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Image to display in the popup',
    },
    {
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'Text for the action button',
      initialValue: 'Learn More',
    },
    {
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
      description: 'URL or path for the button link',
    },
    {
      name: 'displayOnPages',
      title: 'Display on Pages',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of page names where this popup should appear (e.g., home, shop, product-details)',
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Enable or disable this popup promotion',
      initialValue: true,
    },
    {
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      description: 'When the promotion should start showing',
    },
    {
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      description: 'When the promotion should stop showing',
    },
  ],
  preview: {
    select: {
      title: 'title',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, isActive } = selection;
      return {
        title,
        subtitle: isActive ? 'Active' : 'Inactive',
      };
    },
  },
};