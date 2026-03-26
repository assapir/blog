import githubApi from "../services/github-api.js";

class ProjectsSection extends HTMLElement {
  constructor() {
    super();
    this.projects = [];
    this.loading = true;
    this.error = null;
  }

  async connectedCallback() {
    this.render();
    const load = async () => {
      await this.loadProjects();
      this.setupInteractions();
    };
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(() => load());
    } else {
      setTimeout(() => load(), 0);
    }
  }

  render() {
    this.innerHTML = `
            <div class="container section">
                <div class="section-header">
                    <h2>Featured Projects</h2>
                    <p>A showcase of my recent work and contributions to the open source community</p>
                </div>

                <div class="projects-grid">
                    ${this.renderContent()}
                </div>

                <div class="projects-footer">
                    <a href="https://github.com/assapir" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                        View All Projects on GitHub
                        <span>↗</span>
                    </a>
                </div>
            </div>
        `;

    this.setAttribute("id", "projects");
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoadingSkeleton();
    }

    if (this.error) {
      return this.renderError();
    }

    return this.projects
      .map((project) => this.createProjectCard(project))
      .join("");
  }

  renderLoadingSkeleton() {
    return Array(6)
      .fill(0)
      .map(
        (_, index) => `
      <article class="project-card skeleton-card" data-skeleton="${index}">
        <div class="project-header">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-badge"></div>
        </div>
        <div class="skeleton skeleton-description"></div>
        <div class="skeleton skeleton-description short"></div>
        <div class="project-tech">
          <div class="skeleton skeleton-tech"></div>
          <div class="skeleton skeleton-tech"></div>
          <div class="skeleton skeleton-tech"></div>
        </div>
        <div class="project-stats">
          <div class="skeleton skeleton-stat"></div>
          <div class="skeleton skeleton-stat"></div>
          <div class="skeleton skeleton-stat"></div>
        </div>
        <div class="project-links">
          <div class="skeleton skeleton-button"></div>
          <div class="skeleton skeleton-button"></div>
        </div>
      </article>
    `
      )
      .join("");
  }

  renderError() {
    return `
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>Unable to load projects</h3>
        <p>We couldn't fetch the latest project data from GitHub. Please try again.</p>
        <button class="btn btn-primary retry-btn" onclick="this.parentElement.parentElement.parentElement.parentElement.querySelector('projects-section').retryLoad()">
          Retry Loading
        </button>
      </div>
    `;
  }

  async loadProjects() {
    try {
      this.loading = true;
      this.error = null;
      this.updateContent();

      const repositories = await githubApi.getFeaturedRepositories(6);
      this.projects = repositories;

      this.loading = false;
      this.updateContent();

    } catch (error) {
      this.loading = false;
      this.error = error.message;
      this.updateContent();
    }
  }

  async retryLoad() {
    await this.loadProjects();
  }

  updateContent() {
    const projectsGrid = this.querySelector(".projects-grid");
    if (projectsGrid) {
      projectsGrid.innerHTML = this.renderContent();
    }
  }

  createProjectCard(project) {
    return `
            <article class="project-card" data-project="${
              project.id
            }" aria-labelledby="project-${project.id}-title">
                <div class="project-header">
                    <h3 id="project-${project.id}-title">${project.name}</h3>
                </div>

                <p>${project.description}</p>

                <div class="project-tech" role="list" aria-label="Technologies used">
                    ${project.technologies
                      .map(
                        (tech) =>
                          `<span class="tech-tag" role="listitem">${tech}</span>`
                      )
                      .join("")}
                </div>

                <div class="project-stats">
                    ${project.stars > 0 ? `<span class="stat">⭐ ${project.stars}</span>` : ""}
                    ${project.forks > 0 ? `<span class="stat">🍴 ${project.forks}</span>` : ""}
                    <span class="stat">📝 ${project.language}</span>
                </div>

                <div class="project-links">
                    ${
                      project.github
                        ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">Code</a>`
                        : ""
                    }
                    ${
                      project.demo
                        ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Demo</a>`
                        : ""
                    }
                </div>
            </article>
        `;
  }

  setupInteractions() {
    // Intersection Observer for staggered animations
    const cards = this.querySelectorAll(".project-card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));

  }
}

customElements.define("projects-section", ProjectsSection);
