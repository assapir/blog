class SkillsSection extends HTMLElement {
  constructor() {
    super();
    this.skills = this.getSkillsData();
  }

  connectedCallback() {
    this.render();
    this.setupAnimations();
  }

  render() {
    this.innerHTML = `
            <div class="container section">
                <div class="section-header">
                    <h2>Skills & Technologies</h2>
                    <p>Technologies I work with and tools I use to bring ideas to life</p>
                </div>

                <div class="skills-grid">
                    ${Object.entries(this.skills)
                      .map(([category, skills]) =>
                        this.createSkillCategory(category, skills)
                      )
                      .join("")}
                </div>

                <div class="achievements-section">
                    <h3>GitHub Achievements</h3>
                    <div class="achievements-grid">
                        ${this.getAchievements()
                          .map((achievement) =>
                            this.createAchievementBadge(achievement)
                          )
                          .join("")}
                    </div>
                </div>
            </div>
        `;

    this.setAttribute("id", "skills");
    this.addStyles();
  }

  createSkillCategory(category, skills) {
    return `
            <section class="skill-category" aria-labelledby="skills-${category}-heading">
                <h3 id="skills-${category}-heading">${this.formatCategoryName(
      category
    )}</h3>
                <div class="skills-list" role="list" aria-label="${this.formatCategoryName(
                  category
                )} skills">
                    ${skills
                      .map(
                        (skill) => `
                        <span class="skill-item" data-skill="${skill.name.toLowerCase()}" role="listitem"
                              ${
                                skill.level
                                  ? `aria-label="${skill.name} - ${skill.level} level"`
                                  : `aria-label="${skill.name}"`
                              }>
                            ${
                              skill.icon
                                ? `<span class="skill-icon" aria-hidden="true">${skill.icon}</span>`
                                : ""
                            }
                            ${skill.name}
                            ${
                              skill.level
                                ? `<span class="skill-level" aria-hidden="true">${skill.level}</span>`
                                : ""
                            }
                        </span>
                    `
                      )
                      .join("")}
                </div>
            </section>
        `;
  }

  createAchievementBadge(achievement) {
    return `
            <div class="achievement-badge" title="${achievement.description}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <span class="achievement-name">${achievement.name}</span>
                    <span class="achievement-desc">${achievement.short}</span>
                </div>
            </div>
        `;
  }

  addStyles() {
    const style = document.createElement("style");
    style.textContent = `
            .skill-item {
                display: flex;
                align-items: center;
                gap: var(--space-xs);
                position: relative;
                overflow: hidden;
            }

            .skill-item::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s;
            }

            .skill-item:hover::before {
                left: 100%;
            }

            .skill-icon {
                font-size: var(--font-size-lg);
            }

            .skill-level {
                font-size: var(--font-size-xs);
                background-color: var(--primary-blue);
                color: white;
                padding: 2px var(--space-xs);
                border-radius: var(--border-radius-sm);
                margin-left: auto;
            }

            .achievements-section {
                margin-top: var(--space-4xl);
                text-align: center;
            }

            .achievements-section h3 {
                font-size: var(--font-size-2xl);
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: var(--space-2xl);
            }

            .achievements-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: var(--space-lg);
                max-width: 800px;
                margin: 0 auto;
            }

            .achievement-badge {
                display: flex;
                align-items: center;
                gap: var(--space-md);
                padding: var(--space-lg);
                background-color: var(--background-primary);
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-light);
                transition: all var(--transition-medium);
                cursor: pointer;
            }

            .achievement-badge:hover {
                transform: translateY(-4px);
                box-shadow: var(--shadow-medium);
            }

            .achievement-icon {
                font-size: var(--font-size-2xl);
                flex-shrink: 0;
            }

            .achievement-info {
                display: flex;
                flex-direction: column;
                text-align: left;
            }

            .achievement-name {
                font-weight: 600;
                color: var(--text-primary);
                font-size: var(--font-size-sm);
            }

            .achievement-desc {
                font-size: var(--font-size-xs);
                color: var(--text-secondary);
            }

            @media (max-width: 768px) {
                .achievements-grid {
                    grid-template-columns: 1fr;
                }

                .achievement-badge {
                    padding: var(--space-md);
                }
            }
        `;
    document.head.appendChild(style);
  }

  setupAnimations() {
    // Staggered animation for skill items
    const skillItems = this.querySelectorAll(".skill-item");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll(".skill-item");
            items.forEach((item, index) => {
              setTimeout(() => {
                item.style.opacity = "1";
                item.style.transform = "translateY(0)";
              }, index * 50);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    // Initially hide items
    skillItems.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(20px)";
      item.style.transition = "all 0.3s ease";
    });

    observer.observe(this);
  }

  formatCategoryName(category) {
    return category.split(/(?=[A-Z])/).join(" ");
  }

  getSkillsData() {
    return {
      languages: [
        { name: "JavaScript", icon: "🟨", level: "Expert" },
        { name: "TypeScript", icon: "🔷", level: "Advanced" },
        { name: "Python", icon: "🐍", level: "Intermediate" },
        { name: "HTML5", icon: "🧱", level: "Expert" },
        { name: "CSS3", icon: "🎨", level: "Advanced" },
        { name: "Shell", icon: "💻", level: "Advanced" },
      ],
      frameworks: [
        { name: "Node.js", icon: "🟢", level: "Advanced" },
        { name: "Express.js", icon: "⚡", level: "Advanced" },
        { name: "React", icon: "⚛️", level: "Intermediate" },
        { name: "Vue.js", icon: "💚", level: "Intermediate" },
        { name: "Web Components", icon: "🧩", level: "Advanced" },
      ],
      tools: [
        { name: "Git", icon: "📝", level: "Expert" },
        { name: "GitHub", icon: "🐙", level: "Expert" },
        { name: "VS Code", icon: "📘", level: "Expert" },
        { name: "Docker", icon: "🐳", level: "Intermediate" },
        { name: "Linux", icon: "🐧", level: "Advanced" },
        { name: "macOS", icon: "🍎", level: "Advanced" },
      ],
      databases: [
        { name: "MongoDB", icon: "🍃", level: "Intermediate" },
        { name: "PostgreSQL", icon: "🐘", level: "Intermediate" },
        { name: "Redis", icon: "🔴", level: "Basic" },
        { name: "SQLite", icon: "💾", level: "Intermediate" },
      ],
      other: [
        { name: "REST APIs", icon: "🌐", level: "Advanced" },
        { name: "GraphQL", icon: "🔗", level: "Intermediate" },
        { name: "WebSockets", icon: "🔌", level: "Intermediate" },
        { name: "GPS/GNSS", icon: "📍", level: "Advanced" },
        { name: "DevOps", icon: "⚙️", level: "Intermediate" },
        { name: "Testing", icon: "🧪", level: "Advanced" },
      ],
    };
  }

  getAchievements() {
    return [
      {
        name: "Arctic Code Vault",
        short: "Code preserved for 1000 years",
        icon: "🏔️",
        description:
          "Contributed code to repositories stored in the GitHub Arctic Code Vault",
      },
      {
        name: "Pull Shark x3",
        short: "Opened many pull requests",
        icon: "🦈",
        description: "Opened multiple pull requests that were merged",
      },
      {
        name: "YOLO",
        short: "Merged without review",
        icon: "🎯",
        description: "Merged a pull request without review",
      },
      {
        name: "Quickdraw",
        short: "Fast issue closure",
        icon: "⚡",
        description: "Closed an issue within 5 minutes of opening",
      },
      {
        name: "Pair Extraordinaire",
        short: "Co-authored commits",
        icon: "👥",
        description: "Co-authored commits with multiple users",
      },
      {
        name: "Public Sponsor",
        short: "Sponsored open source",
        icon: "💖",
        description: "Sponsored open source projects",
      },
    ];
  }
}

customElements.define("skills-section", SkillsSection);
