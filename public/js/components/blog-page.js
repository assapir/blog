class BlogPage extends HTMLElement {
  connectedCallback() {
    if (this.redirectLegacyHash()) return;
    this.setupListingInteractions();
    this.setupShare();
  }

  redirectLegacyHash() {
    const slug = window.location.hash.slice(1);
    if (!/^[a-z0-9-]+$/.test(slug)) return false;
    if (!this.querySelector(`.blog-card[href="/blog/${slug}/"]`)) return false;

    window.location.replace(`/blog/${slug}/`);
    return true;
  }

  matchesQuery(card, query) {
    if (!query) return true;
    const haystack = [
      card.dataset.title,
      card.dataset.description,
      card.dataset.tags,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query.toLowerCase());
  }

  matchesTag(card, activeTag) {
    if (!activeTag) return true;
    return (card.dataset.tags || "").split(",").includes(activeTag);
  }

  setupListingInteractions() {
    const blogList = this.querySelector(".blog-list");
    if (!blogList) return;

    const searchInput = this.querySelector("#blogSearch");
    const tagButtons = this.querySelectorAll(".blog-filter-tag");
    const cards = [...this.querySelectorAll(".blog-card")];
    let activeTag = null;

    const emptyState = document.createElement("p");
    emptyState.className = "blog-no-results";
    emptyState.textContent = "No posts found.";
    emptyState.hidden = true;
    blogList.appendChild(emptyState);

    const updateList = () => {
      const query = searchInput ? searchInput.value : "";
      let visible = 0;

      cards.forEach((card) => {
        const show =
          this.matchesQuery(card, query) && this.matchesTag(card, activeTag);
        card.hidden = !show;
        if (show) visible += 1;
      });

      emptyState.hidden = visible > 0;
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

  setupShare() {
    const copyBtn = this.querySelector("#copyLinkBtn");
    if (!copyBtn) return;

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
  }
}

customElements.define("blog-page", BlogPage);
