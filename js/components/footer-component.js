class FooterComponent extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupBackToTop();
  }

  render() {
    this.innerHTML = `
            <div class="footer-content">
                <p>&copy; ${new Date().getFullYear()} Assaf Sapir. Built with ❤️ using vanilla JavaScript, Web Components and vibe coding.</p>
                <button class="back-to-top" id="backToTop" aria-label="Back to top">
                    ↑
                </button>
            </div>
        `;

    this.addStyles();
  }

  addStyles() {
    const style = document.createElement("style");
    style.textContent = `
            footer-component {
                background-color: var(--primary-dark);
                color: white;
                padding: var(--space-lg) 0;
                margin-top: var(--space-4xl);
            }

            .footer-content {
                max-width: var(--container-max-width);
                margin: 0 auto;
                padding: 0 var(--space-xl);
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: var(--space-lg);
            }

            .footer-content p {
                color: rgba(255, 255, 255, 0.8);
                font-size: var(--font-size-sm);
                margin: 0;
                flex: 1;
            }

            .back-to-top {
                background-color: var(--primary-blue);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: var(--font-size-lg);
                font-weight: bold;
                cursor: pointer;
                transition: all var(--transition-medium);
                box-shadow: var(--shadow-medium);
                opacity: 0;
                transform: translateY(20px);
                flex-shrink: 0;
            }

            .back-to-top.visible {
                opacity: 1;
                transform: translateY(0);
            }

            .back-to-top:hover {
                background-color: var(--accent-blue);
                transform: translateY(-4px);
                box-shadow: var(--shadow-heavy);
            }

            @media (max-width: 768px) {
                .footer-content {
                    flex-direction: column;
                    text-align: center;
                    gap: var(--space-md);
                    padding: 0 var(--space-lg);
                }

                .footer-content p {
                    font-size: var(--font-size-xs);
                    line-height: 1.5;
                }

                .back-to-top {
                    width: 36px;
                    height: 36px;
                    font-size: var(--font-size-base);
                }
            }

            @media (max-width: 480px) {
                footer-component {
                    padding: var(--space-md) 0;
                }

                .footer-content {
                    padding: 0 var(--space-md);
                }

                .footer-content p {
                    font-size: var(--font-size-xs);
                    line-height: 1.4;
                }
            }
        `;

    if (!document.querySelector("#footer-component-styles")) {
      style.id = "footer-component-styles";
      document.head.appendChild(style);
    }
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
