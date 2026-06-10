(function () {
  const STORAGE_KEY = "devocional:theme";
  const html = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark") {
      html.setAttribute("data-theme", "dark");
    } else {
      html.removeAttribute("data-theme");
    }
  }

  function getSaved() {
    return localStorage.getItem(STORAGE_KEY) || "light";
  }

  function toggle() {
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
    updateIcon(next);
  }

  function updateIcon(theme) {
    const btn = document.querySelector(".theme-toggle");
    if (btn) btn.textContent = theme === "dark" ? "\u2600" : "\u263E";
  }

  applyTheme(getSaved());

  document.addEventListener("DOMContentLoaded", function () {
    const headerInner = document.querySelector(".header-inner");
    if (!headerInner) return;

    const btn = document.createElement("button");
    btn.className = "theme-toggle";
    btn.type = "button";
    btn.setAttribute("aria-label", "Alternar modo escuro");
    btn.title = "Alternar modo escuro";
    headerInner.appendChild(btn);

    updateIcon(getSaved());
    btn.addEventListener("click", toggle);
  });
})();
