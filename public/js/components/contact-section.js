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
    this.addStyles();
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

  addStyles() {
    const style = document.createElement("style");
    style.textContent = `
            .contact-container {
                max-width: 800px;
                margin: 0 auto;
                text-align: center;
            }

            .contact-container h2 {
                font-size: var(--font-size-3xl);
                font-weight: 700;
                color: var(--text-primary);
                margin-bottom: var(--space-lg);
            }

            .contact-container p {
                font-size: var(--font-size-lg);
                color: var(--text-secondary);
                margin-bottom: var(--space-3xl);
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
            }

            .contact-methods {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: var(--space-xl);
                margin-bottom: var(--space-4xl);
            }

            .contact-method {
                display: flex;
                align-items: center;
                gap: var(--space-md);
                padding: var(--space-xl);
                background-color: var(--background-secondary);
                border-radius: var(--border-radius-lg);
                transition: all var(--transition-medium);
                text-align: left;
                border: 1px solid transparent;
            }

            .contact-method:hover {
                background-color: rgba(13, 64, 105, 0.08);
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(13, 64, 105, 0.15);
                border: 1px solid rgba(13, 64, 105, 0.2);
            }

            .contact-icon {
                font-size: var(--font-size-2xl);
                flex-shrink: 0;
                width: 60px;
                height: 60px;
                background-color: var(--primary-blue);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }

            .contact-details {
                display: flex;
                flex-direction: column;
                gap: var(--space-xs);
            }

            .contact-label {
                font-size: var(--font-size-sm);
                color: var(--text-secondary);
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .contact-value {
                font-weight: 600;
                color: var(--text-primary);
                font-size: var(--font-size-base);
            }

            .contact-value[href] {
                color: var(--primary-blue);
                text-decoration: none;
                transition: color var(--transition-fast);
            }

            .contact-value[href]:hover {
                color: var(--accent-blue);
                text-decoration: underline;
            }

            .social-links {
                display: flex;
                justify-content: center;
                gap: var(--space-xl);
                flex-wrap: wrap;
            }

            .social-link {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: var(--space-sm);
                text-decoration: none;
                color: var(--text-primary);
                transition: all var(--transition-medium);
                padding: var(--space-lg);
                border-radius: var(--border-radius);
                min-width: 120px;
            }

            .social-link:hover {
                color: var(--primary-blue);
                background-color: var(--background-secondary);
                transform: translateY(-4px);
            }

            .social-icon {
                width: 48px;
                height: 48px;
                background-color: var(--primary-blue);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-xl);
                color: white;
                transition: background-color var(--transition-medium);
                overflow: hidden;
            }

            .social-icon img {
                width: 24px;
                height: 24px;
                filter: brightness(0) invert(1);
                transition: filter var(--transition-medium);
            }

            .social-link:hover .social-icon {
                background-color: var(--accent-blue);
            }

            .social-label {
                font-weight: 600;
                font-size: var(--font-size-base);
            }

            .social-handle {
                font-size: var(--font-size-sm);
                color: var(--text-secondary);
                font-weight: 400;
            }

            @media (max-width: 768px) {
                .contact-methods {
                    grid-template-columns: 1fr;
                    gap: var(--space-lg);
                }

                .contact-method {
                    padding: var(--space-lg);
                }

                .social-links {
                    gap: var(--space-md);
                }

                .social-link {
                    min-width: 100px;
                    padding: var(--space-md);
                }
            }
        `;
    document.head.appendChild(style);
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
