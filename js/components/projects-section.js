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
    await this.loadProjects();
    this.setupInteractions();
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
    this.addStyles();
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
      console.log('🔄 Starting to load projects from GitHub API...');
      this.loading = true;
      this.error = null;
      this.updateContent();

      console.log('📡 Calling githubApi.getFeaturedRepositories...');
      const repositories = await githubApi.getFeaturedRepositories(6);
      console.log('✅ Received repositories:', repositories);
      this.projects = repositories;

      this.loading = false;
      this.updateContent();

      // Re-setup interactions after content loads
      setTimeout(() => this.setupInteractions(), 100);
    } catch (error) {
      console.error('❌ Failed to load projects:', error);
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
                    <div class="project-status">
                        <span class="status-badge ${
                          project.status
                        }" aria-label="Project status: ${project.status}">${
      project.status
    }</span>
                    </div>
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
                    <span class="stat">⭐ ${project.stars}</span>
                    <span class="stat">🍴 ${project.forks}</span>
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

  addStyles() {
    const style = document.createElement("style");
    style.textContent = `
            .projects-footer {
                text-align: center;
                margin-top: var(--space-3xl);
            }

            .project-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: var(--space-md);
            }

            .status-badge {
                padding: var(--space-xs) var(--space-sm);
                border-radius: var(--border-radius-sm);
                font-size: var(--font-size-xs);
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .status-badge.active {
                background-color: #dcfce7;
                color: #166534;
            }

            .status-badge.maintained {
                background-color: #dbeafe;
                color: #1e40af;
            }

            .status-badge.archived {
                background-color: #f3f4f6;
                color: #6b7280;
            }

            .project-stats {
                display: flex;
                gap: var(--space-md);
                margin-bottom: var(--space-lg);
                font-size: var(--font-size-sm);
                color: var(--text-light);
            }

            .stat {
                display: flex;
                align-items: center;
                gap: var(--space-xs);
            }

            .project-card {
                opacity: 0;
                transform: translateY(20px);
                transition: all var(--transition-medium);
            }

            .project-card.visible {
                opacity: 1;
                transform: translateY(0);
            }

            /* Loading Skeleton Styles */
            .skeleton-card {
                opacity: 1 !important;
                transform: none !important;
            }

            .skeleton {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: skeleton-loading 1.5s infinite;
                border-radius: var(--border-radius-sm);
            }

            .skeleton-title {
                height: 24px;
                width: 70%;
                margin-bottom: var(--space-sm);
            }

            .skeleton-badge {
                height: 20px;
                width: 60px;
            }

            .skeleton-description {
                height: 16px;
                margin-bottom: var(--space-sm);
                width: 100%;
            }

            .skeleton-description.short {
                width: 80%;
            }

            .skeleton-tech {
                height: 24px;
                width: 60px;
                margin-right: var(--space-sm);
                margin-bottom: var(--space-sm);
                display: inline-block;
            }

            .skeleton-stat {
                height: 16px;
                width: 50px;
                margin-right: var(--space-md);
            }

            .skeleton-button {
                height: 36px;
                width: 80px;
                margin-right: var(--space-sm);
                display: inline-block;
            }

            @keyframes skeleton-loading {
                0% {
                    background-position: -200% 0;
                }
                100% {
                    background-position: 200% 0;
                }
            }

            /* Error State Styles */
            .error-state {
                grid-column: 1 / -1;
                text-align: center;
                padding: var(--space-4xl) var(--space-xl);
                background-color: var(--background-secondary);
                border-radius: var(--border-radius-lg);
                border: 2px dashed var(--border-color);
            }

            .error-icon {
                font-size: var(--font-size-4xl);
                margin-bottom: var(--space-lg);
            }

            .error-state h3 {
                color: var(--text-primary);
                margin-bottom: var(--space-md);
                font-size: var(--font-size-xl);
            }

            .error-state p {
                color: var(--text-secondary);
                margin-bottom: var(--space-xl);
                max-width: 400px;
                margin-left: auto;
                margin-right: auto;
            }

            .retry-btn {
                margin-top: var(--space-lg);
            }

            @media (max-width: 768px) {
                .project-header {
                    flex-direction: column;
                    gap: var(--space-sm);
                }

                .project-stats {
                    flex-wrap: wrap;
                    gap: var(--space-sm);
                }

                .project-links {
                    flex-direction: column;
                    gap: var(--space-sm);
                }
            }
        `;
    document.head.appendChild(style);
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

    // Add hover effects
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-8px) scale(1.02)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(-8px) scale(1)";
      });
    });
  }
}

customElements.define("projects-section", ProjectsSection);
