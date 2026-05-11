export const settings = {
  name: 'settings',
  title: '⚙️ Site Settings',
  type: 'document',

  // Only ONE settings document should exist
  __experimental_actions: ['update', 'publish', 'discardChanges'],

  fields: [
    // ── Branding ─────────────────────────────────────────────
    {
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'Veloura',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short brand tagline shown in meta descriptions',
      initialValue: 'Premium Fashion for Everyone',
    },
    {
      name: 'logo',
      title: 'Logo (Light)',
      type: 'image',
      description: 'Used on light backgrounds',
      options: { hotspot: true },
    },
    {
      name: 'logoDark',
      title: 'Logo (Dark)',
      type: 'image',
      description: 'Used on dark backgrounds',
      options: { hotspot: true },
    },
    {
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Square icon (32x32 or 64x64 recommended)',
    },

    // ── Contact Info ─────────────────────────────────────────
    {
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'email',
          title: 'Email Address',
          type: 'string',
          description: 'e.g. hello@veloura.com',
        },
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          description: 'e.g. +880 1700-000000',
        },
        {
          name: 'whatsapp',
          title: 'WhatsApp Number',
          type: 'string',
          description: 'With country code, e.g. +8801700000000',
        },
        {
          name: 'address',
          title: 'Physical Address',
          type: 'text',
          rows: 2,
          description: 'e.g. 123 Fashion Street, Dhaka 1200, Bangladesh',
        },
      ],
    },

    // ── Social Links ─────────────────────────────────────────
    {
      name: 'social',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        {
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
          description: 'e.g. https://facebook.com/veloura',
        },
        {
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
        },
        {
          name: 'tiktok',
          title: 'TikTok URL',
          type: 'url',
        },
        {
          name: 'youtube',
          title: 'YouTube URL',
          type: 'url',
        },
        {
          name: 'twitter',
          title: 'Twitter / X URL',
          type: 'url',
        },
        {
          name: 'pinterest',
          title: 'Pinterest URL',
          type: 'url',
        },
      ],
    },

    // ── Footer ───────────────────────────────────────────────
    {
      name: 'footerText',
      title: 'Footer Copyright Text',
      type: 'string',
      initialValue: '© 2025 Veloura. All rights reserved.',
    },
    {
      name: 'footerAbout',
      title: 'Footer About Text',
      type: 'text',
      rows: 3,
      description: 'Short brand description shown in footer',
    },

    // ── SEO ──────────────────────────────────────────────────
    {
      name: 'seo',
      title: 'Default SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Default Meta Title',
          type: 'string',
          description: 'Used when no page-specific title is set',
        },
        {
          name: 'metaDescription',
          title: 'Default Meta Description',
          type: 'text',
          rows: 2,
        },
        {
          name: 'ogImage',
          title: 'Default OG Image',
          type: 'image',
          description: 'Shown when sharing on social media (1200x630px recommended)',
          options: { hotspot: true },
        },
      ],
    },

    // ── Announcement Bar ─────────────────────────────────────
    {
      name: 'announcementBar',
      title: 'Announcement Bar',
      type: 'object',
      fields: [
        {
          name: 'active',
          title: 'Show Announcement Bar',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'text',
          title: 'Announcement Text',
          type: 'string',
          description: 'e.g. "🎉 Free delivery on orders above ৳1500!"',
        },
        {
          name: 'link',
          title: 'Link (optional)',
          type: 'string',
          description: 'e.g. /shop',
        },
        {
          name: 'bgColor',
          title: 'Background Color',
          type: 'string',
          description: 'Hex color, e.g. #1a1a1a',
          initialValue: '#1a1a1a',
        },
        {
          name: 'textColor',
          title: 'Text Color',
          type: 'string',
          initialValue: '#ffffff',
        },
      ],
    },
  ],

  preview: {
    select: {
      title: 'siteName',
      subtitle: 'tagline',
      media: 'logo',
    },
  },
}
