const MEMBER_ACCOUNT_KEY = "devocional:member:account";
const MEMBER_SESSION_KEY = "devocional:member:active";
const FAVORITES_KEY = "devocional:favorites";
const BIBLE_HIGHLIGHTS_KEY = "devocional:bible-highlights";

const accessEl = document.getElementById("members-access");
const dashboardEl = document.getElementById("members-dashboard");

let devotionals = [];
let authMode = "register";

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

async function hashText(value) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, "0")).join("");
}

function getAccount() {
  try {
    return JSON.parse(localStorage.getItem(MEMBER_ACCOUNT_KEY) || "null");
  } catch {
    return null;
  }
}

function saveAccount(account) {
  localStorage.setItem(MEMBER_ACCOUNT_KEY, JSON.stringify(account));
  localStorage.setItem(MEMBER_SESSION_KEY, "1");
}

function isSessionActive() {
  return localStorage.getItem(MEMBER_SESSION_KEY) === "1";
}

function clearSession() {
  localStorage.removeItem(MEMBER_SESSION_KEY);
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

function getBibleHighlights() {
  try {
    const highlights = JSON.parse(localStorage.getItem(BIBLE_HIGHLIGHTS_KEY) || "{}");
    return Object.values(highlights).sort((a, b) => (a.at || "").localeCompare(b.at || "")).reverse();
  } catch {
    return [];
  }
}

function highlightRef(h) {
  return `${h.bookName} ${h.chapter}:${h.verse}`;
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

function renderAccess(message = "") {
  dashboardEl.hidden = true;
  const isRegister = authMode === "register";
  const hasAccount = Boolean(getAccount());

  accessEl.innerHTML = `
    <div class="member-login-card">
      <div class="member-login-copy">
        <span class="intro-kicker">${isRegister ? "Cadastro local" : "Entrar"}</span>
        <h2>${isRegister ? "Crie seu acesso de membro" : "Acesse sua área de membro"}</h2>
        <p>${isRegister ? "Cadastre nome, e-mail e senha. Os dados ficam salvos neste navegador e podem ser exportados em arquivo texto." : "Entre com o e-mail e senha cadastrados neste navegador."}</p>
        <p class="member-security-note">Sem banco de dados: este cadastro não cria usuário em servidor e não funciona em outro aparelho automaticamente.</p>
      </div>
      <form id="member-auth-form" class="member-login-form">
        <div class="member-auth-tabs" role="tablist" aria-label="Cadastro de membros">
          <button class="member-auth-tab ${isRegister ? "member-auth-tab-active" : ""}" type="button" data-mode="register">Cadastrar</button>
          <button class="member-auth-tab ${!isRegister ? "member-auth-tab-active" : ""}" type="button" data-mode="login" ${hasAccount ? "" : "disabled"}>Entrar</button>
        </div>
        ${isRegister ? `
          <label for="member-name">Nome</label>
          <input id="member-name" class="search-input" type="text" placeholder="Seu nome" autocomplete="name" required />
        ` : ""}
        <label for="member-email">E-mail</label>
        <input id="member-email" class="search-input" type="email" placeholder="voce@email.com" autocomplete="email" required />
        <label for="member-password">Senha</label>
        <input id="member-password" class="search-input" type="password" placeholder="Mínimo 8 caracteres" autocomplete="${isRegister ? "new-password" : "current-password"}" required minlength="8" />
        <button class="btn-export-diary" type="submit">${isRegister ? "Criar cadastro local" : "Entrar"}</button>
        <span id="member-auth-msg" class="member-auth-msg">${escapeHtml(message)}</span>
      </form>
    </div>
  `;

  accessEl.querySelectorAll(".member-auth-tab").forEach(button => {
    button.addEventListener("click", () => {
      if (button.disabled) return;
      authMode = button.dataset.mode;
      renderAccess();
    });
  });

  document.getElementById("member-auth-form")?.addEventListener("submit", handleAuthSubmit);
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const msg = document.getElementById("member-auth-msg");
  const isRegister = authMode === "register";
  const email = document.getElementById("member-email").value.trim().toLowerCase();
  const password = document.getElementById("member-password").value;

  if (password.length < 8) {
    if (msg) msg.textContent = "A senha precisa ter pelo menos 8 caracteres.";
    return;
  }

  if (isRegister) {
    const name = document.getElementById("member-name").value.trim();
    if (name.length < 2) {
      if (msg) msg.textContent = "Informe seu nome.";
      return;
    }

    const account = {
      name: name.slice(0, 80),
      email,
      passwordHash: await hashText(`${email}:${password}`),
      createdAt: new Date().toISOString(),
    };
    saveAccount(account);
    accessEl.innerHTML = "";
    dashboardEl.hidden = false;
    renderDashboard(account);
    return;
  }

  const account = getAccount();
  const passwordHash = await hashText(`${email}:${password}`);
  if (!account || account.email !== email || account.passwordHash !== passwordHash) {
    if (msg) msg.textContent = "E-mail ou senha inválidos neste navegador.";
    return;
  }

  localStorage.setItem(MEMBER_SESSION_KEY, "1");
  accessEl.innerHTML = "";
  dashboardEl.hidden = false;
  renderDashboard(account);
}

function renderDashboard(account) {
  const favorites = getFavorites();
  const dates = getVisitedDates();
  const streak = calcStreak(dates);
  const notesCount = countNotes();
  const highlights = getBibleHighlights();
  const favoriteItems = [...favorites].map(findDevotional).filter(Boolean).slice(0, 5);
  const noteItems = getKeys("devocional:notes:")
    .map(key => ({ id: key.replace("devocional:notes:", ""), text: (localStorage.getItem(key) || "").trim() }))
    .filter(item => item.text)
    .map(item => ({ ...item, devotional: findDevotional(item.id) }))
    .filter(item => item.devotional)
    .slice(0, 5);
  const createdAt = account.createdAt ? new Date(account.createdAt).toLocaleDateString("pt-BR") : "—";

  dashboardEl.innerHTML = `
    <div class="members-card member-dashboard-card">
      <div class="members-header">
        <div class="members-avatar">${escapeHtml(account.name.trim().charAt(0).toUpperCase() || "M")}</div>
        <div>
          <h2>Bem-vindo, ${escapeHtml(account.name)}</h2>
          <p class="members-sub">${escapeHtml(account.email)} · cadastro local criado em ${escapeHtml(createdAt)}</p>
        </div>
        <button id="member-logout" class="members-btn" type="button">Sair</button>
      </div>
      <div class="members-grid member-stats-grid">
        <div class="members-box"><span class="members-box-icon">🔥</span><h3>${streak.current} ${streak.current === 1 ? "dia" : "dias"}</h3><p>Sequência atual</p></div>
        <div class="members-box"><span class="members-box-icon">📖</span><h3>${dates.length}</h3><p>Dias lidos</p></div>
        <div class="members-box"><span class="members-box-icon">❤️</span><h3>${favorites.size}</h3><p>Favoritos</p></div>
        <div class="members-box"><span class="members-box-icon">✏️</span><h3>${notesCount}</h3><p>Anotações</p></div>
        <div class="members-box"><span class="members-box-icon">🖍️</span><h3>${highlights.length}</h3><p>Versículos marcados</p></div>
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

    <section class="members-panel member-panel-card member-highlights-panel">
      <h3>Versículos marcados</h3>
      ${renderHighlightList(highlights.slice(0, 8))}
    </section>

    <div class="member-footer-actions">
      <button id="member-export" class="btn-export-diary" type="button">Exportar minhas anotações</button>
      <button id="member-export-highlights" class="btn-export-diary" type="button">Exportar versículos marcados</button>
      <button id="member-export-account" class="members-btn" type="button">Exportar cadastro .txt</button>
      <span id="member-export-msg" class="export-msg"></span>
    </div>
  `;

  document.getElementById("member-logout")?.addEventListener("click", () => {
    clearSession();
    authMode = "login";
    renderAccess("Você saiu da área de membros.");
  });
  document.getElementById("member-export")?.addEventListener("click", exportNotes);
  document.getElementById("member-export-highlights")?.addEventListener("click", exportHighlights);
  document.getElementById("member-export-account")?.addEventListener("click", exportAccount);
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

function downloadText(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportNotes() {
  const notes = getKeys("devocional:notes:")
    .map(key => ({ id: key.replace("devocional:notes:", ""), text: (localStorage.getItem(key) || "").trim() }))
    .filter(item => item.text);
  const highlights = getBibleHighlights();
  const msg = document.getElementById("member-export-msg");

  if (!notes.length && !highlights.length) {
    if (msg) msg.textContent = "Nenhuma anotação ou versículo marcado encontrado.";
    return;
  }

  const today = new Date().toLocaleDateString("pt-BR");
  let content = `AREA DE MEMBROS - Pr. Marco Lima\nExportado em: ${today}\n${"=".repeat(42)}\n\n`;

  if (notes.length) {
    content += `--- ANOTAÇÕES ---\n\n`;
    notes.forEach(({ id, text }) => {
      const dev = findDevotional(id);
      content += `${dev ? dev.title : id}\n`;
      if (dev) content += `${dev.reference}\n`;
      content += `${text}\n\n${"-".repeat(42)}\n\n`;
    });
  }

  if (highlights.length) {
    content += `--- VERSÍCULOS MARCADOS ---\n\n`;
    highlights.forEach(h => {
      content += `${h.bookName} ${h.chapter}:${h.verse}\n`;
      content += `${h.text}\n`;
      content += `Marcado em: ${h.at ? new Date(h.at).toLocaleString("pt-BR") : "—"}\n\n${"-".repeat(42)}\n\n`;
    });
  }

  downloadText(`area-membros-dados-${today.replace(/\//g, "-")}.txt`, content);
  if (msg) msg.textContent = `${notes.length} anotações e ${highlights.length} versículos exportados.`;
}

function exportAccount() {
  const account = getAccount();
  const msg = document.getElementById("member-export-msg");
  if (!account) return;

  const createdAt = account.createdAt ? new Date(account.createdAt).toLocaleString("pt-BR") : "—";
  const content = [
    "CADASTRO LOCAL - AREA DE MEMBROS",
    "Pr. Marco Lima",
    "",
    `Nome: ${account.name}`,
    `E-mail: ${account.email}`,
    `Criado em: ${createdAt}`,
    "",
    "Observação: este arquivo é apenas um comprovante/exportação local. A senha não é exportada.",
  ].join("\n");

  downloadText(`cadastro-membro-${account.email.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.txt`, content);
  if (msg) msg.textContent = "Cadastro exportado em arquivo texto.";
}

function renderHighlightList(items) {
  if (!items.length) return `<p class="panel-empty">Nenhum versículo marcado ainda. Abra a Bíblia e clique em um versículo para marcar.</p>`;
  return `
    <ul>
      ${items.map(h => `
        <li>
          <span>
            <span class="panel-title">${escapeHtml(h.bookName)} ${h.chapter}:${h.verse}</span><br>
            <span class="panel-ref">${escapeHtml(h.text.length > 100 ? h.text.slice(0, 100) + "..." : h.text)}</span>
          </span>
          <a class="members-btn" href="../biblia/?livro=${h.book}&capitulo=${h.chapter}&versiculo=${h.verse}">Ler</a>
        </li>
      `).join("")}
    </ul>
  `;
}

function exportHighlights() {
  const highlights = getBibleHighlights();
  const msg = document.getElementById("member-export-msg");

  if (!highlights.length) {
    if (msg) msg.textContent = "Nenhum versículo marcado encontrado.";
    return;
  }

  const today = new Date().toLocaleDateString("pt-BR");
  let content = `AREA DE MEMBROS - Pr. Marco Lima\nVersículos Marcados\nExportado em: ${today}\n${"=".repeat(42)}\n\n`;
  highlights.forEach(h => {
    content += `${h.bookName} ${h.chapter}:${h.verse}\n`;
    content += `${h.text}\n`;
    content += `Marcado em: ${h.at ? new Date(h.at).toLocaleString("pt-BR") : "—"}\n\n${"=".repeat(42)}\n\n`;
  });

  downloadText(`versiculos-marcados-${today.replace(/\//g, "-")}.txt`, content);
  if (msg) msg.textContent = `${highlights.length} versículos marcados exportados.`;
}

async function init() {
  try {
    const response = await fetch("../data/devocionais.json");
    devotionals = await response.json();
  } catch {
    devotionals = [];
  }

  const account = getAccount();
  if (account && isSessionActive()) {
    accessEl.innerHTML = "";
    dashboardEl.hidden = false;
    renderDashboard(account);
  } else {
    authMode = account ? "login" : "register";
    renderAccess();
  }
}

init();
