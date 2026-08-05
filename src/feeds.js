import {
  AUTHOR,
  SITE,
  escapeHtml,
  postUrl,
  renderMarkdown,
  sortPosts,
} from "./render.js";

const STATIC_PAGES = [
  { loc: `${SITE}/`, lastmod: "2026-08-05", priority: "1.0" },
  { loc: `${SITE}/uses/`, lastmod: "2026-03-29", priority: "0.6" },
];

const FEED_TITLE = `${AUTHOR}'s Blog`;
const FEED_SUBTITLE = "Thoughts on software, web development, and open source.";

function timestamp(dateStr) {
  return `${dateStr}T00:00:00Z`;
}

function newestDate(posts, fallback) {
  return posts.length > 0 ? sortPosts(posts)[0].date : fallback;
}

export function renderSitemap(posts) {
  const sorted = sortPosts(posts);
  const blogLastmod = newestDate(posts, "2026-03-25");

  const urls = [
    STATIC_PAGES[0],
    { loc: `${SITE}/blog/`, lastmod: blogLastmod, priority: "0.8" },
    STATIC_PAGES[1],
    ...sorted.map((post) => ({
      loc: postUrl(post.slug),
      lastmod: post.date,
      priority: "0.7",
    })),
  ];

  const body = urls
    .map(
      ({ loc, lastmod, priority }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

export function renderFeed(posts, contentBySlug = {}) {
  const sorted = sortPosts(posts);
  const updated = timestamp(newestDate(posts, "2026-03-25"));

  const entries = sorted
    .map((post) => {
      const url = postUrl(post.slug);
      const markdown = contentBySlug[post.slug];
      const content = markdown
        ? `
    <content type="html">${escapeHtml(renderMarkdown(markdown))}</content>`
        : "";
      const categories = (post.tags || [])
        .map((tag) => `
    <category term="${escapeHtml(tag)}"/>`)
        .join("");

      return `  <entry>
    <title>${escapeHtml(post.title)}</title>
    <link href="${url}"/>
    <id>${url}</id>
    <updated>${timestamp(post.date)}</updated>
    <summary>${escapeHtml(post.description)}</summary>${categories}${content}
  </entry>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeHtml(FEED_TITLE)}</title>
  <subtitle>${escapeHtml(FEED_SUBTITLE)}</subtitle>
  <link href="${SITE}/blog/"/>
  <link rel="self" href="${SITE}/feed.xml"/>
  <id>${SITE}/blog/</id>
  <updated>${updated}</updated>
  <author>
    <name>${escapeHtml(AUTHOR)}</name>
    <uri>${SITE}</uri>
  </author>
${entries}
</feed>
`;
}
