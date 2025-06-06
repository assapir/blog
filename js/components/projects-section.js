class ProjectsSection extends HTMLElement {
  constructor() {
    super();
    this.projects = this.getProjectsData();
  }

  connectedCallback() {
    this.render();
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
                    ${this.projects
                      .map((project) => this.createProjectCard(project))
                      .join("")}
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

  getProjectsData() {
    // Based on your GitHub profile, here are some featured projects
    return [
      {
        id: "yahf",
        name: "YAHF",
        description:
          "Yet Another HTTP Framework - A lightweight, modern HTTP framework that you don't really need, but might want anyway. Built with simplicity and performance in mind.",
        technologies: ["JavaScript", "Node.js", "HTTP", "Express"],
        language: "JavaScript",
        stars: 2,
        forks: 0,
        status: "active",
        github: "https://github.com/assapir/yahf",
        demo: null,
      },
      {
        id: "gpsd-ts",
        name: "GPSD-TS",
        description:
          "TypeScript client library for communicating with GPSD (GPS Daemon). Provides type-safe GPS data access with modern async/await patterns.",
        technologies: ["TypeScript", "GPS", "Node.js", "Networking"],
        language: "TypeScript",
        stars: 5,
        forks: 1,
        status: "maintained",
        github: "https://github.com/assapir/gpsd-ts",
        demo: null,
      },
      {
        id: "hebcal-contributions",
        name: "Hebcal Contributions",
        description:
          "Contributions to the Hebcal project - a comprehensive Hebrew calendar and Jewish holiday calculation library used by thousands of applications worldwide.",
        technologies: [
          "JavaScript",
          "Calendar",
          "Jewish Holidays",
          "Open Source",
        ],
        language: "JavaScript",
        stars: 120,
        forks: 25,
        status: "active",
        github: "https://github.com/hebcal",
        demo: "https://www.hebcal.com",
      },
      {
        id: "web-components-portfolio",
        name: "Modern Web Portfolio",
        description:
          "This very website! Built with vanilla JavaScript, modern CSS Grid, and Web Components. Showcases responsive design and progressive enhancement.",
        technologies: ["HTML5", "CSS Grid", "Web Components", "Vanilla JS"],
        language: "JavaScript",
        stars: 0,
        forks: 0,
        status: "active",
        github: null,
        demo: null,
      },
      {
        id: "open-source-tools",
        name: "Development Tools",
        description:
          "Collection of utility tools and scripts for development workflow automation. Includes build tools, testing utilities, and deployment helpers.",
        technologies: ["Shell", "Python", "DevOps", "Automation"],
        language: "Shell",
        stars: 8,
        forks: 2,
        status: "maintained",
        github: "https://github.com/assapir",
        demo: null,
      },
      {
        id: "learning-projects",
        name: "Learning & Experiments",
        description:
          "Experimental projects exploring new technologies, frameworks, and programming concepts. From AI/ML experiments to blockchain demos.",
        technologies: ["Various", "Learning", "Experiments", "Prototypes"],
        language: "Mixed",
        stars: 15,
        forks: 3,
        status: "active",
        github: "https://github.com/assapir",
        demo: null,
      },
    ];
  }
}

customElements.define("projects-section", ProjectsSection);
