import { marked } from "https://esm.sh/marked@15";

// Disable raw HTML passthrough in markdown to prevent XSS
marked.use({ renderer: { html: (token) => "" } });

class BlogPage extends HTMLElement {
  constructor() {
    super();
    this.posts = [];
    this.onHashChange = () => this.loadContent();
  }

  connectedCallback() {
    this.render();
    this.loadContent();
    window.addEventListener("hashchange", this.onHashChange);
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this.onHashChange);
  }

  render() {
    this.innerHTML = `
      <div class="blog-page container">
        <div id="blogContent">
          <div class="blog-loading">Loading...</div>
        </div>
      </div>
    `;
  }

  escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  formatDate(dateStr) {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  renderTags(tags) {
    return (tags || [])
      .map((tag) => `<span class="blog-tag">${this.escapeHtml(tag)}</span>`)
      .join("");
  }

  async loadContent() {
    const slug = window.location.hash.slice(1).replace(/[^a-z0-9-]/g, "");

    if (slug) {
      // Ensure posts are loaded so we can check if the hash is a valid slug
      if (this.posts.length === 0) {
        try {
          const response = await fetch("/posts/posts.json");
          if (response.ok) this.posts = await response.json();
        } catch {
          // Will be handled by loadPost/loadListing
        }
      }

      const isKnownPost = this.posts.some((p) => p.slug === slug);
      if (isKnownPost) {
        await this.loadPost(slug);
        window.scrollTo({ top: 0 });
        return;
      }
      // Unknown hash (e.g. in-page anchor) — ignore, let browser handle it
    }

    await this.loadListing();
    window.scrollTo({ top: 0 });
  }

  getAllTags() {
    const tags = new Set();
    this.posts.forEach((post) =>
      (post.tags || []).forEach((tag) => tags.add(tag))
    );
    return [...tags].sort();
  }

  filterPosts(posts, query, activeTag) {
    return posts.filter((post) => {
      const matchesTag = !activeTag || (post.tags || []).includes(activeTag);
      if (!query) return matchesTag;
      const q = query.toLowerCase();
      const matchesQuery =
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        (post.tags || []).some((t) => t.toLowerCase().includes(q));
      return matchesQuery && matchesTag;
    });
  }

  setupListingInteractions(sorted) {
    const searchInput = this.querySelector("#blogSearch");
    const tagButtons = this.querySelectorAll(".blog-filter-tag");
    const blogList = this.querySelector(".blog-list");
    let activeTag = null;

    const updateList = () => {
      const query = searchInput ? searchInput.value : "";
      const filtered = this.filterPosts(sorted, query, activeTag);
      if (filtered.length === 0) {
        blogList.innerHTML = `<p class="blog-no-results">No posts found.</p>`;
      } else {
        blogList.innerHTML = filtered
          .map((post) => this.renderCard(post))
          .join("");
      }
    };

    if (searchInput) {
      searchInput.addEventListener("input", updateList);
    }

    tagButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tag = btn.dataset.tag;
        if (activeTag === tag) {
          activeTag = null;
          btn.classList.remove("active");
        } else {
          tagButtons.forEach((b) => b.classList.remove("active"));
          activeTag = tag;
          btn.classList.add("active");
        }
        updateList();
      });
    });
  }

  async loadListing() {
    document.title = "Blog - Assaf Sapir";
    const content = this.querySelector("#blogContent");
    try {
      if (this.posts.length === 0) {
        const response = await fetch("/posts/posts.json");
        if (!response.ok) throw new Error("Failed to load posts");
        this.posts = await response.json();
      }

      if (this.posts.length === 0) {
        content.innerHTML = `
          <div class="blog-coming-soon">
            <h2>Coming Soon</h2>
            <p>I'm working on some posts. Stay tuned!</p>
          </div>
        `;
        return;
      }

      const sorted = [...this.posts].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      const allTags = this.getAllTags();
      const tagCloud =
        allTags.length > 0
          ? `<div class="blog-filter-tags">
              ${allTags.map((tag) => `<button class="blog-filter-tag" data-tag="${this.escapeHtml(tag)}">${this.escapeHtml(tag)}</button>`).join("")}
            </div>`
          : "";

      content.innerHTML = `
        <div class="blog-header">
          <h1>Blog</h1>
          <p>Thoughts on software, web development, and open source.</p>
        </div>
        <div class="blog-filters">
          <input type="search" id="blogSearch" class="blog-search" placeholder="Search posts..." aria-label="Search blog posts">
          ${tagCloud}
        </div>
        <div class="blog-list">
          ${sorted.map((post) => this.renderCard(post)).join("")}
        </div>
      `;

      this.setupListingInteractions(sorted);
    } catch {
      content.innerHTML = `
        <div class="blog-error">
          <h2>Something went wrong</h2>
          <p>Could not load blog posts. Please try again later.</p>
        </div>
      `;
    }
  }

  renderCard(post) {
    const date = this.formatDate(post.date);
    const tags = this.renderTags(post.tags);
    const title = this.escapeHtml(post.title);
    const description = this.escapeHtml(post.description);
    const slug = post.slug.replace(/[^a-z0-9-]/g, "");

    return `
      <a href="/blog/#${slug}" class="blog-card">
        <h2 class="blog-card-title">${title}</h2>
        <div class="blog-card-meta">${date}</div>
        <p class="blog-card-description">${description}</p>
        <div class="blog-card-tags">${tags}</div>
      </a>
    `;
  }

  async loadPost(slug) {
    const content = this.querySelector("#blogContent");
    try {
      if (this.posts.length === 0) {
        const metaResponse = await fetch("/posts/posts.json");
        if (metaResponse.ok) {
          this.posts = await metaResponse.json();
        }
      }

      const response = await fetch(`/posts/${slug}.md`);
      if (!response.ok) {
        content.innerHTML = `
          <div class="blog-error">
            <h2>Post not found</h2>
            <p>The post you're looking for doesn't exist.</p>
            <a href="/blog/" class="blog-back">Back to Blog</a>
          </div>
        `;
        return;
      }

      const markdown = await response.text();
      const html = marked.parse(markdown);

      const meta = this.posts.find((p) => p.slug === slug);
      const date = meta ? this.formatDate(meta.date) : "";
      const tags = meta ? this.renderTags(meta.tags) : "";
      const title = meta ? this.escapeHtml(meta.title) : "";

      const pageUrl = encodeURIComponent(window.location.href);
      const shareTitle = encodeURIComponent(meta ? meta.title : "Blog Post");

      content.innerHTML = `
        <a href="/blog/" class="blog-back">&larr; Back to Blog</a>
        <article class="blog-post">
          <header class="blog-post-header">
            ${title ? `<h1>${title}</h1>` : ""}
            ${date ? `<div class="blog-post-meta">${date}</div>` : ""}
            ${tags ? `<div class="blog-post-tags">${tags}</div>` : ""}
          </header>
          <div class="blog-post-content">
            ${html}
          </div>
          <div class="blog-share">
            <span class="blog-share-label">Share this post</span>
            <div class="blog-share-buttons">
              <a href="https://twitter.com/intent/tweet?url=${pageUrl}&text=${shareTitle}" target="_blank" rel="noopener noreferrer" class="blog-share-btn" aria-label="Share on Twitter">Twitter</a>
              <a href="https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${shareTitle}" target="_blank" rel="noopener noreferrer" class="blog-share-btn" aria-label="Share on LinkedIn">LinkedIn</a>
              <button class="blog-share-btn" id="copyLinkBtn" aria-label="Copy link to clipboard">Copy Link</button>
            </div>
          </div>
        </article>
      `;

      const copyBtn = content.querySelector("#copyLinkBtn");
      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          copyBtn.textContent = "Copied!";
          setTimeout(() => (copyBtn.textContent = "Copy Link"), 2000);
        } catch {
          copyBtn.textContent = "Failed";
          setTimeout(() => (copyBtn.textContent = "Copy Link"), 2000);
        }
      });

      if (meta) {
        document.title = `${meta.title} - Assaf Sapir`;
      }
    } catch {
      content.innerHTML = `
        <div class="blog-error">
          <h2>Something went wrong</h2>
          <p>Could not load this post. Please try again later.</p>
          <a href="/blog/" class="blog-back">Back to Blog</a>
        </div>
      `;
    }
  }
}

customElements.define("blog-page", BlogPage);
