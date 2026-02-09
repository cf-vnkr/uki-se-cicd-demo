import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const projectRoot = process.cwd();
const distDir = join(projectRoot, 'dist');

describe('Astro Build Integration Tests', () => {
  beforeAll(() => {
    // Build the project before running tests
    execSync('npm run build', { cwd: projectRoot, stdio: 'pipe' });
  }, 60000); // 60 second timeout for build

  describe('Build Output', () => {
    it('creates dist directory', () => {
      expect(existsSync(distDir)).toBe(true);
    });

    it('generates index.html', () => {
      const indexPath = join(distDir, 'index.html');
      expect(existsSync(indexPath)).toBe(true);
    });

    it('generates blog post page', () => {
      const blogDir = join(distDir, 'blog');
      expect(existsSync(blogDir)).toBe(true);
      
      // Check that at least one blog post exists
      const blogFiles = readdirSync(blogDir, { recursive: true });
      expect(blogFiles.length).toBeGreaterThan(0);
    });
  });

  describe('Home Page Content', () => {
    let indexHtml: string;

    beforeAll(() => {
      indexHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');
    });

    it('contains blog title', () => {
      expect(indexHtml).toContain('Blog');
    });

    it('contains Cloudflare logo', () => {
      expect(indexHtml).toContain('cloudflare-logo.svg');
    });

    it('contains link to blog posts', () => {
      expect(indexHtml).toContain('/blog/');
    });

    it('contains post titles', () => {
      expect(indexHtml).toContain('Hello World');
    });

    it('contains post descriptions', () => {
      expect(indexHtml).toContain('Welcome to my new blog');
    });

    it('contains proper HTML structure', () => {
      expect(indexHtml).toContain('<!DOCTYPE html>');
      expect(indexHtml).toContain('<html');
      expect(indexHtml).toContain('</html>');
      expect(indexHtml).toContain('<head>');
      expect(indexHtml).toContain('</head>');
      // Astro adds data attributes to body, so we check for body with attributes
      expect(indexHtml).toMatch(/<body[^>]*>/);
      expect(indexHtml).toContain('</body>');
    });

    it('contains meta viewport tag', () => {
      expect(indexHtml).toContain('viewport');
      expect(indexHtml).toContain('width=device-width');
    });

    it('contains charset meta tag', () => {
      expect(indexHtml).toContain('charset');
      expect(indexHtml).toContain('UTF-8');
    });
  });

  describe('Blog Post Page Content', () => {
    let postHtml: string;

    beforeAll(() => {
      const postPath = join(distDir, 'blog', 'hello-world', 'index.html');
      if (existsSync(postPath)) {
        postHtml = readFileSync(postPath, 'utf-8');
      } else {
        // Try alternative path structure
        const altPath = join(distDir, 'blog', 'hello-world.html');
        if (existsSync(altPath)) {
          postHtml = readFileSync(altPath, 'utf-8');
        }
      }
    });

    it('contains post title', () => {
      expect(postHtml).toBeDefined();
      expect(postHtml).toContain('Hello World');
    });

    it('contains post content', () => {
      expect(postHtml).toContain('Welcome to My Blog');
    });

    it('contains author information', () => {
      expect(postHtml).toContain('Alex');
    });

    it('contains back link', () => {
      expect(postHtml).toContain('Back');
    });

    it('contains tags', () => {
      expect(postHtml).toContain('astro');
      expect(postHtml).toContain('cloudflare');
    });

    it('contains proper heading structure', () => {
      expect(postHtml).toContain('<h1');
      expect(postHtml).toContain('<h2');
    });

    it('contains formatted date', () => {
      // Check for date in various formats
      expect(postHtml).toMatch(/2026|February|Feb/);
    });
  });

  describe('Static Assets', () => {
    it('includes Cloudflare logo', () => {
      const logoPath = join(distDir, 'cloudflare-logo.svg');
      expect(existsSync(logoPath)).toBe(true);
    });

    it('Cloudflare logo is valid SVG', () => {
      const logoPath = join(distDir, 'cloudflare-logo.svg');
      const logoContent = readFileSync(logoPath, 'utf-8');
      expect(logoContent).toContain('<svg');
      expect(logoContent).toContain('</svg>');
    });
  });

  describe('SEO and Accessibility', () => {
    let indexHtml: string;

    beforeAll(() => {
      indexHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');
    });

    it('has title tag', () => {
      expect(indexHtml).toMatch(/<title>.*<\/title>/);
    });

    it('has lang attribute on html tag', () => {
      expect(indexHtml).toContain('lang="en"');
    });

    it('contains semantic HTML elements', () => {
      expect(indexHtml).toContain('<main');
      expect(indexHtml).toContain('<header');
    });
  });
});
