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

                    <div class="social-links">
                        ${this.getSocialLinks()
                          .map((link) => this.createSocialLink(link))
                          .join("")}
                    </div>

                    <div class="contact-form-container">
                        <div class="contact-info">
                            <h3>Get in Touch</h3>
                            <div class="contact-methods">
                                <div class="contact-method">
                                    <span class="contact-icon">📧</span>
                                    <div class="contact-details">
                                        <span class="contact-label">Email</span>
                                        <span class="contact-value">hello@assafsapir.dev</span>
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
                        </div>

                        <form class="contact-form" id="contactForm">
                            <div class="form-group">
                                <label for="name">Name *</label>
                                <input type="text" id="name" name="name" required>
                            </div>

                            <div class="form-group">
                                <label for="email">Email *</label>
                                <input type="email" id="email" name="email" required>
                            </div>

                            <div class="form-group">
                                <label for="subject">Subject</label>
                                <input type="text" id="subject" name="subject">
                            </div>

                            <div class="form-group">
                                <label for="message">Message *</label>
                                <textarea id="message" name="message" rows="5" required></textarea>
                            </div>

                            <button type="submit" class="btn btn-primary btn-lg">
                                Send Message
                                <span id="submitIcon">📤</span>
                            </button>
                        </form>
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
            .contact-form-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: var(--space-4xl);
                margin-top: var(--space-4xl);
                max-width: 1000px;
                margin-left: auto;
                margin-right: auto;
            }

            .contact-info h3 {
                font-size: var(--font-size-xl);
                font-weight: 600;
                color: var(--primary-dark);
                margin-bottom: var(--space-lg);
            }

            .contact-methods {
                display: flex;
                flex-direction: column;
                gap: var(--space-lg);
            }

            .contact-method {
                display: flex;
                align-items: flex-start;
                gap: var(--space-md);
                padding: var(--space-md);
                background-color: var(--background-secondary);
                border-radius: var(--border-radius);
                transition: all var(--transition-medium);
            }

            .contact-method:hover {
                background-color: var(--light-blue);
                transform: translateX(4px);
            }

            .contact-icon {
                font-size: var(--font-size-xl);
                flex-shrink: 0;
            }

            .contact-details {
                display: flex;
                flex-direction: column;
            }

            .contact-label {
                font-size: var(--font-size-sm);
                color: var(--text-secondary);
                font-weight: 500;
            }

            .contact-value {
                font-weight: 600;
                color: var(--primary-dark);
            }

            .contact-form {
                background-color: var(--background-primary);
                padding: var(--space-2xl);
                border-radius: var(--border-radius-lg);
                box-shadow: var(--shadow-medium);
                border: 1px solid var(--border-color);
            }

            .form-group {
                margin-bottom: var(--space-lg);
            }

            .form-group label {
                display: block;
                margin-bottom: var(--space-sm);
                font-weight: 500;
                color: var(--text-primary);
            }

            .form-group input,
            .form-group textarea {
                width: 100%;
                padding: var(--space-md);
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-sm);
                font-family: inherit;
                font-size: var(--font-size-base);
                transition: border-color var(--transition-fast);
                background-color: var(--background-primary);
                color: var(--text-primary);
            }

            .form-group input:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: var(--primary-blue);
                box-shadow: 0 0 0 3px rgba(22, 83, 126, 0.1);
            }

            .form-group textarea {
                resize: vertical;
                min-height: 120px;
            }

            .social-link {
                flex-direction: column;
                min-width: 120px;
            }

            .social-handle {
                font-size: var(--font-size-sm);
                color: var(--text-light);
                font-weight: 400;
            }

            @media (max-width: 768px) {
                .contact-form-container {
                    grid-template-columns: 1fr;
                    gap: var(--space-2xl);
                }

                .contact-form {
                    padding: var(--space-lg);
                }

                .social-links {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        `;
    document.head.appendChild(style);
  }

  setupInteractions() {
    const form = this.querySelector("#contactForm");
    const submitIcon = this.querySelector("#submitIcon");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmission(form, submitIcon);
    });

    // Add floating label effect
    const inputs = this.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.addEventListener("focus", () => {
        input.parentElement.classList.add("focused");
      });

      input.addEventListener("blur", () => {
        if (!input.value) {
          input.parentElement.classList.remove("focused");
        }
      });
    });

    // Add real-time validation
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        this.validateField(input);
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
