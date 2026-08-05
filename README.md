# Assaf Sapir - Personal Website

A modern, responsive personal website built with vanilla JavaScript, Web Components, and CSS Grid. Features dynamic GitHub integration and mobile-first design.

## 🚀 Features

- **Modern Web Technologies**: Built with Web Components and ES6 modules
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Dynamic Content**: Live GitHub API integration for project showcase
- **Performance Optimized**: Lazy loading, caching, and efficient asset delivery
- **Clean Architecture**: Modular component structure for maintainability

## 📁 Project Structure

```
├── package.json             # Project configuration and scripts
├── wrangler.jsonc           # Cloudflare Workers configuration
├── public/                  # Static website files
│   ├── index.html           # Main HTML entry point
│   ├── js/
│   │   ├── main.js          # Application initialization and core logic
│   │   ├── components/      # Web Components
│   │   │   ├── nav-header.js     # Navigation component
│   │   │   ├── hero-section.js   # Hero section
│   │   │   ├── about-section.js  # About section
│   │   │   ├── projects-section.js # Dynamic projects from GitHub
│   │   │   ├── skills-section.js # Skills showcase
│   │   │   ├── contact-section.js # Contact information
│   │   │   └── footer-component.js # Footer
│   │   └── services/
│   │       └── github-api.js     # GitHub API integration service
│   └── styles/
│       ├── main.css         # Core styles and CSS variables
│       ├── components.css   # Component-specific styles
│       └── responsive.css   # Media queries and responsive design
└── README.md
```

## 🛠 Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Architecture**: Web Components, Custom Elements
- **Styling**: CSS Grid, Flexbox, CSS Custom Properties
- **APIs**: GitHub REST API for dynamic project data
- **Performance**: Intersection Observer, localStorage caching
- **Deployment**: Cloudflare Workers

## 🔧 Setup & Development

1. **Clone the repository**:

   ```bash
   git clone https://github.com/assapir/blog.git
   cd blog
   ```

2. **Install dependencies** (pnpm — `pnpm-lock.yaml` is the lockfile):

   ```bash
   pnpm install
   ```

3. **Serve locally**:

   ```bash
   # Cloudflare Workers, the way it runs in production
   pnpm dev

   # Or any static server — public/ has no build step
   python -m http.server 8002 --directory public
   ```

4. **Open in browser**:
   ```
   http://localhost:8002
   ```

## 🚀 Deployment

This project is configured for deployment on Cloudflare Workers:

1. **Authenticate wrangler** (once per machine):
   ```bash
   pnpm exec wrangler login
   ```

2. **Deploy to Cloudflare Workers**:
   ```bash
   pnpm deploy
   ```

3. **Configure custom domain** (optional):
   - Add your domain to Cloudflare
   - Update nameservers at your domain registrar
   - Configure custom domain in Workers dashboard

The `wrangler.jsonc` file contains all deployment configuration.

## 🎯 Key Components

### GitHub Integration

- Fetches real repository data from GitHub API
- Caches responses for 10 minutes to optimize performance
- Handles rate limiting and error states gracefully
- Maps repository languages to technology icons

### Skills Section

- Organized by proficiency levels (Expert → Advanced → Intermediate → Learning)
- Categorized into Languages, Frameworks, Tools, and Databases
- Responsive grid layout with hover effects

### Contact Section

- Clean contact methods
- Social media links with hover animations
- Responsive design for all screen sizes

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔄 Git Workflow

The project uses a clean commit history with meaningful messages:

- `Initial website foundation` - Base structure and components
- `Skills cleanup and email standardization` - Content organization
- `GitHub API integration with dynamic loading` - Dynamic content
- `GitHub API cleanup and Rust technology mapping` - Code optimization
- `Remove skip to main content button` - UI improvements

## 🌐 Live Demo

Visit the website at: [Your deployment URL here]

## 📧 Contact

- **Email**: assaf@sapir.io
- **GitHub**: [@assapir](https://github.com/assapir)
- **LinkedIn**: [Assaf Sapir](https://www.linkedin.com/in/assaf-sapir/)
- **Twitter**: [@meijin007](https://twitter.com/meijin007)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
