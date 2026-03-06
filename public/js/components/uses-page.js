class UsesPage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="uses-page container">
        <div class="uses-header">
          <h1>Uses</h1>
          <p>Hardware, software, and tools I use daily for development.</p>
        </div>
        <div class="uses-content">
          ${this.renderCategories()}
        </div>
      </div>
    `;
  }

  renderCategories() {
    return this.getUsesData()
      .map((category) => this.renderCategory(category))
      .join("");
  }

  renderCategory(category) {
    return `
      <section class="uses-category" aria-labelledby="uses-${category.id}">
        <h2 id="uses-${category.id}">${category.title}</h2>
        <ul class="uses-list">
          ${category.items
            .map(
              (item) => `
            <li class="uses-item">
              <span class="uses-item-name">${item.url ? `<a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.name}</a>` : item.name}</span>
              ${item.description ? `<span class="uses-item-description">${item.description}</span>` : ""}
            </li>
          `
            )
            .join("")}
        </ul>
      </section>
    `;
  }

  getUsesData() {
    return [
      {
        id: "hardware",
        title: "Hardware",
        items: [
          {
            name: "Lenovo ThinkPad T14s Gen 2i",
            description: "Intel i7-1185G7, 32GB RAM — Linux daily driver",
          },
          { name: "MacBook Pro M3", description: "" },
          {
            name: "2x Dell 27\" 2K Monitors",
            description: "Daisy-chained",
          },
        ],
      },
      {
        id: "os-desktop",
        title: "Operating Systems & Desktop",
        items: [
          { name: "Arch Linux", url: "https://archlinux.org/", description: "btw" },
          { name: "GNOME", url: "https://www.gnome.org/", description: "Desktop environment" },
          { name: "Firefox", url: "https://www.mozilla.org/firefox/", description: "Primary browser" },
        ],
      },
      {
        id: "editor-ide",
        title: "Editor & IDE",
        items: [
          {
            name: "VS Code",
            url: "https://code.visualstudio.com/",
            description: "Sweet Dracula theme, vscode-icons",
          },
          {
            name: "Key Extensions",
            description:
              "GitLens, Prettier, ESLint, rust-analyzer, Docker, Playwright, Pretty TS Errors, OXC",
          },
          { name: "Cursor", url: "https://www.cursor.com/", description: "" },
          { name: "Claude Code", url: "https://docs.anthropic.com/en/docs/claude-code", description: "CLI" },
          { name: "GitHub Copilot", url: "https://github.com/features/copilot", description: "CLI" },
        ],
      },
      {
        id: "terminal",
        title: "Terminal",
        items: [
          {
            name: "Ghostty",
            url: "https://ghostty.org/",
            description: "Dark Pastel theme, FiraCode Nerd Font",
          },
          { name: "Zsh", url: "https://www.zsh.org/", description: "With Zim framework" },
          { name: "Starship", url: "https://starship.rs/", description: "Cross-shell prompt" },
          {
            name: "Zim",
            url: "https://zimfw.sh/",
            description:
              "zsh-autosuggestions, zsh-syntax-highlighting, zsh-history-substring-search, zsh-completions",
          },
        ],
      },
      {
        id: "cli-tools",
        title: "CLI Tools",
        items: [
          { name: "bat", url: "https://github.com/sharkdp/bat", description: "Better cat" },
          { name: "eza", url: "https://eza.rocks/", description: "Better ls" },
          { name: "broot", url: "https://dystroy.org/broot/", description: "File navigator" },
          { name: "nvm", url: "https://github.com/nvm-sh/nvm", description: "Node version manager" },
          { name: "kubecolor", url: "https://github.com/kubecolor/kubecolor", description: "Colorized kubectl" },
          { name: "Cargo", url: "https://doc.rust-lang.org/cargo/", description: "Rust toolchain" },
          { name: "llvmenv", url: "https://github.com/llvmenv/llvmenv", description: "LLVM version manager" },
        ],
      },
      {
        id: "ai-tools",
        title: "AI Tools",
        items: [
          { name: "Claude Code", url: "https://docs.anthropic.com/en/docs/claude-code", description: "CLI" },
          { name: "GitHub Copilot", url: "https://github.com/features/copilot", description: "" },
          { name: "Cursor", url: "https://www.cursor.com/", description: "" },
        ],
      },
      {
        id: "devops",
        title: "DevOps & Infrastructure",
        items: [
          { name: "Docker", url: "https://www.docker.com/", description: "" },
          { name: "Kubernetes", url: "https://kubernetes.io/", description: 'with <a href="https://github.com/kubecolor/kubecolor" target="_blank" rel="noopener noreferrer">kubecolor</a>' },
          { name: "Terraform", url: "https://www.terraform.io/", description: "" },
          { name: "Cloudflare Workers", url: "https://workers.cloudflare.com/", description: "" },
        ],
      },
      {
        id: "languages",
        title: "Languages",
        items: [
          { name: "JavaScript / TypeScript", description: "" },
          { name: "Rust", description: "" },
          { name: "Python", description: "" },
          { name: "HTML / CSS", description: "" },
        ],
      },
    ];
  }
}

customElements.define("uses-page", UsesPage);
