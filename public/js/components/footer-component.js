class FooterComponent extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupBackToTop();
  }

  render() {
    this.innerHTML = `
            <div class="footer-content">
                <p>&copy; ${new Date().getFullYear()} Assaf Sapir. Built with ❤️ using vanilla JavaScript, Web Components and vibe coding.</p>
                <nav class="footer-links" aria-label="Footer navigation">
                    <a href="/uses/">Uses</a>
                    <a href="/feed.xml" rel="alternate" type="application/atom+xml">RSS</a>
                </nav>
                <button class="back-to-top" id="backToTop" aria-label="Back to top">
                    ↑
                </button>
            </div>
        `;

  }

  setupBackToTop() {
    const backToTopBtn = this.querySelector("#backToTop");

    // Show/hide button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });

    // Scroll to top functionality
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

customElements.define("footer-component", FooterComponent);
