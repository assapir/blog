class HeroSection extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupAnimations();
  }

  render() {
    this.innerHTML = `
            <div class="hero-container container">
                <div class="hero-content">
                    <h1 class="animate-fade-in-up">
                        <span style="color: var(--text-primary);">Hi, I'm</span> <span style="color: var(--primary-blue);">Assaf Sapir</span>
                    </h1>
                    <p class="subtitle animate-fade-in-up" style="animation-delay: 0.2s;">
                        Software Developer & Open Source Enthusiast
                    </p>
                    <p class="description animate-fade-in-up" style="animation-delay: 0.4s;">
                        Passionate developer from Israel with ${
                          this.getGitHubStats().repos
                        }+ repositories and a love for modern web technologies.
                        I build scalable solutions and contribute to open source projects that make a difference.
                    </p>
                    <div class="hero-actions animate-fade-in-up" style="animation-delay: 0.6s;">
                        <a href="#projects" class="btn btn-primary btn-lg">
                            View My Work
                        </a>
                        <a href="#contact" class="btn btn-secondary btn-lg">
                            Get In Touch
                        </a>
                    </div>
                </div>

                <div class="hero-visual animate-fade-in-up" style="animation-delay: 0.8s;">
                    <div class="hero-image">
                        <span class="typing-text" id="typingText"></span>
                    </div>
                </div>
            </div>
        `;

    this.setAttribute("id", "home");
  }

  setupAnimations() {
    // Typing animation
    const typingText = this.querySelector("#typingText");
    const texts = ["👨‍💻", "{ }", "🚀", "⚡", "🌟"];
    let currentTextIndex = 0;

    const typeText = () => {
      typingText.textContent = texts[currentTextIndex];
      currentTextIndex = (currentTextIndex + 1) % texts.length;
    };

    // Start typing animation after a delay
    setTimeout(() => {
      typeText();
      setInterval(typeText, 2000);
    }, 1000);

    // Floating animation for hero image
    this.addFloatingAnimation();
  }

  addFloatingAnimation() {
    const heroImage = this.querySelector(".hero-image");

    const style = document.createElement("style");
    style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
            }

            .hero-image {
                animation: float 6s ease-in-out infinite;
            }
        `;
    document.head.appendChild(style);
  }

  getGitHubStats() {
    // This would typically come from GitHub API
    // For now, using static data based on the research
    return {
      repos: 55,
      followers: 230,
    };
  }
}

customElements.define("hero-section", HeroSection);
