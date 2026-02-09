import { z } from 'astro:content';

/**
 * Zod schema for blog post frontmatter validation.
 * This schema is used by Astro's content collections.
 */
export const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  author: z.string().default('Anonymous'),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export type BlogPost = z.infer<typeof blogSchema>;
