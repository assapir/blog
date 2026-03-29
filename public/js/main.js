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
    this.navHeader = document.querySelector("nav-header");
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
        this.scrollToElement(hash.substring(1));
        history.scrollRestoration = previousRestoration || "auto";
      }, 100);
    });
  }

  scrollToElement(targetId, smooth = true) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;
    const navHeight = this.navHeader?.offsetHeight ?? 60;
    const targetPosition = targetElement.offsetTop - navHeight - 20;
    window.scrollTo({
      top: targetPosition,
      behavior: smooth ? "smooth" : "instant",
    });
  }

  setupSmoothScrolling() {
    // Enhanced smooth scrolling for anchor links
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        const targetId = link.getAttribute("href").substring(1);
        if (document.getElementById(targetId)) {
          e.preventDefault();
          history.pushState(null, "", `#${targetId}`);
          this.scrollToElement(targetId);
        }
      }
    });

    // Handle back/forward navigation
    window.addEventListener("popstate", () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        this.scrollToElement(hash, false);
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
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
        this.scrollToElement("home");
      }

      // Alt + C: Go to contact
      if (e.altKey && e.key === "c") {
        e.preventDefault();
        this.scrollToElement("contact");
      }

      // Escape: Close mobile menu
      if (e.key === "Escape") {
        const navLinks = this.navHeader?.querySelector("#navLinks");
        if (navLinks?.classList.contains("active")) {
          this.navHeader?.querySelector("#mobileMenuBtn")?.click();
        }
      }
    });
  }

  logWelcomeMessage() {
    console.log(
      "%cHi, I'm Assaf Sapir%c\n" +
      "I write code and mass-produce opinions.\n\n" +
      "Source: https://github.com/assapir/blog",
      "font-size: 16px; font-weight: bold; color: #4a9eff;",
      "font-size: 12px; color: inherit;"
    );
  }
}

// Initialize the application
const app = new App();

// Export for module systems
export default App;
