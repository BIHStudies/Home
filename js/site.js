// NEW: Fix anchor jump only for #Guidelines (Library page)
function fixGuidelinesAnchorAfterHeaderLoads() {
  // Run only if the URL hash is exactly #Guidelines
  if (location.hash !== "#Guidelines") return;

  const target = document.getElementById("Guidelines");
  if (!target) return;

  // Find the injected header via the site navigation
  const headerNav = document.querySelector(".site-nav");
  if (!headerNav) return;

  const headerEl = headerNav.closest("header") || headerNav.parentElement;
  if (!headerEl) return;

  const headerHeight = Math.ceil(headerEl.getBoundingClientRect().height);

  // Small buffer so the title is clearly visible
const buffer = 12;

const top =
  target.getBoundingClientRect().top +
  window.pageYOffset -
  headerHeight -
  buffer;

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    window.scrollTo({ top, left: 0, behavior: "auto" });
  });
});
}

async function loadPart(targetId, file) {
  try {
    const res = await fetch(file, { cache: "no-store" });
    if (!res.ok) throw new Error(res.status + " " + res.statusText);
    document.getElementById(targetId).outerHTML = await res.text();

    // After header loads, mark active nav link
    if (file === "header.html") {
      const here = location.pathname.split("/").pop() || "index.html";
      const links = document.querySelectorAll(".site-nav a");
      links.forEach(a => {
        const href = a.getAttribute("href");
        if (href === here) a.classList.add("active");
      });
      fixGuidelinesAnchorAfterHeaderLoads(); // NEW
    }
  } catch (e) {
    console.error("Include failed for", file, e);
  }
}

// Kick off includes after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const footer = document.getElementById("footer");
  if (header) loadPart("header", "header.html");
  if (footer) loadPart("footer", "footer.html");
});
