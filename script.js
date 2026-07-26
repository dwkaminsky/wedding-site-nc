const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const tabs = [...nav.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll("[data-tab-panel]")];

toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("open", !open);
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

function activateTab(id, updateHistory = false) {
  const panel = panels.find((item) => item.id === id) || panels[0];

  panels.forEach((item) => {
    const active = item === panel;
    item.hidden = !active;
    item.setAttribute("aria-hidden", String(!active));
  });

  tabs.forEach((tab) => {
    const active = tab.getAttribute("aria-controls") === panel.id;
    tab.setAttribute("aria-selected", String(active));
    tab.setAttribute("tabindex", active ? "0" : "-1");
  });

  if (updateHistory && window.location.hash !== `#${panel.id}`) {
    history.pushState(null, "", `#${panel.id}`);
  }

  window.scrollTo({ top: 0, behavior: "auto" });
  document.title = panel.id === "home"
    ? "Danny & Caitlin — 05.22.2027"
    : `${panel.id === "weekend" ? "Schedule" : panel.id[0].toUpperCase() + panel.id.slice(1)} — Danny & Caitlin`;
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", (event) => {
    event.preventDefault();
    activateTab(tab.getAttribute("aria-controls"), true);
  });

  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    tabs[next].focus();
    activateTab(tabs[next].getAttribute("aria-controls"), true);
  });
});

document.querySelectorAll('main a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href").slice(1);
    if (!panels.some((panel) => panel.id === id)) return;
    event.preventDefault();
    activateTab(id, true);
  });
});

window.addEventListener("popstate", () => activateTab(window.location.hash.slice(1)));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

activateTab(window.location.hash.slice(1) || "home");
