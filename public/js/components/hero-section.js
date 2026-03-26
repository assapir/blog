class HeroSection extends HTMLElement {
  connectedCallback() {
    this.setAttribute("id", "home");
  }
}

customElements.define("hero-section", HeroSection);
