export const product = {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    // ── Basic Info ──────────────────────────────────────────
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(120),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
    },

    // ── Pricing & Stock ──────────────────────────────────────
    {
      name: 'price',
      title: 'Price (BDT ৳)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    },
    {
      name: 'originalPrice',
      title: 'Original Price (BDT ৳) — before discount',
      type: 'number',
      description: 'Set this if the product is on sale',
    },
    {
      name: 'stock',
      title: 'Stock Quantity',
      type: 'number',
      initialValue: 50,
      validation: (Rule) => Rule.required().integer().min(0),
    },

    // ── Category & Gender ────────────────────────────────────
    {
      name: 'category',
      title: 'Main Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
      description: 'e.g. Men, Women, Kids, Hoodie, Shoes',
    },
    {
      name: 'subcategory',
      title: 'Subcategory',
      type: 'string',
      description: 'e.g. T-Shirt, Polo T-Shirt, Cargo Pants, Sneakers, Kurti & Tops',
      options: {
        list: [
          // Men subcategories
          { title: 'T-Shirt (Men)', value: 'T-Shirt' },
          { title: 'Polo T-Shirt', value: 'Polo T-Shirt' },
          { title: 'Sweatshirt', value: 'Sweatshirt' },
          { title: 'Jacket', value: 'Jacket' },
          { title: 'Cargo Pants', value: 'Cargo Pants' },
          { title: 'Joggers', value: 'Joggers' },
          { title: 'Shorts (Men)', value: 'Shorts' },
          // Women subcategories
          { title: 'Kurti & Tops', value: 'Kurti & Tops' },
          { title: 'T-Shirt (Women)', value: 'T-Shirt Women' },
          { title: 'Co-ords Set', value: 'Co-ords Set' },
          { title: 'Leggings', value: 'Leggings' },
          { title: 'Palazzo', value: 'Palazzo' },
          { title: 'Comfy Trouser', value: 'Comfy Trouser' },
          { title: 'Hijab', value: 'Hijab' },
          { title: 'Bag', value: 'Bag' },
          // Kids subcategories
          { title: 'Boys T-Shirt', value: 'Boys T-Shirt' },
          { title: 'Girls Frock', value: 'Girls Frock' },
          { title: 'Boys Shorts', value: 'Boys Shorts' },
          { title: 'Girls Shorts', value: 'Girls Shorts' },
          { title: 'Panjabi', value: 'Panjabi' },
          { title: 'Hoodie (Kids)', value: 'Hoodie Kids' },
          // Hoodie subcategories
          { title: 'Oversized Hoodie', value: 'Oversized Hoodie' },
          { title: 'Zip-Up Hoodie', value: 'Zip-Up Hoodie' },
          { title: 'Pullover Hoodie', value: 'Pullover Hoodie' },
          { title: 'Couple Hoodie', value: 'Couple Hoodie' },
          { title: 'Graphic Hoodie', value: 'Graphic Hoodie' },
          // Shoes subcategories
          { title: 'Sneakers', value: 'Sneakers' },
          { title: 'Loafers', value: 'Loafers' },
          { title: 'Formal Shoes', value: 'Formal Shoes' },
          { title: 'Sports Shoes', value: 'Sports Shoes' },
          { title: 'Sandals', value: 'Sandals' },
          { title: 'Heels', value: 'Heels' },
          { title: 'Flats', value: 'Flats' },
        ],
      },
    },
    {
      name: 'gender',
      title: 'Gender',
      type: 'string',
      options: {
        list: [
          { title: '👨 Men', value: 'men' },
          { title: '👩 Women', value: 'women' },
          { title: '🧒 Unisex', value: 'unisex' },
          { title: '👦 Kids', value: 'kids' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    },

    // ── Sizes ────────────────────────────────────────────────
    {
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'XS', value: 'XS' },
          { title: 'S', value: 'S' },
          { title: 'M', value: 'M' },
          { title: 'L', value: 'L' },
          { title: 'XL', value: 'XL' },
          { title: 'XXL', value: 'XXL' },
          { title: '3XL', value: '3XL' },
          { title: '38', value: '38' },
          { title: '39', value: '39' },
          { title: '40', value: '40' },
          { title: '41', value: '41' },
          { title: '42', value: '42' },
          { title: '43', value: '43' },
          { title: '44', value: '44' },
        ],
      },
    },

    // ── Colors ───────────────────────────────────────────────
    {
      name: 'colors',
      title: 'Available Colors',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Color Name',
              type: 'string',
              description: 'e.g. Black, Navy Blue, Off White',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'hex',
              title: 'Hex Code',
              type: 'string',
              description: 'e.g. #000000',
            },
          ],
          preview: {
            select: { title: 'name', subtitle: 'hex' },
          },
        },
      ],
    },

    // ── Images ───────────────────────────────────────────────
    {
      name: 'mainImage',
      title: 'Main Product Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'images',
      title: 'Additional Images (Gallery)',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
      options: { layout: 'grid' },
    },

    // ── Flags ────────────────────────────────────────────────
    {
      name: 'featured',
      title: '⭐ Featured Product',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'newArrival',
      title: '🆕 New Arrival',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'onSale',
      title: '🔥 On Sale',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'topSelling',
      title: '📈 Top Selling',
      type: 'boolean',
      initialValue: false,
      description: 'Mark as a best-seller / top selling product',
    },
    {
      name: 'freeDelivery',
      title: '🚚 Free Delivery',
      type: 'boolean',
      initialValue: false,
      description: 'This product ships for free',
    },
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'gender',
      media: 'mainImage',
      price: 'price',
    },
    prepare({ title, subtitle, media, price }) {
      return {
        title,
        subtitle: `${subtitle ? subtitle.toUpperCase() : ''} — ৳${price || 0}`,
        media,
      }
    },
  },
}
