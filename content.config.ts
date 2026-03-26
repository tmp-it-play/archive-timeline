import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    mcq: defineCollection({
      type: 'data',
      source: 'mcq/**/*.md',
      schema: z.object({
        id: z.string(),
        title: z.string(),
        difficulty: z.enum(['junior', 'mid', 'senior']),
        category: z.string(),
        type: z.literal('mcq'),
        options: z.array(z.object({
          text: z.string(),
          correct: z.boolean(),
        })),
      }),
    }),
    concept: defineCollection({
      type: 'data',
      source: 'concept/**/*.md',
      schema: z.object({
        id: z.string(),
        title: z.string(),
        difficulty: z.enum(['junior', 'mid', 'senior']),
        category: z.string(),
        type: z.literal('concept'),
      }),
    }),
  },
})
