class FooterComponent extends HTMLElement {
  connectedCallback() {
    this.setupBackToTop();
  }

  setupBackToTop() {
    const backToTopBtn = this.querySelector("#backToTop");

    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

customElements.define("footer-component", FooterComponent);
