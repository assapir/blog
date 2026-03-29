class GitHubApiService {
  constructor() {
    this.username = "assapir";
    this.worker = null;
    this.pendingResolve = null;
    this.pendingReject = null;
  }

  async getFeaturedRepositories(limit = 6) {
    try {
      return await this.fetchViaWorker(limit);
    } catch (error) {
      console.error("Failed to get featured repositories:", error);
      return this.getFallbackRepositories();
    }
  }

  fetchViaWorker(limit) {
    if (!this.worker) {
      this.worker = new Worker("/js/workers/github-worker.js");
      this.worker.onmessage = (e) => {
        if (e.data.type === "success") {
          this.pendingResolve?.(e.data.data);
        } else {
          this.pendingReject?.(new Error(e.data.message));
        }
        this.pendingResolve = null;
        this.pendingReject = null;
      };
      this.worker.onerror = (e) => {
        this.pendingReject?.(new Error(e.message));
        this.pendingResolve = null;
        this.pendingReject = null;
      };
    }

    return new Promise((resolve, reject) => {
      this.pendingResolve = resolve;
      this.pendingReject = reject;

      const timeout = setTimeout(() => {
        this.pendingResolve = null;
        this.pendingReject = null;
        reject(new Error("Worker timeout"));
      }, 10000);

      const origResolve = resolve;
      const origReject = reject;
      this.pendingResolve = (data) => { clearTimeout(timeout); origResolve(data); };
      this.pendingReject = (err) => { clearTimeout(timeout); origReject(err); };

      this.worker.postMessage({ username: this.username, limit });
    });
  }

  getFallbackRepositories() {
    return [
      { id: "yahf", name: "yahf", description: "Yet Another HTTP Framework, that you don't really need", technologies: ["JavaScript"], language: "JavaScript", stars: 3, forks: 0, github: "https://github.com/assapir/yahf", demo: null },
      { id: "golem", name: "golem", description: "A clay body, animated by words. Rust AI agent harness with ReAct loop, pluggable tools, and SQLite memory.", technologies: ["Rust"], language: "Rust", stars: 1, forks: 1, github: "https://github.com/assapir/golem", demo: null },
      { id: "blog", name: "blog", description: "my blog code", technologies: ["JavaScript"], language: "JavaScript", stars: 0, forks: 0, github: "https://github.com/assapir/blog", demo: null },
      { id: "wifi-watchdog", name: "wifi-watchdog", description: "WiFi watchdog for Raspberry Pi 5 (brcmfmac/CYW43455) — auto-recovers from firmware lockups via module reload or reboot", technologies: ["Shell"], language: "Shell", stars: 0, forks: 0, github: "https://github.com/assapir/wifi-watchdog", demo: null },
      { id: "dotfiles", name: "dotfiles", description: "my dotfiles for codespaces, mainely.", technologies: ["Shell"], language: "Shell", stars: 0, forks: 0, github: "https://github.com/assapir/dotfiles", demo: null },
      { id: "jobflow", name: "jobflow", description: "Where applications flow, offers follow", technologies: ["TypeScript"], language: "TypeScript", stars: 0, forks: 0, github: "https://github.com/assapir/jobflow", demo: null },
    ];
  }
}

// Clean up old localStorage cache from previous version
try { localStorage.removeItem("github-repos-cache"); } catch {}

const githubApi = new GitHubApiService();
export default githubApi;
