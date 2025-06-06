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
                            <span class="contact-icon">📧</span>
                            <div class="contact-details">
                                <span class="contact-label">Email</span>
                                <a href="mailto:assaf@sapir.io" class="contact-value">assaf@sapir.io</a>
                            </div>
                        </div>
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
    return `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-link" data-platform="${link.platform}">
                <div class="social-icon">${link.icon}</div>
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
            }

            .contact-method:hover {
                background-color: var(--light-blue);
                transform: translateY(-4px);
                box-shadow: var(--shadow-medium);
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

  validateField(field) {
    const isValid = field.checkValidity();
    field.style.borderColor = isValid ? "var(--border-color)" : "#ef4444";

    if (field.type === "email" && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(field.value);
      field.style.borderColor = isValidEmail
        ? "var(--border-color)"
        : "#ef4444";
    }
  }

  async handleFormSubmission(form, submitIcon) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Update submit button
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;

    button.disabled = true;
    button.innerHTML = "Sending... <span>⏳</span>";

    try {
      // Simulate form submission (in real app, this would hit your backend)
      await this.simulateFormSubmission(data);

      // Success state
      button.innerHTML = "Message Sent! <span>✅</span>";
      button.style.backgroundColor = "#10b981";

      // Reset form
      form.reset();

      // Show success message
      this.showNotification(
        "Message sent successfully! I'll get back to you soon.",
        "success"
      );
    } catch (error) {
      // Error state
      button.innerHTML = "Failed to Send <span>❌</span>";
      button.style.backgroundColor = "#ef4444";

      this.showNotification(
        "Failed to send message. Please try again or contact me directly.",
        "error"
      );
    }

    // Reset button after 3 seconds
    setTimeout(() => {
      button.disabled = false;
      button.innerHTML = originalText;
      button.style.backgroundColor = "";
    }, 3000);
  }

  simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          console.log("Form submission:", data);
          resolve(data);
        } else {
          reject(new Error("Network error"));
        }
      }, 1500);
    });
  }

  showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;

    const style = document.createElement("style");
    style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: var(--space-lg);
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-heavy);
                border-left: 4px solid;
                display: flex;
                align-items: center;
                gap: var(--space-md);
                z-index: 1001;
                max-width: 400px;
                animation: slideIn 0.3s ease;
            }

            .notification-success {
                border-left-color: #10b981;
                color: #065f46;
                background-color: #d1fae5;
            }

            .notification-error {
                border-left-color: #ef4444;
                color: #991b1b;
                background-color: #fee2e2;
            }

            .notification button {
                background: none;
                border: none;
                font-size: var(--font-size-lg);
                cursor: pointer;
                opacity: 0.7;
            }

            @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
        `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  getSocialLinks() {
    return [
      {
        platform: "github",
        label: "GitHub",
        handle: "@assapir",
        icon: "🐙",
        url: "https://github.com/assapir",
      },
      {
        platform: "twitter",
        label: "Twitter",
        handle: "@meijin007",
        icon: "🐦",
        url: "https://twitter.com/meijin007",
      },
      {
        platform: "linkedin",
        label: "LinkedIn",
        handle: "Assaf Sapir",
        icon: "💼",
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
