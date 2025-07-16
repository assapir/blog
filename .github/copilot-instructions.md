# Copilot Instructions for Assaf Sapir's Personal Website

## Architecture Overview
This is a **vanilla JavaScript personal website** built with Web Components and deployed on **Cloudflare Workers**. The architecture is component-based but uses native Web Components API, not frameworks.

### Core Patterns

**Web Components Structure:**
- All components extend `HTMLElement` and use `customElements.define()`
- Components follow the pattern: `connectedCallback()` → `render()` → `setupEventListeners()`
- Each component manages its own styles inline via `addStyles()` method
- Components are self-contained with their own styling and behavior

**File Organization:**
- `public/` - All static assets served directly
- `public/js/components/` - Web Components (nav-header.js, hero-section.js, etc.)
- `public/js/services/` - Service layer (github-api.js for API calls)
- `public/styles/` - CSS split into main.css (variables), components.css, responsive.css
- `wrangler.jsonc` - Cloudflare Workers deployment config

## Key Development Patterns

### Component Development
```javascript
class ComponentName extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }
  
  render() {
    this.innerHTML = `<template>`;
  }
  
  addStyles() {
    // Inline styles using CSS custom properties
  }
}
customElements.define("component-name", ComponentName);
```

### CSS Architecture
- **CSS Custom Properties** extensively used for theming (dark theme only)
- Variables defined in `:root` follow naming: `--primary-dark`, `--text-secondary`, etc.
- Responsive design with breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)
- Components use CSS Grid and Flexbox for layouts

### GitHub API Integration
- `github-api.js` service handles all GitHub API calls
- **Caching strategy**: 10-minute localStorage cache for repositories
- Error handling and rate limiting built-in
- Maps repository languages to technology icons
- Used by `projects-section.js` for dynamic project display

## Development Workflow

### Local Development
```bash
# Serve locally (multiple options)
python -m http.server 8002 --directory public
npx serve -s public -l 8002
npx wrangler dev  # Cloudflare Workers development
```

### Deployment
```bash
npx wrangler deploy  # Deploy to Cloudflare Workers
```

### Key Files to Modify
- `public/index.html` - Main entry point, component inclusion
- `public/js/main.js` - App initialization, global event handling
- `public/styles/main.css` - CSS variables and global styles
- `wrangler.jsonc` - Deployment configuration

## Component-Specific Notes

### Projects Section
- Dynamically loads from GitHub API via `github-api.js`
- Implements loading states and error handling
- Uses intersection observer for performance
- Filters repositories and maps languages to icons

### Navigation
- Mobile-first responsive design with hamburger menu
- Smooth scrolling implementation in `main.js`
- Active section highlighting based on scroll position

### Styling Approach
- **No CSS frameworks** - custom CSS with systematic use of custom properties
- Dark theme with WCAG compliant colors
- Consistent spacing system using CSS variables (`--space-xs`, etc.)
- Typography scale with Inter font family

## Performance Considerations
- **Lazy loading** implemented for GitHub API calls
- **Caching** for external API responses
- **ES6 modules** for component organization
- **Intersection Observer** for scroll-based animations
- Static asset optimization for Cloudflare Workers

## Testing & Debugging
- No formal testing framework - uses browser dev tools
- Components are debuggable via browser Custom Elements inspection
- GitHub API service includes console logging for debugging
- Cloudflare Workers logs available via `wrangler tail`

## Domain Configuration
- Deployed to `sapir.io` and `www.sapir.io`
- DNS configured through Cloudflare
- SSL/TLS handled automatically by Cloudflare Workers
