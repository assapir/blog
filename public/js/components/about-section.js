class AboutSection extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
            <div class="container section">
                <div class="about-container">
                    <div class="about-content">
                        <h2>About Me</h2>
                        <p>
                            I've been writing code since 2014, which means I've had plenty of time to
                            form opinions about things that don't matter. Mostly JavaScript and TypeScript,
                            with the occasional Rust detour when I want to feel humble.
                        </p>
                        <p>
                            When I'm not shipping code, I'm raising 5 kids, breaking things on
                            a Raspberry Pi, or writing blog posts about problems I caused myself.
                        </p>
                    </div>
                </div>
            </div>
        `;

    this.setAttribute("id", "about");
  }
}

customElements.define("about-section", AboutSection);
