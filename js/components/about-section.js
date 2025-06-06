class AboutSection extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
            <div class="container section">
                <div class="about-container">
                    <div class="about-image-container">
                        <div class="about-image"></div>
                    </div>

                    <div class="about-content">
                        <h2>About Me</h2>
                        <p>
                            I'm a passionate software developer based in Israel with a strong focus on modern web technologies
                            and open source contributions. With ${this.getExperienceYears()}+ years in the field, I've built and
                            contributed to numerous projects that span from HTTP frameworks to GPS tracking systems.
                        </p>
                        <p>
                            My GitHub profile showcases 55+ repositories and has gained 230+ followers, reflecting my active
                            involvement in the developer community. I'm particularly interested in JavaScript, TypeScript,
                            and building scalable web applications that solve real-world problems.
                        </p>
                        <p>
                            When I'm not coding, you can find me exploring new technologies, contributing to open source projects,
                            or sharing knowledge with fellow developers. I believe in writing clean, maintainable code and
                            creating solutions that make a positive impact.
                        </p>

                        <div class="about-stats">
                            <div class="stat-item">
                                <span class="stat-number">55+</span>
                                <span class="stat-label">Repositories</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">230+</span>
                                <span class="stat-label">GitHub Followers</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">${this.getExperienceYears()}+</span>
                                <span class="stat-label">Years Experience</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    this.setAttribute("id", "about");
  }

  getExperienceYears() {
    const startYear = 2014;
    const currentYear = new Date().getFullYear();
    return currentYear - startYear;
  }
}

customElements.define("about-section", AboutSection);
