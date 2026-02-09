import type { CollectionEntry } from 'astro:content';

/**
 * Filters out draft posts from a collection.
 */
export function filterPublishedPosts(
  posts: CollectionEntry<'blog'>[]
): CollectionEntry<'blog'>[] {
  return posts.filter((post) => !post.data.draft);
}

/**
 * Sorts posts by publication date in descending order (newest first).
 */
export function sortPostsByDate(
  posts: CollectionEntry<'blog'>[]
): CollectionEntry<'blog'>[] {
  return [...posts].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

/**
 * Formats a date for display in the blog post list.
 */
export function formatPostDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a date for display on individual blog posts.
 */
export function formatPostDateLong(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Generates the URL path for a blog post.
 */
export function getPostUrl(postId: string): string {
  return `/blog/${postId}`;
}

/**
 * Extracts unique tags from a collection of posts.
 */
export function getUniqueTags(posts: CollectionEntry<'blog'>[]): string[] {
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.data.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Filters posts by a specific tag.
 */
export function filterPostsByTag(
  posts: CollectionEntry<'blog'>[],
  tag: string
): CollectionEntry<'blog'>[] {
  return posts.filter((post) => post.data.tags.includes(tag));
}

/**
 * Calculates reading time estimate for content.
 * Assumes average reading speed of 200 words per minute.
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Generates a slug from a string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
