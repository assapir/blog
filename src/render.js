import { marked } from "marked";

marked.use({ renderer: { html: () => "" } });

export const SITE = "https://sapir.io";
export const AUTHOR = "Assaf Sapir";
export const DEFAULT_IMAGE = `${SITE}/images/og-image.png`;
export const LISTING_DESCRIPTION =
  "Posts by Assaf Sapir about software development — TypeScript, Rust, Linux, Kubernetes, the web platform, and problems I caused myself.";

const ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (ch) => ESCAPES[ch]);
}

export function sanitizeSlug(slug) {
  return String(slug ?? "").replace(/[^a-z0-9-]/g, "");
}

export function postUrl(slug) {
  return `${SITE}/blog/${sanitizeSlug(slug)}/`;
}

export function formatDate(dateStr) {
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function renderTags(tags) {
  return (tags || [])
    .map((tag) => `<span class="blog-tag">${escapeHtml(tag)}</span>`)
    .join("");
}

export function sortPosts(posts) {
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function renderMarkdown(markdown) {
  return marked.parse(markdown);
}

function renderCard(post) {
  const slug = sanitizeSlug(post.slug);
  const tags = post.tags || [];

  return `
      <a href="/blog/${slug}/" class="blog-card" data-title="${escapeHtml(post.title)}" data-description="${escapeHtml(post.description)}" data-tags="${escapeHtml(tags.join(","))}">
        <h2 class="blog-card-title">${escapeHtml(post.title)}</h2>
        <div class="blog-card-meta">${formatDate(post.date)}</div>
        <p class="blog-card-description">${escapeHtml(post.description)}</p>
        <div class="blog-card-tags">${renderTags(tags)}</div>
      </a>
    `;
}

function allTags(posts) {
  const tags = new Set();
  posts.forEach((post) => (post.tags || []).forEach((tag) => tags.add(tag)));
  return [...tags].sort();
}

export function renderListing(posts) {
  if (posts.length === 0) {
    return `
        <div class="blog-coming-soon">
          <h2>Coming Soon</h2>
          <p>I'm working on some posts. Stay tuned!</p>
        </div>
      `;
  }

  const sorted = sortPosts(posts);
  const tags = allTags(posts);
  const tagCloud =
    tags.length > 0
      ? `<div class="blog-filter-tags">
              ${tags.map((tag) => `<button class="blog-filter-tag" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`).join("")}
            </div>`
      : "";

  return `
        <div class="blog-header">
          <h1>Blog</h1>
          <p>Thoughts on software, web development, and open source.</p>
        </div>
        <div class="blog-filters">
          <input type="search" id="blogSearch" class="blog-search" placeholder="Search posts..." aria-label="Search blog posts">
          ${tagCloud}
        </div>
        <div class="blog-list">
          ${sorted.map((post) => renderCard(post)).join("")}
        </div>
      `;
}

export function renderPostBody(post, markdown) {
  const html = renderMarkdown(markdown);
  const url = postUrl(post.slug);
  const pageUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(post.title);

  return `
        <a href="/blog/" class="blog-back">&larr; Back to Blog</a>
        <article class="blog-post">
          <header class="blog-post-header">
            <h1>${escapeHtml(post.title)}</h1>
            <div class="blog-post-meta"><time datetime="${escapeHtml(post.date)}">${formatDate(post.date)}</time></div>
            <div class="blog-post-tags">${renderTags(post.tags)}</div>
          </header>
          <div class="blog-post-content">
            ${html}
          </div>
          <div class="blog-share">
            <span class="blog-share-label">Share this post</span>
            <div class="blog-share-buttons">
              <a href="https://twitter.com/intent/tweet?url=${pageUrl}&amp;text=${shareTitle}" target="_blank" rel="noopener noreferrer" class="blog-share-btn" aria-label="Share on Twitter">Twitter</a>
              <a href="https://www.linkedin.com/shareArticle?mini=true&amp;url=${pageUrl}&amp;title=${shareTitle}" target="_blank" rel="noopener noreferrer" class="blog-share-btn" aria-label="Share on LinkedIn">LinkedIn</a>
              <button class="blog-share-btn" id="copyLinkBtn" aria-label="Copy link to clipboard">Copy Link</button>
            </div>
          </div>
        </article>
      `;
}

export function renderNotFoundBody() {
  return `
        <div class="blog-error">
          <h2>Post not found</h2>
          <p>The post you're looking for doesn't exist.</p>
          <a href="/blog/" class="blog-back">Back to Blog</a>
        </div>
      `;
}

function jsonLdScript(data) {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

export function listingMeta(posts) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Blog - ${AUTHOR}`,
    description: LISTING_DESCRIPTION,
    url: `${SITE}/blog/`,
    author: { "@type": "Person", name: AUTHOR, url: SITE },
    blogPost: sortPosts(posts).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url: postUrl(post.slug),
    })),
  };

  return {
    title: `Blog - ${AUTHOR}`,
    description: LISTING_DESCRIPTION,
    canonical: `${SITE}/blog/`,
    ogType: "website",
    image: DEFAULT_IMAGE,
    head: jsonLdScript(jsonLd),
  };
}

export function postMeta(post) {
  const url = postUrl(post.slug);
  const image = post.image ? new URL(post.image, SITE).href : DEFAULT_IMAGE;
  const published = `${post.date}T00:00:00Z`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: published,
    dateModified: published,
    url,
    image,
    keywords: (post.tags || []).join(", "),
    author: { "@type": "Person", name: AUTHOR, url: SITE },
    publisher: { "@type": "Person", name: AUTHOR, url: SITE },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@type": "Blog", name: `Blog - ${AUTHOR}`, url: `${SITE}/blog/` },
  };

  const articleTags = (post.tags || [])
    .map((tag) => `<meta property="article:tag" content="${escapeHtml(tag)}">`)
    .join("");

  return {
    title: `${post.title} - ${AUTHOR}`,
    description: post.description,
    canonical: url,
    ogType: "article",
    image,
    head: [
      `<meta property="article:published_time" content="${published}">`,
      `<meta property="article:author" content="${escapeHtml(AUTHOR)}">`,
      articleTags,
      jsonLdScript(jsonLd),
    ].join(""),
  };
}

export function notFoundMeta() {
  return {
    title: `Post not found - ${AUTHOR}`,
    description: "The post you're looking for doesn't exist.",
    canonical: `${SITE}/blog/`,
    ogType: "website",
    image: DEFAULT_IMAGE,
    head: `<meta name="robots" content="noindex">`,
  };
}
