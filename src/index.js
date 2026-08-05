import { renderFeed, renderSitemap } from "./feeds.js";
import {
  listingMeta,
  notFoundMeta,
  postMeta,
  renderListing,
  renderNotFoundBody,
  renderPostBody,
} from "./render.js";

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const HTML_CACHE = "public, max-age=0, s-maxage=3600, must-revalidate";
const XML_CACHE = "public, max-age=0, s-maxage=3600, must-revalidate";

async function loadPosts(env, url) {
  const response = await env.ASSETS.fetch(new URL("/posts/posts.json", url));
  if (!response.ok) throw new Error("posts.json unavailable");
  return response.json();
}

async function loadMarkdown(env, url, slug) {
  const response = await env.ASSETS.fetch(new URL(`/posts/${slug}.md`, url));
  return response.ok ? response.text() : null;
}

function redirect(location, status = 301) {
  return new Response(null, { status, headers: { location } });
}

async function renderShell(env, url, meta, body, status = 200) {
  const shell = await env.ASSETS.fetch(new URL("/blog/index.html", url));

  const setContent = (value) => ({
    element(element) {
      element.setAttribute("content", value);
    },
  });

  const rewritten = new HTMLRewriter()
    .on("title", {
      element(element) {
        element.setInnerContent(meta.title);
      },
    })
    .on('meta[name="description"]', setContent(meta.description))
    .on('meta[property="og:title"]', setContent(meta.title))
    .on('meta[property="og:description"]', setContent(meta.description))
    .on('meta[property="og:type"]', setContent(meta.ogType))
    .on('meta[property="og:url"]', setContent(meta.canonical))
    .on('meta[property="og:image"]', setContent(meta.image))
    .on('meta[name="twitter:title"]', setContent(meta.title))
    .on('meta[name="twitter:description"]', setContent(meta.description))
    .on('meta[name="twitter:image"]', setContent(meta.image))
    .on('link[rel="canonical"]', {
      element(element) {
        element.setAttribute("href", meta.canonical);
      },
    })
    .on("head", {
      element(element) {
        element.append(meta.head, { html: true });
      },
    })
    .on("blog-page", {
      element(element) {
        element.setInnerContent(body, { html: true });
      },
    })
    .transform(shell);

  return new Response(rewritten.body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": status === 200 ? HTML_CACHE : "no-store",
    },
  });
}

async function handleSitemap(env, url) {
  const posts = await loadPosts(env, url);
  return new Response(renderSitemap(posts), {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": XML_CACHE,
    },
  });
}

async function handleFeed(env, url) {
  const posts = await loadPosts(env, url);
  const contentBySlug = {};

  await Promise.all(
    posts.map(async (post) => {
      const markdown = await loadMarkdown(env, url, post.slug);
      if (markdown) contentBySlug[post.slug] = markdown;
    })
  );

  return new Response(renderFeed(posts, contentBySlug), {
    headers: {
      "content-type": "application/atom+xml; charset=utf-8",
      "cache-control": XML_CACHE,
    },
  });
}

async function handleBlog(env, url, pathname) {
  if (pathname === "/blog") return redirect("/blog/");

  if (pathname === "/blog/") {
    const posts = await loadPosts(env, url);
    return renderShell(env, url, listingMeta(posts), renderListing(posts));
  }

  const rest = pathname.slice("/blog/".length);
  const slug = rest.endsWith("/") ? rest.slice(0, -1) : rest;

  if (!SLUG_PATTERN.test(slug)) return null;
  if (!rest.endsWith("/")) return redirect(`/blog/${slug}/`);

  const posts = await loadPosts(env, url);
  const post = posts.find((entry) => entry.slug === slug);
  if (!post) {
    return renderShell(env, url, notFoundMeta(), renderNotFoundBody(), 404);
  }

  const markdown = await loadMarkdown(env, url, slug);
  if (markdown === null) {
    return renderShell(env, url, notFoundMeta(), renderNotFoundBody(), 404);
  }

  return renderShell(env, url, postMeta(post), renderPostBody(post, markdown));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "www.sapir.io") {
      return redirect(`https://sapir.io${url.pathname}${url.search}`);
    }

    try {
      if (url.pathname === "/sitemap.xml") return await handleSitemap(env, url);
      if (url.pathname === "/feed.xml") return await handleFeed(env, url);

      if (url.pathname === "/blog" || url.pathname.startsWith("/blog/")) {
        const response = await handleBlog(env, url, url.pathname);
        if (response) return response;
      }
    } catch {
      return env.ASSETS.fetch(request);
    }

    return env.ASSETS.fetch(request);
  },
};
