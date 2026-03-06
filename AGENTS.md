# AGENTS.md - Assaf Sapir's Personal Website

## Project Overview
Vanilla JavaScript personal website built with native Web Components, deployed on Cloudflare Workers. Dark theme only. No frameworks, no build step.

## Architecture

### Web Components
All UI components extend `HTMLElement` and use `customElements.define()`. Pattern:
```javascript
class ComponentName extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = `<template>`;
  }
}
customElements.define("component-name", ComponentName);
```

### File Organization
- `public/` — All static assets served directly by Cloudflare Workers
- `public/js/components/` — Web Components (nav-header, hero-section, about-section, projects-section, skills-section, contact-section, footer-component, blog-page)
- `public/posts/` — Blog markdown files and `posts.json` manifest
- `public/blog/` — Blog HTML page
- `public/js/services/` — Service layer (github-api.js for GitHub API calls with 10-min localStorage cache)
- `public/js/main.js` — App initialization, smooth scrolling, keyboard navigation
- `public/styles/main.css` — CSS custom properties, base styles, accessibility
- `public/styles/components.css` — All component-specific styles
- `public/styles/responsive.css` — Breakpoints and media queries
- `wrangler.jsonc` — Cloudflare Workers deployment config

### CSS Architecture
- All component styles live in CSS files, not in JavaScript
- CSS custom properties defined in `:root` for theming (`--primary-dark`, `--text-secondary`, `--space-md`, etc.)
- Breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px), ultra-wide (>1400px)
- WCAG compliant colors with `prefers-contrast: high` and `prefers-reduced-motion: reduce` support

### GitHub API Integration
- `github-api.js` fetches repositories for the projects section
- 10-minute localStorage cache with error handling and rate limiting
- Maps repository languages to technology icons

## Blog System

### Content
- Blog posts are Markdown files in `public/posts/`
- Post metadata lives in `public/posts/posts.json` (title, date, description, tags, slug)
- No build step — markdown is parsed client-side using `marked` (loaded from CDN as ES module)

### Adding a New Post
1. Create `public/posts/<slug>.md` with the post content
2. Add an entry to `public/posts/posts.json`
3. Deploy

### Architecture
- `public/blog/index.html` — blog page (loads the blog-page component)
- `public/js/components/blog-page.js` — Web Component that handles listing and post rendering
- `public/styles/blog.css` — blog-specific styles
- URL scheme: `/blog/` for listing, `/blog/#<slug>` for individual posts (hash-based routing)
- `marked` loaded from `https://esm.sh/marked@15` — no npm dependency needed

## Build & Dev Commands
```bash
npx wrangler dev        # Local development server
npx wrangler deploy     # Deploy to Cloudflare Workers (requires wrangler login)
```

## Deployment
- Manual deployment via `wrangler deploy`
- Deployed to `sapir.io` and `www.sapir.io`
- SSL/TLS handled by Cloudflare

## Code Style
- No CSS frameworks — custom CSS with systematic custom properties
- No build tools or bundlers — files served as-is
- ES6 modules for component organization
- `rel="noopener noreferrer"` on all external links
- Semantic HTML with ARIA attributes for accessibility
