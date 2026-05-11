export const post = {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    // ── Basic Info ───────────────────────────────────────────
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt / Summary',
      type: 'text',
      rows: 3,
      description: 'Short description shown on blog listing cards',
      validation: (Rule) => Rule.required().max(300),
    },

    // ── Meta ─────────────────────────────────────────────────
    {
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'Velix Team',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Blog Category',
      type: 'string',
      options: {
        list: [
          { title: 'Style Guide', value: 'style-guide' },
          { title: 'Fashion Tips', value: 'fashion-tips' },
          { title: 'New Arrivals', value: 'new-arrivals' },
          { title: 'Behind the Brand', value: 'behind-the-brand' },
          { title: 'Care & Maintenance', value: 'care' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'readTime',
      title: 'Read Time',
      type: 'string',
      description: 'e.g. "5 min read"',
      initialValue: '3 min read',
    },

    // ── Thumbnail ────────────────────────────────────────────
    {
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },

    // ── Content (Rich Text) ──────────────────────────────────
    {
      name: 'content',
      title: 'Blog Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'url', title: 'URL' },
                  { name: 'blank', type: 'boolean', title: 'Open in new tab', initialValue: true },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'caption', type: 'string', title: 'Caption' },
            { name: 'alt', type: 'string', title: 'Alt text' },
          ],
        },
      ],
    },

    // ── Flags ────────────────────────────────────────────────
    {
      name: 'featured',
      title: '⭐ Featured Post',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'author',
      media: 'thumbnail',
    },
  },
}
