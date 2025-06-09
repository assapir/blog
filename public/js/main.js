// Main application initialization
class App {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setupApp());
    } else {
      this.setupApp();
    }
  }

  setupApp() {
    this.setupTheme();
    this.setupSmoothScrolling();
    this.setupPerformanceOptimizations();
    this.setupAccessibility();
    this.logWelcomeMessage();
  }

  setupTheme() {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const theme = savedTheme || systemTheme;

    document.documentElement.setAttribute("data-theme", theme);

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          document.documentElement.setAttribute(
            "data-theme",
            e.matches ? "dark" : "light"
          );
        }
      });
  }

  setupSmoothScrolling() {
    // Enhanced smooth scrolling for anchor links
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const navHeight = document.querySelector("nav-header").offsetHeight;
          const targetPosition = targetElement.offsetTop - navHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  }

  setupPerformanceOptimizations() {
    // Preload critical resources
    this.preloadCriticalResources();

    // Setup intersection observer for lazy loading
    this.setupLazyLoading();

    // Setup service worker for caching (if needed)
    if ("serviceWorker" in navigator) {
      // Uncomment when you have a service worker
      // navigator.serviceWorker.register('/sw.js');
    }
  }

  preloadCriticalResources() {
    const criticalResources = [
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
    ];

    criticalResources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "style";
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  setupLazyLoading() {
    // Lazy load images and heavy content
    const lazyElements = document.querySelectorAll("[data-lazy]");

    if (lazyElements.length > 0) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const src = element.dataset.lazy;

            if (element.tagName === "IMG") {
              element.src = src;
            } else {
              element.style.backgroundImage = `url(${src})`;
            }

            element.removeAttribute("data-lazy");
            imageObserver.unobserve(element);
          }
        });
      });

      lazyElements.forEach((element) => imageObserver.observe(element));
    }
  }

  setupAccessibility() {
    // Setup focus management
    this.setupFocusManagement();

    // Add keyboard navigation enhancements
    this.setupKeyboardNavigation();
  }

  setupFocusManagement() {
    // Add focus indicators for better accessibility
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-navigation");
      }
    });

    document.addEventListener("mousedown", () => {
      document.body.classList.remove("keyboard-navigation");
    });
  }

  setupKeyboardNavigation() {
    // Add keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Alt + H: Go to home
      if (e.altKey && e.key === "h") {
        e.preventDefault();
        document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
      }

      // Alt + C: Go to contact
      if (e.altKey && e.key === "c") {
        e.preventDefault();
        document
          .getElementById("contact")
          ?.scrollIntoView({ behavior: "smooth" });
      }

      // Escape: Close mobile menu
      if (e.key === "Escape") {
        const navLinks = document.querySelector("#navLinks");
        if (navLinks?.classList.contains("active")) {
          document.querySelector("#mobileMenuBtn")?.click();
        }
      }
    });
  }

  logWelcomeMessage() {
    // Fun console message for developers who inspect the code
    console.log(`
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║    👋 Hello there, fellow developer!                         ║
    ║                                                              ║
    ║    Welcome to Assaf Sapir's personal website.                ║
    ║    Built with vanilla JavaScript Web Components and          ║
    ║    Vibe coding with CoPilot and Claude Sonnet 4.             ║
    ║                                                              ║
    ║    🚀 Modern, accessible, and performance-focused            ║
    ║    🎨 Clean design with CSS Grid and Flexbox                 ║
    ║    📱 Fully responsive and mobile-friendly                   ║
    ║    ⚡ Progressive enhancement and SEO optimized               ║
    ║                                                              ║
    ║    Interested in the code? Check it out on GitHub:           ║
    ║    https://github.com/assapir/blog                           ║
    ║                                                              ║
    ║    Let's connect and build something amazing together! 🤝    ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
        `);
  }
}

// Initialize the application
const app = new App();

// Export for module systems
export default App;
