class NavHeader extends HTMLElement {
  constructor() {
    super();
    this.isMenuOpen = false;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.setupScrollEffect();
  }

  render() {
    this.innerHTML = `
            <div class="nav-container">
                <a href="#home" class="logo">Assaf Sapir</a>

                <ul class="nav-links" id="navLinks">
                    <li><a href="#home" class="nav-link active">Home</a></li>
                    <li><a href="#about" class="nav-link">About</a></li>
                    <li><a href="#projects" class="nav-link">Projects</a></li>
                    <li><a href="#skills" class="nav-link">Skills</a></li>
                    <li><a href="#contact" class="nav-link">Contact</a></li>
                </ul>

                <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle mobile menu">
                    <span id="menuIcon">☰</span>
                </button>
            </div>
        `;
  }

  setupEventListeners() {
    const mobileMenuBtn = this.querySelector("#mobileMenuBtn");
    const navLinks = this.querySelector("#navLinks");
    const menuIcon = this.querySelector("#menuIcon");

    // Mobile menu toggle
    mobileMenuBtn.addEventListener("click", () => {
      this.isMenuOpen = !this.isMenuOpen;
      navLinks.classList.toggle("active", this.isMenuOpen);
      menuIcon.textContent = this.isMenuOpen ? "✕" : "☰";
    });

    // Close mobile menu when clicking on a link
    navLinks.addEventListener("click", (e) => {
      if (e.target.classList.contains("nav-link")) {
        this.isMenuOpen = false;
        navLinks.classList.remove("active");
        menuIcon.textContent = "☰";
      }
    });

    // Active link highlighting
    const navLinksArray = this.querySelectorAll(".nav-link");
    navLinksArray.forEach((link) => {
      link.addEventListener("click", () => {
        navLinksArray.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      });
    });

    // Intersection Observer for active section highlighting
    this.setupIntersectionObserver();
  }

  setupScrollEffect() {
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;

      // Add/remove backdrop blur based on scroll position
      if (currentScrollY > 50) {
        this.style.backgroundColor = "rgba(255, 255, 255, 0.98)";
        this.style.backdropFilter = "blur(12px)";
        this.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
      } else {
        this.style.backgroundColor = "rgba(255, 255, 255, 0.98)";
        this.style.backdropFilter = "blur(10px)";
        this.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
      }

      // Hide/show navbar on scroll (optional)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        this.style.transform = "translateY(-100%)";
      } else {
        this.style.transform = "translateY(0)";
      }

      lastScrollY = currentScrollY;
    });
  }

  setupIntersectionObserver() {
    const sections = document.querySelectorAll(
      "hero-section, about-section, projects-section, skills-section, contact-section"
    );
    const navLinks = this.querySelectorAll(".nav-link");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = this.getSectionId(
              entry.target.tagName.toLowerCase()
            );

            navLinks.forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("href") === `#${sectionId}`) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      {
        threshold: 0.6,
        rootMargin: "-80px 0px -80px 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  getSectionId(tagName) {
    const sectionMap = {
      "hero-section": "home",
      "about-section": "about",
      "projects-section": "projects",
      "skills-section": "skills",
      "contact-section": "contact",
    };
    return sectionMap[tagName] || "home";
  }
}

customElements.define("nav-header", NavHeader);
