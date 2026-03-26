# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal website for Assaf Sapir (sapir.io), built with vanilla JavaScript Web Components. No frameworks, no build step. Deployed on Cloudflare Workers as static assets.

## Commands

```bash
npm run dev          # Local dev server (wrangler dev)
npm run deploy       # Deploy to Cloudflare Workers
npm run preview      # Dev server with remote Cloudflare services
```

## Architecture

- **No build step** — all files in `public/` are served as-is by Cloudflare Workers
- **Web Components** — each UI section is a custom element extending `HTMLElement`, registered via `customElements.define()`. Styles live in CSS files, not in JS.
- **Blog system** — markdown files in `public/posts/`, manifest in `public/posts/posts.json`, parsed client-side via `marked` (CDN ES module). Hash-based routing: `/blog/#<slug>`.
- **GitHub API** — `public/js/services/github-api.js` fetches repos with 10-min localStorage cache.
- **CSS theming** — dark theme only. Custom properties in `:root` (main.css). WCAG-compliant with `prefers-contrast` and `prefers-reduced-motion` support.

### Adding a blog post

1. Create `public/posts/<slug>.md`
2. Add entry to `public/posts/posts.json` (title, date, description, tags, slug)
3. Add `<entry>` to `public/feed.xml` (Atom feed) and update the `<updated>` timestamp
4. Optionally add a `<url>` to `public/sitemap.xml`
5. Deploy

## Code Conventions

- ES6 modules, no bundler
- CSS in dedicated files (`public/styles/`), not inline in components
- `rel="noopener noreferrer"` on external links
- Semantic HTML with ARIA attributes
