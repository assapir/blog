class ContactSection extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupInteractions();
  }

  render() {
    this.innerHTML = `
            <div class="container section">
                <div class="contact-container">
                    <h2>Let's Connect</h2>
                    <p>
                        I'm always interested in new opportunities, collaborations, and interesting projects.
                        Whether you have a question, want to work together, or just want to say hello,
                        I'd love to hear from you!
                    </p>

                    <div class="contact-methods">
                        <div class="contact-method">
                            <span class="contact-icon">📍</span>
                            <div class="contact-details">
                                <span class="contact-label">Location</span>
                                <span class="contact-value">Israel</span>
                            </div>
                        </div>
                        <div class="contact-method">
                            <span class="contact-icon">⏰</span>
                            <div class="contact-details">
                                <span class="contact-label">Response Time</span>
                                <span class="contact-value">Usually within 24 hours</span>
                            </div>
                        </div>
                    </div>

                    <div class="social-links">
                        ${this.getSocialLinks()
                          .map((link) => this.createSocialLink(link))
                          .join("")}
                    </div>
                </div>
            </div>
        `;

    this.setAttribute("id", "contact");
  }

  createSocialLink(link) {
    const iconContent = link.image
      ? `<img src="${link.image}" alt="${link.label} icon" />`
      : link.icon;

    return `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-link" data-platform="${link.platform}">
                <div class="social-icon">${iconContent}</div>
                <span class="social-label">${link.label}</span>
                <span class="social-handle">${link.handle}</span>
            </a>
        `;
  }

  setupInteractions() {
    // Add hover effects for contact methods
    const contactMethods = this.querySelectorAll(".contact-method");
    contactMethods.forEach((method) => {
      method.addEventListener("mouseenter", () => {
        method.style.transform = "translateY(-4px) scale(1.02)";
      });

      method.addEventListener("mouseleave", () => {
        method.style.transform = "translateY(-4px) scale(1)";
      });
    });

    // Add click tracking for analytics
    const socialLinks = this.querySelectorAll(".social-link");
    socialLinks.forEach((link) => {
      link.addEventListener("click", () => {
        console.log("Social link clicked:", link.dataset.platform);
      });
    });
  }

  getSocialLinks() {
    return [
      {
        platform: "github",
        label: "GitHub",
        handle: "@assapir",
        icon: "🐙",
        image: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg",
        url: "https://github.com/assapir",
      },
      {
        platform: "twitter",
        label: "Twitter",
        handle: "@meijin007",
        icon: "🐦",
        image: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg",
        url: "https://twitter.com/meijin007",
      },
      {
        platform: "linkedin",
        label: "LinkedIn",
        handle: "Assaf Sapir",
        icon: "💼",
        image:
          "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg",
        url: "https://www.linkedin.com/in/assaf-sapir/",
      },
      {
        platform: "email",
        label: "Email",
        handle: "assaf@sapir.io",
        icon: "📧",
        url: "mailto:assaf@sapir.io",
      },
    ];
  }
}

customElements.define("contact-section", ContactSection);
