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
    return localStorage.getItem(STORAGE_KEY);
  }

  function getSystemPreference() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function getInitialTheme() {
    const saved = getSaved();
    if (saved) return saved;
    return getSystemPreference();
  }

  function toggle() {
    const current = html.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
    updateIcon(next);
  }

  function updateIcon(theme) {
    const btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.innerHTML = theme === "dark"
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      btn.setAttribute("aria-label", theme === "dark" ? "Alternar para modo claro" : "Alternar para modo escuro");
    }
  }

  applyTheme(getInitialTheme());

  document.addEventListener("DOMContentLoaded", function () {
    const headerInner = document.querySelector(".header-inner");
    if (!headerInner) return;

    const btn = document.createElement("button");
    btn.className = "theme-toggle";
    btn.type = "button";
    btn.setAttribute("aria-label", "Alternar modo escuro");
    btn.title = "Alternar modo escuro";
    headerInner.appendChild(btn);

    updateIcon(getInitialTheme());
    btn.addEventListener("click", toggle);

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
      if (!getSaved()) {
        applyTheme(e.matches ? "dark" : "light");
        updateIcon(e.matches ? "dark" : "light");
      }
    });
  });
})();
