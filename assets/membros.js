const MEMBER_NAME_KEY = "devocional:member:name";
const FAVORITES_KEY = "devocional:favorites";

const accessEl = document.getElementById("members-access");
const dashboardEl = document.getElementById("members-dashboard");

let devotionals = [];

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function devotionalDay(id) {
  return String(id || "").match(/^dia-\d{3}/)?.[0] || id;
}

function devotionalPath(devotional) {
  return `../devocional/${devotionalDay(devotional.id)}/`;
}

function getMemberName() {
  return localStorage.getItem(MEMBER_NAME_KEY) || "";
}

function getFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function getKeys(prefix) {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) keys.push(key);
  }
  return keys.sort();
}

function countNotes() {
  return getKeys("devocional:notes:").filter(key => (localStorage.getItem(key) || "").trim()).length;
}

function getVisitedDates() {
  return getKeys("devocional:visited:").map(key => key.replace("devocional:visited:", ""));
}

function calcStreak(dates) {
  if (!dates.length) return { current: 0, best: 0 };
  const sorted = [...new Set(dates)].sort();
  let best = 1;
  let streak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    if ((curr - prev) / 86400000 === 1) {
      streak++;
    } else {
      best = Math.max(best, streak);
      streak = 1;
    }
  }

  best = Math.max(best, streak);
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const current = sorted.at(-1) === today || sorted.at(-1) === yesterday ? streak : 0;
  return { current, best };
}

function findDevotional(id) {
  return devotionals.find(dev => dev.id === id);
}

function renderAccess() {
  const name = getMemberName();
  if (name) {
    accessEl.innerHTML = "";
    dashboardEl.hidden = false;
    renderDashboard(name);
    return;
  }

  dashboardEl.hidden = true;
  accessEl.innerHTML = `
    <div class="member-login-card">
      <div class="member-login-copy">
        <span class="intro-kicker">Entrar</span>
        <h2>Comece seu painel pessoal</h2>
        <p>Informe seu nome para personalizar a área de membros. Os dados ficam salvos apenas neste navegador.</p>
        <p class="member-security-note">Para uma área com senha real e conteúdo restrito, será necessário integrar autenticação no futuro.</p>
      </div>
      <form id="member-login-form" class="member-login-form">
        <label for="member-name">Seu nome</label>
        <input id="member-name" class="search-input" type="text" placeholder="Ex.: Marco Lima" autocomplete="name" required />
        <button class="btn-export-diary" type="submit">Acessar área</button>
      </form>
    </div>
  `;

  document.getElementById("member-login-form")?.addEventListener("submit", event => {
    event.preventDefault();
    const input = document.getElementById("member-name");
    const value = input.value.trim();
    if (!value) return;
    localStorage.setItem(MEMBER_NAME_KEY, value.slice(0, 80));
    renderAccess();
  });
}

function renderDashboard(name) {
  const favorites = getFavorites();
  const dates = getVisitedDates();
  const streak = calcStreak(dates);
  const notesCount = countNotes();
  const favoriteItems = [...favorites].map(findDevotional).filter(Boolean).slice(0, 5);
  const noteItems = getKeys("devocional:notes:")
    .map(key => ({ id: key.replace("devocional:notes:", ""), text: (localStorage.getItem(key) || "").trim() }))
    .filter(item => item.text)
    .map(item => ({ ...item, devotional: findDevotional(item.id) }))
    .filter(item => item.devotional)
    .slice(0, 5);

  dashboardEl.innerHTML = `
    <div class="members-card member-dashboard-card">
      <div class="members-header">
        <div class="members-avatar">${escapeHtml(name.trim().charAt(0).toUpperCase() || "M")}</div>
        <div>
          <h2>Bem-vindo, ${escapeHtml(name)}</h2>
          <p class="members-sub">Painel pessoal de leitura, oração e crescimento espiritual.</p>
        </div>
        <button id="member-logout" class="members-btn" type="button">Sair</button>
      </div>
      <div class="members-grid member-stats-grid">
        <div class="members-box">
          <span class="members-box-icon">🔥</span>
          <h3>${streak.current} ${streak.current === 1 ? "dia" : "dias"}</h3>
          <p>Sequência atual</p>
        </div>
        <div class="members-box">
          <span class="members-box-icon">📖</span>
          <h3>${dates.length}</h3>
          <p>Dias lidos</p>
        </div>
        <div class="members-box">
          <span class="members-box-icon">❤️</span>
          <h3>${favorites.size}</h3>
          <p>Favoritos</p>
        </div>
        <div class="members-box">
          <span class="members-box-icon">✏️</span>
          <h3>${notesCount}</h3>
          <p>Anotações</p>
        </div>
      </div>
    </div>

    <div class="member-actions-grid">
      <a class="member-action-card" href="../#hoje"><span>☀</span><strong>Devocional de hoje</strong><small>Continue sua leitura diária</small></a>
      <a class="member-action-card" href="../#planos"><span>🔖</span><strong>Planos de leitura</strong><small>Acompanhe seus planos</small></a>
      <a class="member-action-card" href="../biblia/"><span>📚</span><strong>Bíblia local</strong><small>Leia e pesquise a Palavra</small></a>
      <a class="member-action-card" href="../livros/"><span>📘</span><strong>Biblioteca PDF</strong><small>Materiais de estudo</small></a>
    </div>

    <div class="member-content-grid">
      <section class="members-panel member-panel-card">
        <h3>Favoritos recentes</h3>
        ${renderDevotionalList(favoriteItems, "Nenhum favorito salvo ainda.")}
      </section>
      <section class="members-panel member-panel-card">
        <h3>Anotações recentes</h3>
        ${renderNoteList(noteItems)}
      </section>
    </div>

    <div class="member-footer-actions">
      <button id="member-export" class="btn-export-diary" type="button">Exportar minhas anotações</button>
      <span id="member-export-msg" class="export-msg"></span>
    </div>
  `;

  document.getElementById("member-logout")?.addEventListener("click", () => {
    localStorage.removeItem(MEMBER_NAME_KEY);
    renderAccess();
  });
  document.getElementById("member-export")?.addEventListener("click", exportNotes);
}

function renderDevotionalList(items, emptyText) {
  if (!items.length) return `<p class="panel-empty">${escapeHtml(emptyText)}</p>`;
  return `
    <ul>
      ${items.map(dev => `
        <li>
          <span><span class="panel-title">${escapeHtml(dev.title)}</span><br><span class="panel-ref">${escapeHtml(dev.reference)}</span></span>
          <a class="members-btn" href="${devotionalPath(dev)}">Ler</a>
        </li>
      `).join("")}
    </ul>
  `;
}

function renderNoteList(items) {
  if (!items.length) return `<p class="panel-empty">Nenhuma anotação salva ainda.</p>`;
  return `
    <ul>
      ${items.map(item => `
        <li>
          <span><span class="panel-title">${escapeHtml(item.devotional.title)}</span><br><span class="panel-ref">${escapeHtml(item.text.slice(0, 90))}${item.text.length > 90 ? "..." : ""}</span></span>
          <a class="members-btn" href="${devotionalPath(item.devotional)}">Abrir</a>
        </li>
      `).join("")}
    </ul>
  `;
}

function exportNotes() {
  const notes = getKeys("devocional:notes:")
    .map(key => ({ id: key.replace("devocional:notes:", ""), text: (localStorage.getItem(key) || "").trim() }))
    .filter(item => item.text);
  const msg = document.getElementById("member-export-msg");

  if (!notes.length) {
    if (msg) msg.textContent = "Nenhuma anotação encontrada.";
    return;
  }

  const today = new Date().toLocaleDateString("pt-BR");
  let content = `AREA DE MEMBROS - Pr. Marco Lima\nExportado em: ${today}\n${"=".repeat(42)}\n\n`;
  notes.forEach(({ id, text }) => {
    const dev = findDevotional(id);
    content += `${dev ? dev.title : id}\n`;
    if (dev) content += `${dev.reference}\n`;
    content += `${text}\n\n${"=".repeat(42)}\n\n`;
  });

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `area-membros-anotacoes-${today.replace(/\//g, "-")}.txt`;
  link.click();
  URL.revokeObjectURL(url);
  if (msg) msg.textContent = `${notes.length} anotações exportadas.`;
}

async function init() {
  try {
    const response = await fetch("../data/devocionais.json");
    devotionals = await response.json();
  } catch {
    devotionals = [];
  }
  renderAccess();
}

init();
