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
    this.setupSmoothScrolling();
    this.setupAccessibility();
    this.handleInitialHash();
    this.logWelcomeMessage();
  }

  handleInitialHash() {
    const hash = window.location.hash;
    const isHomePage =
      window.location.pathname === "/" ||
      window.location.pathname === "/index.html";
    if (!hash || !isHomePage) return;

    // Prevent the browser's native jump
    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    window.scrollTo({ top: 0 });

    // Wait for Web Components to render, then smooth-scroll to the target
    requestAnimationFrame(() => {
      setTimeout(() => {
        const targetElement = document.getElementById(hash.substring(1));
        if (targetElement) {
          const navHeight =
            document.querySelector("nav-header").offsetHeight;
          const targetPosition = targetElement.offsetTop - navHeight - 20;
          window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
        history.scrollRestoration = previousRestoration || "auto";
      }, 100);
    });
  }

  setupSmoothScrolling() {
    // Enhanced smooth scrolling for anchor links
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        const targetId = link.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();
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
