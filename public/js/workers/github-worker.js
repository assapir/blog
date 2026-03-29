const TECH_MAP = {
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

function formatTechnology(topic) {
  return (
    TECH_MAP[topic.toLowerCase()] ||
    topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, " ")
  );
}

function transformRepository(repo) {
  return {
    id: repo.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    name: repo.name,
    description: repo.description || "No description available",
    technologies:
      repo.topics && repo.topics.length > 0
        ? repo.topics.map(formatTechnology)
        : [repo.language].filter(Boolean),
    language: repo.language || "Unknown",
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    github: repo.html_url,
    demo: repo.homepage || null,
  };
}

const CACHE_NAME = "github-repos";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

async function getCached() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match("https://cache.internal/github-repos");
    if (!response) return null;
    const { data, timestamp } = await response.json();
    if (Date.now() - timestamp > CACHE_TTL) {
      await cache.delete("https://cache.internal/github-repos");
      return null;
    }
    return data;
  } catch (e) {
    console.warn("Cache read failed:", e);
    return null;
  }
}

async function setCache(data) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = new Response(
      JSON.stringify({ data, timestamp: Date.now() }),
      { headers: { "Content-Type": "application/json" } }
    );
    await cache.put("https://cache.internal/github-repos", response);
  } catch (e) {
    console.warn("Cache write failed:", e);
  }
}

self.onmessage = async function (e) {
  const { username, limit } = e.data;

  try {
    const cached = await getCached();
    if (cached) {
      self.postMessage({ type: "success", data: cached });
      return;
    }

    const url =
      `https://api.github.com/users/${username}/repos?` +
      `sort=updated&direction=desc&per_page=50&type=owner`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Personal-Portfolio-Website",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repositories = await response.json();

    const featured = repositories
      .filter((repo) => !repo.fork && !repo.archived)
      .filter((repo) => repo.description && repo.description.trim() !== "")
      .sort((a, b) => {
        const scoreA = a.stargazers_count * 2 + (a.forks_count || 0);
        const scoreB = b.stargazers_count * 2 + (b.forks_count || 0);
        return scoreB - scoreA;
      })
      .slice(0, limit)
      .map(transformRepository);

    await setCache(featured);
    self.postMessage({ type: "success", data: featured });
  } catch (error) {
    self.postMessage({ type: "error", message: error.message });
  }
};
