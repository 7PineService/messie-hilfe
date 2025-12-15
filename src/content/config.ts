import { defineCollection, z } from 'astro:content';

const howItWorksSchema = z.object({
  title: z.string(),
  sections: z.array(z.object({
    imagePosition: z.enum(['left', 'right']),
    background: z.string().optional(),
    paragraphs: z.array(z.string()),
  })),
});

const simpleContentSchema = z.object({
  title: z.string(),
  content: z.string(),
});

const serviceDetailsSchema = z.object({
  title: z.string(),
  columns: z.array(z.object({
    paragraphs: z.array(z.string()),
  })),
});

const careSupportSchema = z.object({
  title: z.string(),
  imagePosition: z.enum(['left', 'right']),
  paragraphs: z.array(z.string()),
});

const onlineInquirySchema = z.object({
  title: z.string(),
  content: z.string(),
  buttonText: z.string(),
});

export const collections = {
  'how-it-works': defineCollection({
    type: 'content',
    schema: howItWorksSchema,
  }),
  'cost-responsibility': defineCollection({
    type: 'content',
    schema: simpleContentSchema,
  }),
  'service-details': defineCollection({
    type: 'content',
    schema: serviceDetailsSchema,
  }),
  'care-support': defineCollection({
    type: 'content',
    schema: careSupportSchema,
  }),
  'online-inquiry': defineCollection({
    type: 'content',
    schema: onlineInquirySchema,
  }),
};
