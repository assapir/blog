// GitHub API Service
// Handles all GitHub API interactions with caching and error handling

class GitHubApiService {
  constructor() {
    this.baseUrl = "https://api.github.com";
    this.username = "assapir";
    this.cacheKey = "github-repos-cache";
    this.cacheExpiry = 10 * 60 * 1000; // 10 minutes
  }

  /**
   * Fetch user repositories from GitHub API
   * @param {Object} options - Fetch options
   * @param {string} options.sort - Sort by: created, updated, pushed, full_name
   * @param {string} options.direction - Direction: asc, desc
   * @param {number} options.per_page - Results per page (max 100)
   * @param {boolean} options.type - Repository type: all, owner, member
   * @returns {Promise<Array>} Array of repository objects
   */
  async fetchRepositories(options = {}) {
    const {
      sort = "updated",
      direction = "desc",
      per_page = 30,
      type = "owner",
    } = options;

    // Check cache first
    const cachedData = this.getCachedData();
    if (cachedData) {
      return cachedData;
    }

    try {
      const url =
        `${this.baseUrl}/users/${this.username}/repos?` +
        `sort=${sort}&direction=${direction}&per_page=${per_page}&type=${type}`;

      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Personal-Portfolio-Website",
        },
      });

      if (!response.ok) {
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText}`
        );
      }

      const repositories = await response.json();

      // Cache the results
      this.setCachedData(repositories);

      return repositories;
    } catch (error) {
      console.error("Failed to fetch GitHub repositories:", error);
      throw error;
    }
  }

  /**
   * Get featured repositories (most starred, recently updated, etc.)
   * @param {number} limit - Number of repositories to return
   * @returns {Promise<Array>} Array of featured repository objects
   */
  async getFeaturedRepositories(limit = 6) {
    try {
      const repositories = await this.fetchRepositories({
        sort: "updated",
        direction: "desc",
        per_page: 50,
      });

      // Filter out forks and select most interesting repos
      const filteredRepos = repositories
        .filter((repo) => !repo.fork && !repo.archived)
        .filter((repo) => repo.description && repo.description.trim() !== "")
        .sort((a, b) => {
          // Sort by combination of stars and recent activity
          const scoreA = a.stargazers_count * 2 + (a.forks_count || 0);
          const scoreB = b.stargazers_count * 2 + (b.forks_count || 0);
          return scoreB - scoreA;
        });

      return filteredRepos
        .slice(0, limit)
        .map((repo) => this.transformRepository(repo));
    } catch (error) {
      console.error("Failed to get featured repositories:", error);
      // Return fallback data if API fails
      return this.getFallbackRepositories();
    }
  }

  /**
   * Transform GitHub API repository object to our internal format
   * @param {Object} repo - GitHub repository object
   * @returns {Object} Transformed repository object
   */
  transformRepository(repo) {
    return {
      id: repo.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      name: repo.name,
      description: repo.description || "No description available",
      technologies:
        repo.topics && repo.topics.length > 0
          ? repo.topics.map((topic) => this.formatTechnology(topic))
          : [repo.language].filter(Boolean),
      language: repo.language || "Unknown",
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      status: this.getRepositoryStatus(repo),
      github: repo.html_url,
      demo: repo.homepage || null,
      updated: repo.updated_at,
      created: repo.created_at,
    };
  }

  /**
   * Determine repository status based on GitHub data
   * @param {Object} repo - GitHub repository object
   * @returns {string} Status: active, maintained, archived
   */
  getRepositoryStatus(repo) {
    if (repo.archived) return "archived";

    const lastUpdate = new Date(repo.updated_at);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    if (lastUpdate > sixMonthsAgo) return "active";
    return "maintained";
  }

  /**
   * Format technology/topic names for display
   * @param {string} topic - GitHub topic/tag
   * @returns {string} Formatted technology name
   */
  formatTechnology(topic) {
    const techMap = {
      javascript: "JavaScript",
      typescript: "TypeScript",
      nodejs: "Node.js",
      reactjs: "React",
      vuejs: "Vue.js",
      css3: "CSS3",
      html5: "HTML5",
      python: "Python",
      rust: "Rust",
      docker: "Docker",
      postgresql: "PostgreSQL",
      mongodb: "MongoDB",
      express: "Express.js",
      api: "API",
      "rest-api": "REST API",
      graphql: "GraphQL",
      websockets: "WebSockets",
      gps: "GPS",
      gnss: "GNSS",
    };

    return (
      techMap[topic.toLowerCase()] ||
      topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, " ")
    );
  }

  /**
   * Get cached repository data if still valid
   * @returns {Array|null} Cached repositories or null if expired/missing
   */
  getCachedData() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      if (now - timestamp > this.cacheExpiry) {
        localStorage.removeItem(this.cacheKey);
        return null;
      }

      return data;
    } catch (error) {
      console.warn("Failed to read cache:", error);
      return null;
    }
  }

  /**
   * Cache repository data with timestamp
   * @param {Array} data - Repository data to cache
   */
  setCachedData(data) {
    try {
      const cacheObject = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheObject));
    } catch (error) {
      console.warn("Failed to cache data:", error);
    }
  }

  /**
   * Get fallback repository data when API fails
   * @returns {Array} Fallback repository objects
   */
  getFallbackRepositories() {
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
    ];
  }
}

// Export singleton instance
const githubApi = new GitHubApiService();
export default githubApi;
