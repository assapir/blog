class HeroSection extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
            <div class="hero-container container">
                <div class="hero-content">
                    <h1 class="animate-fade-in-up">
                        <span style="color: var(--text-primary);">Hi, I'm</span> <span style="color: var(--primary-blue);">Assaf Sapir</span>
                    </h1>
                    <p class="subtitle animate-fade-in-up" style="animation-delay: 0.2s;">
                        I write code and mass-produce opinions
                    </p>
                    <p class="description animate-fade-in-up" style="animation-delay: 0.4s;">
                        Software developer from Israel. I build things for the web
                        and mass opinions about things that don't matter.
                    </p>
                    <div class="hero-actions animate-fade-in-up" style="animation-delay: 0.6s;">
                        <a href="#projects" class="btn btn-secondary">
                            View My Work
                        </a>
                        <a href="/blog/" class="btn btn-secondary">
                            Read My Opinions
                        </a>
                        <a href="#contact" class="btn btn-secondary">
                            Get In Touch
                        </a>
                    </div>
                </div>
            </div>
        `;

    this.setAttribute("id", "home");
  }
}

customElements.define("hero-section", HeroSection);
