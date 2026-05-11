export const faq = {
  name: 'faq',
  title: 'FAQ Category',
  type: 'document',
  fields: [
    {
      name: 'category',
      title: 'Category Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'items',
      title: 'Questions and Answers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'text',
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    },
  ],
}
