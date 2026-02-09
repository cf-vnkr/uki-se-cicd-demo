import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Since we can't import from 'astro:content' in tests, we recreate the schema here
// This mirrors the schema defined in src/schemas/blog.ts
const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  author: z.string().default('Anonymous'),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

type BlogPost = z.infer<typeof blogSchema>;

describe('Blog Post Schema', () => {
  describe('required fields', () => {
    it('validates a post with all required fields', () => {
      const validPost = {
        title: 'Hello World',
        description: 'My first blog post',
        pubDate: '2024-03-15',
      };
      const result = blogSchema.safeParse(validPost);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Hello World');
        expect(result.data.description).toBe('My first blog post');
        expect(result.data.pubDate).toBeInstanceOf(Date);
      }
    });

    it('rejects post without title', () => {
      const invalidPost = {
        description: 'My first blog post',
        pubDate: '2024-03-15',
      };
      const result = blogSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });

    it('rejects post without description', () => {
      const invalidPost = {
        title: 'Hello World',
        pubDate: '2024-03-15',
      };
      const result = blogSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });

    it('rejects post without pubDate', () => {
      const invalidPost = {
        title: 'Hello World',
        description: 'My first blog post',
      };
      const result = blogSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });
  });

  describe('date coercion', () => {
    it('coerces string date to Date object', () => {
      const post = {
        title: 'Test',
        description: 'Test',
        pubDate: '2024-03-15',
      };
      const result = blogSchema.parse(post);
      expect(result.pubDate).toBeInstanceOf(Date);
      expect(result.pubDate.getFullYear()).toBe(2024);
      expect(result.pubDate.getMonth()).toBe(2); // March (0-indexed)
      expect(result.pubDate.getDate()).toBe(15);
    });

    it('accepts Date object directly', () => {
      const post = {
        title: 'Test',
        description: 'Test',
        pubDate: new Date('2024-03-15'),
      };
      const result = blogSchema.parse(post);
      expect(result.pubDate).toBeInstanceOf(Date);
    });

    it('coerces ISO date strings', () => {
      const post = {
        title: 'Test',
        description: 'Test',
        pubDate: '2024-03-15T10:30:00Z',
      };
      const result = blogSchema.parse(post);
      expect(result.pubDate).toBeInstanceOf(Date);
    });

    it('handles updatedDate as optional', () => {
      const postWithUpdated = {
        title: 'Test',
        description: 'Test',
        pubDate: '2024-03-15',
        updatedDate: '2024-03-20',
      };
      const result = blogSchema.parse(postWithUpdated);
      expect(result.updatedDate).toBeInstanceOf(Date);
    });

    it('allows missing updatedDate', () => {
      const postWithoutUpdated = {
        title: 'Test',
        description: 'Test',
        pubDate: '2024-03-15',
      };
      const result = blogSchema.parse(postWithoutUpdated);
      expect(result.updatedDate).toBeUndefined();
    });
  });

  describe('default values', () => {
    it('defaults author to Anonymous', () => {
      const post = {
        title: 'Test',
        description: 'Test',
        pubDate: '2024-03-15',
      };
      const result = blogSchema.parse(post);
      expect(result.author).toBe('Anonymous');
    });

    it('defaults tags to empty array', () => {
      const post = {
        title: 'Test',
        description: 'Test',
        pubDate: '2024-03-15',
      };
      const result = blogSchema.parse(post);
      expect(result.tags).toEqual([]);
    });

    it('defaults draft to false', () => {
      const post = {
        title: 'Test',
        description: 'Test',
        pubDate: '2024-03-15',
      };
      const result = blogSchema.parse(post);
      expect(result.draft).toBe(false);
    });
  });

  describe('optional fields with values', () => {
    it('accepts custom author', () => {
      const post = {
        title: 'Test',
        description: 'Test',
        pubDate: '2024-03-15',
        author: 'John Doe',
      };
      const result = blogSchema.parse(post);
      expect(result.author).toBe('John Doe');
    });

    it('accepts tags array', () => {
      const post = {
        title: 'Test',
        description: 'Test',
        pubDate: '2024-03-15',
        tags: ['astro', 'blog', 'cloudflare'],
      };
      const result = blogSchema.parse(post);
      expect(result.tags).toEqual(['astro', 'blog', 'cloudflare']);
    });

    it('accepts draft flag as true', () => {
      const post = {
        title: 'Test',
        description: 'Test',
        pubDate: '2024-03-15',
        draft: true,
      };
      const result = blogSchema.parse(post);
      expect(result.draft).toBe(true);
    });
  });

  describe('type validation', () => {
    it('rejects non-string title', () => {
      const post = {
        title: 123,
        description: 'Test',
        pubDate: '2024-03-15',
      };
      const result = blogSchema.safeParse(post);
      expect(result.success).toBe(false);
    });

    it('rejects non-array tags', () => {
      const post = {
        title: 'Test',
        description: 'Test',
        pubDate: '2024-03-15',
        tags: 'single-tag',
      };
      const result = blogSchema.safeParse(post);
      expect(result.success).toBe(false);
    });

    it('rejects non-string tags in array', () => {
      const post = {
        title: 'Test',
        description: 'Test',
        pubDate: '2024-03-15',
        tags: ['valid', 123, 'also-valid'],
      };
      const result = blogSchema.safeParse(post);
      expect(result.success).toBe(false);
    });

    it('rejects non-boolean draft', () => {
      const post = {
        title: 'Test',
        description: 'Test',
        pubDate: '2024-03-15',
        draft: 'yes',
      };
      const result = blogSchema.safeParse(post);
      expect(result.success).toBe(false);
    });

    it('rejects invalid date format', () => {
      const post = {
        title: 'Test',
        description: 'Test',
        pubDate: 'not-a-date',
      };
      const result = blogSchema.safeParse(post);
      expect(result.success).toBe(false);
    });
  });

  describe('complete blog post', () => {
    it('validates a complete blog post with all fields', () => {
      const completePost = {
        title: 'Getting Started with Astro',
        description: 'Learn how to build fast websites with Astro',
        pubDate: '2024-03-15',
        updatedDate: '2024-03-20',
        author: 'Jane Doe',
        tags: ['astro', 'tutorial', 'web-development'],
        draft: false,
      };
      const result = blogSchema.safeParse(completePost);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toMatchObject({
          title: 'Getting Started with Astro',
          description: 'Learn how to build fast websites with Astro',
          author: 'Jane Doe',
          tags: ['astro', 'tutorial', 'web-development'],
          draft: false,
        });
        expect(result.data.pubDate).toBeInstanceOf(Date);
        expect(result.data.updatedDate).toBeInstanceOf(Date);
      }
    });
  });
});
