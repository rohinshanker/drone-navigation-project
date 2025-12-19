/* Team 44 – lightweight JS for nav + lightbox */

(function () {
  const body = document.body;

  // ----------------------------
  // Mobile navigation toggle
  // ----------------------------
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close nav when a link is clicked (mobile)
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ----------------------------
  // Active section highlighting
  // ----------------------------
  const links = Array.from(document.querySelectorAll(".site-nav a"));
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length > 0) {
    const byId = new Map();
    links.forEach((a) => {
      const id = a.getAttribute("href").replace("#", "");
      byId.set(id, a);
    });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.getAttribute("id");
            links.forEach((l) => l.classList.remove("active"));
            const a = byId.get(id);
            if (a) a.classList.add("active");
          }
        });
      },
      { rootMargin: "-35% 0px -60% 0px", threshold: 0.01 }
    );

    sections.forEach((s) => obs.observe(s));
  }

  // ----------------------------
  // Image lightbox
  // ----------------------------
  const lightbox = document.querySelector("#lightbox");
  const lightboxImg = document.querySelector("#lightbox-img");
  const lightboxClose = document.querySelector("#lightbox-close");

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    lightboxImg.alt = "";
  }

  document.querySelectorAll("img.lightbox").forEach((img) => {
    img.addEventListener("click", () => {
      openLightbox(img.getAttribute("src"), img.getAttribute("alt"));
    });
  });

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      // close if user clicks outside the image
      if (e.target === lightbox) closeLightbox();
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // ----------------------------
  // Simple tabs (data-tab)
  // ----------------------------
  document.querySelectorAll(".tab-card").forEach((card) => {
    const buttons = Array.from(card.querySelectorAll(".tab-list button"));
    const panels = Array.from(card.querySelectorAll(".tab-panel"));
    const byId = new Map(panels.map((p) => [p.id.replace("tab-", ""), p]));

    // If no buttons (static card), show all panels or keep active default
    if (buttons.length === 0) {
      panels.forEach((p, idx) => {
        if (idx === 0) p.classList.add("active");
      });
      return;
    }

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.tab;
        if (!key) return;
        buttons.forEach((b) => b.setAttribute("aria-selected", "false"));
        panels.forEach((p) => p.classList.remove("active"));
        btn.setAttribute("aria-selected", "true");
        const panel = byId.get(key);
        if (panel) panel.classList.add("active");
      });
    });
  });
})();
