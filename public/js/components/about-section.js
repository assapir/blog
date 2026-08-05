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
                            form opinions about things that don't matter.
                        </p>
                        <p>
                            Full-stack, and not in the CV sense: TypeScript and Node on the back,
                            React and Vue on the front, C++ back when the SDKs were desktop-shaped,
                            and Rust when I want to feel humble. Under most of it there's a Kubernetes
                            cluster and some Terraform I have to answer for.
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
