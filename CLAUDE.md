# CLAUDE.md

Guidance for coding agents working in this repository. `AGENTS.md` is a symlink to this file.

## Project

Personal website for Assaf Sapir (sapir.io), built with vanilla JavaScript Web Components. Dark theme only, no frameworks. Deployed on Cloudflare Workers: everything in `public/` is served as-is, and a small Worker in `src/` server-renders the blog so posts are crawlable.

## Commands

```bash
pnpm install         # Install dependencies (pnpm, not npm — pnpm-lock.yaml is the lockfile)
pnpm dev             # Local dev server (wrangler dev)
pnpm deploy          # Deploy to Cloudflare Workers (requires wrangler login)
pnpm preview         # Dev server with remote Cloudflare services
```

## Architecture

- **No build step for `public/`** — those files are served as-is. The Worker in `src/` is bundled by wrangler, so there is still no separate build command.
- **Web Components** — each UI section is a custom element extending `HTMLElement`. Styles live in CSS files, not in JS.
- **CSS theming** — dark theme only. Custom properties in `:root` (main.css). WCAG-compliant, with `prefers-contrast: high` and `prefers-reduced-motion: reduce` support. Breakpoints: mobile (<768px), tablet (768–1024px), desktop (>1024px), ultra-wide (>1400px).
- **GitHub API** — `public/js/services/github-api.js` fetches repos for the projects section with a 10-minute localStorage cache, error handling and rate limiting; maps repo languages to technology icons.

The component pattern:

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

### File organization

- `src/` — Cloudflare Worker: `index.js` (routing), `render.js` (blog HTML + SEO metadata), `feeds.js` (sitemap and Atom feed)
- `public/` — all static assets, served directly
- `public/js/components/` — Web Components (nav-header, hero-section, about-section, projects-section, skills-section, contact-section, footer-component, blog-page)
- `public/js/services/` — service layer
- `public/js/main.js` — app initialization, smooth scrolling, keyboard navigation
- `public/posts/` — blog markdown files and the `posts.json` manifest
- `public/blog/` — the blog HTML shell
- `public/styles/` — `main.css` (custom properties, base, accessibility), `components.css`, `responsive.css`, `blog.css`
- `wrangler.jsonc` — Workers deployment config

## Blog system

Markdown files live in `public/posts/`, with metadata in `public/posts/posts.json` (title, date, description, tags, slug; optional `image` for a per-post OG image). Markdown is parsed in the Worker using `marked` (npm dependency, bundled by wrangler).

The Worker renders both the listing and each post server-side, so the HTML arrives fully formed with per-post title, description, canonical, OG/Twitter tags and `BlogPosting` JSON-LD. URLs are real paths: `/blog/` for the listing, `/blog/<slug>/` for posts.

- `src/index.js` — routes `/blog*`, `/sitemap.xml`, `/feed.xml`; redirects `www` to the apex and bare paths to trailing-slash form; falls back to the asset server on error
- `src/render.js` — listing and post HTML plus per-page SEO metadata
- `src/feeds.js` — sitemap and Atom feed generation
- `public/blog/index.html` — the shell the Worker rewrites via `HTMLRewriter`; still a valid standalone document
- `public/js/components/blog-page.js` — progressive enhancement only: search, tag filtering, copy link, legacy `#slug` redirect

Only `/blog*` and the two feed paths run through the Worker (`run_worker_first` in `wrangler.jsonc`); everything else goes straight to the asset server.

### Adding a blog post

1. Create `public/posts/<slug>.md`
2. Add an entry to `public/posts/posts.json`
3. Deploy

`sitemap.xml` and `feed.xml` are generated from `posts.json` at request time — do not hand-edit them, and do not add static copies to `public/`.

## Deployment

Manual, via `wrangler deploy`. Serves `sapir.io` and `www.sapir.io` (the Worker redirects `www` to the apex). SSL/TLS handled by Cloudflare.

## Code conventions

- ES6 modules, no bundler for `public/`
- No CSS frameworks — custom CSS with systematic custom properties, in dedicated files under `public/styles/`, never inline in components
- `rel="noopener noreferrer"` on external links
- Semantic HTML with ARIA attributes
