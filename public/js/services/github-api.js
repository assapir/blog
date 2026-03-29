class GitHubApiService {
  constructor() {
    this.username = "assapir";
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
    return new Promise((resolve, reject) => {
      const worker = new Worker("/js/workers/github-worker.js");
      worker.onmessage = (e) => {
        worker.terminate();
        if (e.data.type === "success") {
          resolve(e.data.data);
        } else {
          reject(new Error(e.data.message));
        }
      };
      worker.onerror = (e) => {
        worker.terminate();
        reject(new Error(e.message));
      };
      worker.postMessage({ username: this.username, limit });
    });
  }

  getFallbackRepositories() {
    return [
      {
        id: "yahf",
        name: "YAHF",
        description: "Yet Another HTTP Framework - A lightweight, modern HTTP framework that you don't really need, but might want anyway.",
        technologies: ["JavaScript", "Node.js", "HTTP", "Express"],
        language: "JavaScript",
        stars: 2,
        forks: 0,
        github: "https://github.com/assapir/yahf",
        demo: null,
      },
      {
        id: "gpsd-ts",
        name: "GPSD-TS",
        description: "TypeScript client library for communicating with GPSD (GPS Daemon). Provides type-safe GPS data access with modern async/await patterns.",
        technologies: ["TypeScript", "GPS", "Node.js", "Networking"],
        language: "TypeScript",
        stars: 5,
        forks: 1,
        github: "https://github.com/assapir/gpsd-ts",
        demo: null,
      },
      {
        id: "web-components-portfolio",
        name: "Modern Web Portfolio",
        description: "This very website! Built with vanilla JavaScript, modern CSS Grid, and Web Components.",
        technologies: ["HTML5", "CSS Grid", "Web Components", "Vanilla JS"],
        language: "JavaScript",
        stars: 0,
        forks: 0,
        github: null,
        demo: null,
      },
    ];
  }
}

const githubApi = new GitHubApiService();
export default githubApi;
