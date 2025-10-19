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
