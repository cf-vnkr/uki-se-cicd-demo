import { describe, it, expect } from 'vitest';
import {
  formatPostDate,
  formatPostDateLong,
  getPostUrl,
  calculateReadingTime,
  slugify,
} from '../../src/utils/blog';

describe('Blog Utility Functions', () => {
  describe('formatPostDate', () => {
    it('formats date in short format', () => {
      const date = new Date('2024-03-15');
      const formatted = formatPostDate(date);
      expect(formatted).toBe('Mar 15, 2024');
    });

    it('handles different months correctly', () => {
      const january = new Date('2024-01-01');
      const december = new Date('2024-12-31');
      expect(formatPostDate(january)).toBe('Jan 1, 2024');
      expect(formatPostDate(december)).toBe('Dec 31, 2024');
    });

    it('handles leap year dates', () => {
      const leapDay = new Date('2024-02-29');
      expect(formatPostDate(leapDay)).toBe('Feb 29, 2024');
    });
  });

  describe('formatPostDateLong', () => {
    it('formats date in long format', () => {
      const date = new Date('2024-03-15');
      const formatted = formatPostDateLong(date);
      expect(formatted).toBe('March 15, 2024');
    });

    it('displays full month names', () => {
      const september = new Date('2024-09-20');
      expect(formatPostDateLong(september)).toBe('September 20, 2024');
    });
  });

  describe('getPostUrl', () => {
    it('generates correct URL for a post', () => {
      expect(getPostUrl('hello-world')).toBe('/blog/hello-world');
    });

    it('handles posts with nested paths', () => {
      expect(getPostUrl('2024/my-post')).toBe('/blog/2024/my-post');
    });

    it('handles empty string', () => {
      expect(getPostUrl('')).toBe('/blog/');
    });
  });

  describe('calculateReadingTime', () => {
    it('calculates reading time for short content', () => {
      const shortContent = 'This is a short post.'; // 5 words
      expect(calculateReadingTime(shortContent)).toBe(1);
    });

    it('calculates reading time for longer content', () => {
      // 200 words = 1 minute, 400 words = 2 minutes
      const words = Array(400).fill('word').join(' ');
      expect(calculateReadingTime(words)).toBe(2);
    });

    it('rounds up reading time', () => {
      // 201 words should round up to 2 minutes
      const words = Array(201).fill('word').join(' ');
      expect(calculateReadingTime(words)).toBe(2);
    });

    it('handles empty content', () => {
      expect(calculateReadingTime('')).toBe(1);
    });

    it('handles content with multiple spaces', () => {
      const content = 'word   word   word'; // 3 words with extra spaces
      expect(calculateReadingTime(content)).toBe(1);
    });
  });

  describe('slugify', () => {
    it('converts text to lowercase', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('replaces spaces with hyphens', () => {
      expect(slugify('my blog post')).toBe('my-blog-post');
    });

    it('removes special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
    });

    it('handles multiple consecutive spaces', () => {
      expect(slugify('hello   world')).toBe('hello-world');
    });

    it('trims leading and trailing whitespace', () => {
      expect(slugify('  hello world  ')).toBe('hello-world');
    });

    it('removes leading and trailing hyphens', () => {
      expect(slugify('---hello-world---')).toBe('hello-world');
    });

    it('handles underscores', () => {
      expect(slugify('hello_world')).toBe('hello-world');
    });

    it('handles mixed special characters', () => {
      expect(slugify("What's New in Astro 5.0?")).toBe('whats-new-in-astro-50');
    });

    it('handles empty string', () => {
      expect(slugify('')).toBe('');
    });

    it('handles string with only special characters', () => {
      expect(slugify('!@#$%')).toBe('');
    });
  });
});
