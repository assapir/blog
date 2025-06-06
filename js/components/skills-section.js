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
        { name: "HTML5", icon: "🧱", level: "Expert" },
        { name: "TypeScript", icon: "🔷", level: "Expert" },
        { name: "CSS3", icon: "🎨", level: "Advanced" },
        { name: "Rust", icon: "🦀", level: "Advanced" },
        { name: "Python", icon: "🐍", level: "Intermediate" },
      ],
      frameworks: [
        { name: "Node.js", icon: "🟢", level: "Expert" },
        { name: "Express.js", icon: "⚡", level: "Expert" },
        { name: "Web Components", icon: "🧩", level: "Advanced" },
        { name: "React", icon: "⚛️", level: "Advanced" },
        { name: "Vue.js", icon: "💚", level: "Learning" },
      ],
      tools: [
        { name: "Git", icon: "📝", level: "Expert" },
        { name: "GitHub", icon: "🐙", level: "Expert" },
        { name: "VS Code", icon: "📘", level: "Expert" },
        { name: "Linux", icon: "🐧", level: "Advanced" },
        { name: "Docker", icon: "🐳", level: "Advanced" },
      ],
      databases: [
        { name: "PostgreSQL", icon: "🐘", level: "Advanced" },
        { name: "Redis", icon: "🔴", level: "Advanced" },
        { name: "MongoDB", icon: "🍃", level: "Intermediate" },
        { name: "SQLite", icon: "💾", level: "Intermediate" },
      ],
      other: [
        { name: "REST APIs", icon: "🌐", level: "Expert" },
        { name: "DevOps", icon: "⚙️", level: "Advanced" },
        { name: "GraphQL", icon: "🔗", level: "Intermediate" },
        { name: "WebSockets", icon: "🔌", level: "Intermediate" },
      ],
    };
  }
}

customElements.define("skills-section", SkillsSection);
