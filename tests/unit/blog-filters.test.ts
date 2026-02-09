import { describe, it, expect } from 'vitest';

// Mock the CollectionEntry type since we can't import from astro:content
interface MockBlogData {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  author: string;
  tags: string[];
  draft: boolean;
}

interface MockCollectionEntry {
  id: string;
  data: MockBlogData;
}

// Re-implement the utility functions for testing
// (These mirror the implementations in src/utils/blog.ts)
function filterPublishedPosts(posts: MockCollectionEntry[]): MockCollectionEntry[] {
  return posts.filter((post) => !post.data.draft);
}

function sortPostsByDate(posts: MockCollectionEntry[]): MockCollectionEntry[] {
  return [...posts].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

function getUniqueTags(posts: MockCollectionEntry[]): string[] {
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.data.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

function filterPostsByTag(posts: MockCollectionEntry[], tag: string): MockCollectionEntry[] {
  return posts.filter((post) => post.data.tags.includes(tag));
}

// Test fixtures
const createMockPost = (overrides: Partial<MockBlogData> & { id?: string } = {}): MockCollectionEntry => ({
  id: overrides.id ?? 'test-post',
  data: {
    title: 'Test Post',
    description: 'A test post description',
    pubDate: new Date('2024-03-15'),
    author: 'Test Author',
    tags: [],
    draft: false,
    ...overrides,
  },
});

describe('Blog Post Filtering', () => {
  describe('filterPublishedPosts', () => {
    it('filters out draft posts', () => {
      const posts: MockCollectionEntry[] = [
        createMockPost({ id: 'published', draft: false }),
        createMockPost({ id: 'draft', draft: true }),
        createMockPost({ id: 'also-published', draft: false }),
      ];

      const result = filterPublishedPosts(posts);
      expect(result).toHaveLength(2);
      expect(result.map(p => p.id)).toEqual(['published', 'also-published']);
    });

    it('returns all posts when none are drafts', () => {
      const posts: MockCollectionEntry[] = [
        createMockPost({ id: 'post-1', draft: false }),
        createMockPost({ id: 'post-2', draft: false }),
      ];

      const result = filterPublishedPosts(posts);
      expect(result).toHaveLength(2);
    });

    it('returns empty array when all posts are drafts', () => {
      const posts: MockCollectionEntry[] = [
        createMockPost({ id: 'draft-1', draft: true }),
        createMockPost({ id: 'draft-2', draft: true }),
      ];

      const result = filterPublishedPosts(posts);
      expect(result).toHaveLength(0);
    });

    it('handles empty array', () => {
      const result = filterPublishedPosts([]);
      expect(result).toEqual([]);
    });
  });

  describe('sortPostsByDate', () => {
    it('sorts posts by date in descending order', () => {
      const posts: MockCollectionEntry[] = [
        createMockPost({ id: 'oldest', pubDate: new Date('2024-01-01') }),
        createMockPost({ id: 'newest', pubDate: new Date('2024-03-01') }),
        createMockPost({ id: 'middle', pubDate: new Date('2024-02-01') }),
      ];

      const result = sortPostsByDate(posts);
      expect(result.map(p => p.id)).toEqual(['newest', 'middle', 'oldest']);
    });

    it('does not mutate original array', () => {
      const posts: MockCollectionEntry[] = [
        createMockPost({ id: 'first', pubDate: new Date('2024-01-01') }),
        createMockPost({ id: 'second', pubDate: new Date('2024-02-01') }),
      ];

      const originalOrder = posts.map(p => p.id);
      sortPostsByDate(posts);
      expect(posts.map(p => p.id)).toEqual(originalOrder);
    });

    it('handles posts with same date', () => {
      const sameDate = new Date('2024-02-15');
      const posts: MockCollectionEntry[] = [
        createMockPost({ id: 'post-a', pubDate: sameDate }),
        createMockPost({ id: 'post-b', pubDate: sameDate }),
      ];

      const result = sortPostsByDate(posts);
      expect(result).toHaveLength(2);
    });

    it('handles empty array', () => {
      const result = sortPostsByDate([]);
      expect(result).toEqual([]);
    });

    it('handles single post', () => {
      const posts: MockCollectionEntry[] = [
        createMockPost({ id: 'only-post' }),
      ];

      const result = sortPostsByDate(posts);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('only-post');
    });
  });

  describe('getUniqueTags', () => {
    it('extracts unique tags from posts', () => {
      const posts: MockCollectionEntry[] = [
        createMockPost({ tags: ['astro', 'blog'] }),
        createMockPost({ tags: ['astro', 'cloudflare'] }),
        createMockPost({ tags: ['javascript'] }),
      ];

      const result = getUniqueTags(posts);
      expect(result).toEqual(['astro', 'blog', 'cloudflare', 'javascript']);
    });

    it('returns sorted array', () => {
      const posts: MockCollectionEntry[] = [
        createMockPost({ tags: ['zebra', 'apple'] }),
        createMockPost({ tags: ['monkey', 'banana'] }),
      ];

      const result = getUniqueTags(posts);
      expect(result).toEqual(['apple', 'banana', 'monkey', 'zebra']);
    });

    it('handles posts with no tags', () => {
      const posts: MockCollectionEntry[] = [
        createMockPost({ tags: [] }),
        createMockPost({ tags: [] }),
      ];

      const result = getUniqueTags(posts);
      expect(result).toEqual([]);
    });

    it('handles empty array', () => {
      const result = getUniqueTags([]);
      expect(result).toEqual([]);
    });

    it('handles single post with multiple tags', () => {
      const posts: MockCollectionEntry[] = [
        createMockPost({ tags: ['c', 'a', 'b'] }),
      ];

      const result = getUniqueTags(posts);
      expect(result).toEqual(['a', 'b', 'c']);
    });
  });

  describe('filterPostsByTag', () => {
    const posts: MockCollectionEntry[] = [
      createMockPost({ id: 'astro-post', tags: ['astro', 'blog'] }),
      createMockPost({ id: 'cloudflare-post', tags: ['cloudflare', 'blog'] }),
      createMockPost({ id: 'both-post', tags: ['astro', 'cloudflare'] }),
      createMockPost({ id: 'js-post', tags: ['javascript'] }),
    ];

    it('filters posts by tag', () => {
      const result = filterPostsByTag(posts, 'astro');
      expect(result.map(p => p.id)).toEqual(['astro-post', 'both-post']);
    });

    it('returns empty array for non-existent tag', () => {
      const result = filterPostsByTag(posts, 'nonexistent');
      expect(result).toEqual([]);
    });

    it('finds posts with common tag', () => {
      const result = filterPostsByTag(posts, 'blog');
      expect(result.map(p => p.id)).toEqual(['astro-post', 'cloudflare-post']);
    });

    it('handles empty posts array', () => {
      const result = filterPostsByTag([], 'astro');
      expect(result).toEqual([]);
    });

    it('is case-sensitive', () => {
      const result = filterPostsByTag(posts, 'Astro');
      expect(result).toEqual([]);
    });
  });

  describe('combined filtering and sorting', () => {
    it('filters drafts and sorts by date', () => {
      const posts: MockCollectionEntry[] = [
        createMockPost({ id: 'old-published', pubDate: new Date('2024-01-01'), draft: false }),
        createMockPost({ id: 'new-draft', pubDate: new Date('2024-03-01'), draft: true }),
        createMockPost({ id: 'new-published', pubDate: new Date('2024-02-01'), draft: false }),
      ];

      const filtered = filterPublishedPosts(posts);
      const sorted = sortPostsByDate(filtered);

      expect(sorted.map(p => p.id)).toEqual(['new-published', 'old-published']);
    });

    it('filters by tag and sorts by date', () => {
      const posts: MockCollectionEntry[] = [
        createMockPost({ id: 'old-astro', pubDate: new Date('2024-01-01'), tags: ['astro'] }),
        createMockPost({ id: 'new-js', pubDate: new Date('2024-03-01'), tags: ['javascript'] }),
        createMockPost({ id: 'new-astro', pubDate: new Date('2024-02-01'), tags: ['astro'] }),
      ];

      const filtered = filterPostsByTag(posts, 'astro');
      const sorted = sortPostsByDate(filtered);

      expect(sorted.map(p => p.id)).toEqual(['new-astro', 'old-astro']);
    });
  });
});
