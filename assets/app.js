const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];
const WEEKDAYS = [
  "Domingo","Segunda-feira","Terça-feira","Quarta-feira",
  "Quinta-feira","Sexta-feira","Sábado"
];

const state = {
  devotionals: [],
  motoDevotionals: [],
  currentDevotionals: [],
  favorites: new Set(JSON.parse(localStorage.getItem("devocional:favorites") || "[]")),
  search: "",
  activeTheme: "Todos",
};

const todayContainer = document.getElementById("today-card");
const pastContainer = document.getElementById("past-cards");
const vodContainer = document.getElementById("verse-of-the-day");
const searchInput = document.getElementById("devotional-search");
const themeFilters = document.getElementById("theme-filters");
const searchResults = document.getElementById("search-results");
const searchSummary = document.getElementById("search-summary");

const FIXED_COUNT = 5;
let START_DATE = null;

function fullDate(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
}

function devotionalDate(devotional) {
  const match = String(devotional.id || "").match(/(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function dateLabelForDevotional(devotional) {
  const d = devotionalDate(devotional);
  if (!d) return "Devocional";
  return `${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
}

function devotionalPath(devotional) {
  const day = String(devotional.id || "").match(/^dia-\d{3}/)?.[0] || devotional.id;
  return `devocional/${day}/`;
}

function daysSinceStart(date) {
  if (!START_DATE) return -1;
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((start - START_DATE) / 86400000);
}

function devotionalForOffset(offset) {
  const today = new Date();
  const target = new Date(today);
  target.setDate(today.getDate() + offset);
  const dayNum = daysSinceStart(target);

  if (dayNum < 0) return null;
  if (dayNum < FIXED_COUNT) return state.devotionals[dayNum];

  const rotatingIndex = (dayNum - FIXED_COUNT) % (state.devotionals.length - FIXED_COUNT);
  return state.devotionals[FIXED_COUNT + rotatingIndex];
}

function noteKey(id) { return `devocional:notes:${id}`; }

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function absoluteDevotionalUrl(dev) {
  return `${location.origin}/${devotionalPath(dev)}`;
}

function shortExcerpt(text, limit = 180) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;
  return `${clean.slice(0, limit).trim()}...`;
}

function findDevotionalById(id) {
  return state.currentDevotionals.find(d => d.id === id) || state.devotionals.find(d => d.id === id);
}

/* ─── Verse of the Day ─── */
function renderVerseOfDay(dev) {
  if (!vodContainer || !dev) return;
  vodContainer.innerHTML = `
    <div class="vod-inner">
      <span class="vod-badge">Versículo do Dia</span>
      <blockquote class="vod-text">${escapeHtml(dev.scripture)}</blockquote>
      <cite class="vod-ref">— ${escapeHtml(dev.reference)}</cite>
      <a class="vod-link" href="${bibleGatewayUrl(dev.reference)}">Leia na Bíblia local →</a>
    </div>
  `;
}

/* ─── Devotional Card ─── */
function renderCard(devotional, offset, isToday, options = {}) {
  const dateStr = options.dateLabel || fullDate(offset);
  const isFav = state.favorites.has(devotional.id);
  const savedNote = localStorage.getItem(noteKey(devotional.id)) || "";
  const path = devotionalPath(devotional);
  const safeId = escapeHtml(devotional.id);

  return `
    <article class="devo-card" data-id="${safeId}" style="animation-delay: ${Math.abs(offset) * 0.15}s">
      ${devotional.image ? `<img src="${escapeHtml(devotional.image)}" alt="${escapeHtml(devotional.imageAlt || devotional.title)}" class="devo-image" loading="lazy" />` : ""}
      <div class="devo-card-header">
        <div class="devo-date-full">
          <span class="devo-date-icon">📅</span>
          <span class="devo-date-text">${escapeHtml(dateStr)}</span>
        </div>
        <div class="devo-header-text">
          ${isToday ? '<span class="devo-today-badge">HOJE</span>' : ""}
          <h2>${escapeHtml(devotional.title)}</h2>
          <span class="devo-theme-tag">${escapeHtml(devotional.theme)}</span>
        </div>
        <button class="devo-fav" data-id="${safeId}" title="Favoritar" aria-label="Favoritar devocional">
          ${isFav ? "❤️" : "🤍"}
        </button>
      </div>

      <div class="devo-body">
        <div class="verse-box">
          <div class="verse-label">📖 ${escapeHtml(devotional.reference)}</div>
          <blockquote>${escapeHtml(devotional.scripture)}</blockquote>
          <div class="verse-footer">
            <a class="verse-link" href="${bibleGatewayUrl(devotional.reference)}">Ler na Bíblia local →</a>
          </div>
        </div>

        <div class="devo-section devo-reflection">
          <h4><span class="section-icon">💭</span> Pensamento</h4>
          <p>${escapeHtml(devotional.reflection)}</p>
        </div>

        <div class="devo-section devo-application">
          <h4><span class="section-icon">✅</span> Para Praticar Hoje</h4>
          <ul>
            ${devotional.application.map(a => `<li>${escapeHtml(a)}</li>`).join("")}
          </ul>
        </div>

        <div class="devo-section devo-prayer">
          <h4><span class="section-icon">🙏</span> Oração</h4>
          <p>${escapeHtml(devotional.prayer)}</p>
        </div>

        <div class="devo-author">
          <span>Enviado por: <strong>${escapeHtml(devotional.author || "Pr. Marco Lima")}</strong></span>
        </div>

        <div class="devo-share">
          <button class="btn-whatsapp" data-id="${safeId}" title="Compartilhar no WhatsApp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </button>
          <button class="btn-instagram" data-id="${safeId}" title="Compartilhar no Instagram">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            Instagram
          </button>
          <button class="btn-facebook" data-id="${safeId}" title="Copiar para Facebook">
            <span class="share-letter">f</span>
            Facebook
          </button>
          <a class="btn-open" href="${path}" title="Abrir página do devocional">Abrir página</a>
          ${devotional.image ? `<a class="btn-download" href="${escapeHtml(devotional.image)}" download title="Baixar imagem do devocional">Baixar imagem</a>` : ""}
          <button class="btn-copy" data-id="${safeId}" title="Copiar texto">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            Copiar
          </button>
          <span class="share-msg" data-id="${safeId}"></span>
        </div>

        <div class="devo-notes">
          <h4>✏️ Quer anotar algo?</h4>
          <textarea data-id="${safeId}" placeholder="Escreva sua resposta, motivo de oração ou decisão prática...">${escapeHtml(savedNote)}</textarea>
          <div class="devo-notes-actions">
            <button class="btn-save" data-id="${safeId}">Salvar no meu diário</button>
            <span class="save-msg" data-id="${safeId}"></span>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderPreviewCard(devotional) {
  return `
    <article class="preview-card">
      ${devotional.image ? `<img src="${escapeHtml(devotional.image)}" alt="${escapeHtml(devotional.imageAlt || devotional.title)}" loading="lazy" />` : ""}
      <div class="preview-card-body">
        <span class="preview-date">${escapeHtml(dateLabelForDevotional(devotional))}</span>
        <h3>${escapeHtml(devotional.title)}</h3>
        <p class="preview-reference">${escapeHtml(devotional.reference)}</p>
        <p>${escapeHtml(shortExcerpt(devotional.reflection, 220))}</p>
        <a href="${devotionalPath(devotional)}">Ler devocional completo</a>
      </div>
    </article>
  `;
}

/* ─── Events ─── */
function buildShareText(dev) {
  return `📖 *${dev.title}*\n_${dev.theme}_\n\n${dev.scripture}\n— ${dev.reference}\n\n💭 ${shortExcerpt(dev.reflection, 260)}\n\nLeia o devocional completo: ${absoluteDevotionalUrl(dev)}\n\n— Pr. Marco Lima`;
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function renderThemeFilters() {
  if (!themeFilters) return;
  const themes = ["Todos", ...new Set(state.devotionals.map(d => d.theme).filter(Boolean).sort((a, b) => a.localeCompare(b, "pt-BR")))];
  themeFilters.innerHTML = themes.map(theme => `
    <button class="theme-filter ${state.activeTheme === theme ? "active" : ""}" data-theme="${escapeHtml(theme)}">${escapeHtml(theme)}</button>
  `).join("");
  themeFilters.querySelectorAll(".theme-filter").forEach(btn => {
    btn.addEventListener("click", () => {
      state.activeTheme = btn.dataset.theme;
      renderExplore();
    });
  });
}

function matchesDevotional(devotional, query) {
  if (!query) return true;
  const haystack = normalizeText([
    devotional.title,
    devotional.theme,
    devotional.reference,
    devotional.scripture,
    devotional.reflection,
    devotional.prayer,
    ...(devotional.application || [])
  ].join(" "));
  return haystack.includes(query);
}

function renderExplore() {
  if (!searchResults || !searchSummary) return;
  const query = normalizeText(state.search.trim());
  const filtered = state.devotionals.filter(dev => {
    const themeOk = state.activeTheme === "Todos" || dev.theme === state.activeTheme;
    return themeOk && matchesDevotional(dev, query);
  });
  const shouldShow = query || state.activeTheme !== "Todos";
  searchSummary.textContent = shouldShow
    ? `${filtered.length} devocional${filtered.length === 1 ? "" : "ais"} encontrado${filtered.length === 1 ? "" : "s"}${filtered.length > 24 ? "; mostrando os 24 primeiros." : "."}`
    : "Digite uma palavra ou selecione um tema para pesquisar os 365 devocionais.";
  searchResults.innerHTML = shouldShow
    ? filtered.slice(0, 24).map(renderPreviewCard).join("")
    : "";
}

function attachSearchEvents() {
  if (!searchInput) return;
  searchInput.addEventListener("input", () => {
    state.search = searchInput.value;
    renderExplore();
  });
}

function attachEvents(container) {
  container.querySelectorAll(".devo-fav").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (state.favorites.has(id)) state.favorites.delete(id);
      else state.favorites.add(id);
      localStorage.setItem("devocional:favorites", JSON.stringify([...state.favorites]));
      renderAll();
    });
  });

  container.querySelectorAll(".btn-whatsapp").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const dev = findDevotionalById(id);
      if (!dev) return;
      const text = encodeURIComponent(buildShareText(dev));
      window.open(`https://wa.me/?text=${text}`, "_blank");
    });
  });

  container.querySelectorAll(".btn-instagram").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const dev = findDevotionalById(id);
      if (!dev) return;
      const msg = container.querySelector(`.share-msg[data-id="${id}"]`);
      navigator.clipboard.writeText(buildShareText(dev)).then(() => {
        msg.textContent = "Texto copiado! Cole no Instagram ✓";
        window.open("https://www.instagram.com/", "_blank");
        setTimeout(() => { msg.textContent = ""; }, 3000);
      }).catch(() => {
        msg.textContent = "Erro ao copiar";
        setTimeout(() => { msg.textContent = ""; }, 2000);
      });
    });
  });

  container.querySelectorAll(".btn-facebook").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const dev = findDevotionalById(id);
      if (!dev) return;
      const msg = container.querySelector(`.share-msg[data-id="${id}"]`);
      navigator.clipboard.writeText(buildShareText(dev)).then(() => {
        msg.textContent = "Texto copiado! Cole no Facebook ✓";
        window.open("https://www.facebook.com/", "_blank");
        setTimeout(() => { msg.textContent = ""; }, 3000);
      }).catch(() => {
        msg.textContent = "Erro ao copiar";
        setTimeout(() => { msg.textContent = ""; }, 2000);
      });
    });
  });

  container.querySelectorAll(".btn-copy").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const dev = findDevotionalById(id);
      if (!dev) return;
      const msg = container.querySelector(`.share-msg[data-id="${id}"]`);
      navigator.clipboard.writeText(buildShareText(dev)).then(() => {
        msg.textContent = "Copiado ✓";
        setTimeout(() => { msg.textContent = ""; }, 2000);
      }).catch(() => {
        msg.textContent = "Erro ao copiar";
        setTimeout(() => { msg.textContent = ""; }, 2000);
      });
    });
  });

  container.querySelectorAll(".btn-save").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const textarea = container.querySelector(`textarea[data-id="${id}"]`);
      const msg = container.querySelector(`.save-msg[data-id="${id}"]`);
      localStorage.setItem(noteKey(id), textarea.value);
      msg.textContent = "Salvo no diário ✓";
      setTimeout(() => { msg.textContent = ""; }, 2500);
    });
  });

  container.querySelectorAll(".devo-notes textarea").forEach(ta => {
    ta.addEventListener("input", () => {
      localStorage.setItem(noteKey(ta.dataset.id), ta.value);
    });
  });
}

async function renderAll() {
  const today = await devotionalForOffset(0);
  const past = await Promise.all([-1, -2, -3, -4, -5, -6].map(async i => ({
    offset: i,
    dev: await devotionalForOffset(i)
  })));

  state.currentDevotionals = [today, ...past.map(item => item.dev)].filter(Boolean);

  if (today) {
    todayContainer.innerHTML = renderCard(today, 0, true);
    attachEvents(todayContainer);
  }

  const pastHtml = past.map(item => {
    return item.dev ? renderCard(item.dev, item.offset, false) : "";
  }).join("");
  pastContainer.innerHTML = pastHtml;
  attachEvents(pastContainer);

  renderVerseOfDay(today);
  renderThemeFilters();
  renderExplore();
}

/* ─── Bible Links ─── */
const BOOK_MAP = {
  "gênesis": "Gen", "genesis": "Gen", "êxodo": "Exod", "exodo": "Exod",
  "levítico": "Lev", "levitico": "Lev", "números": "Num", "numeros": "Num",
  "deuteronômio": "Deut", "deuteronomio": "Deut", "josué": "Josh", "jose": "Josh",
  "juízes": "Judg", "juizes": "Judg", "rute": "Ruth", "1 samuel": "1Sam", "2 samuel": "2Sam",
  "1 reis": "1Kgs", "2 reis": "2Kgs", "1 crônicas": "1Chr", "2 crônicas": "2Chr",
  "esdras": "Ezra", "neemias": "Neh", "ester": "Esth", "jó": "Job", "jo": "Job",
  "salmos": "Ps", "salmo": "Ps", "provérbios": "Prov", "proverbios": "Prov", "eclesiastes": "Eccl",
  "cantares": "Song", "isaías": "Isa", "isaias": "Isa", "jeremias": "Jer",
  "lamentações": "Lam", "lamentacoes": "Lam", "ezequiel": "Ezek", "daniel": "Dan",
  "oséias": "Hos", "oseias": "Hos", "joel": "Joel", "amós": "Amos", "amos": "Amos",
  "obadias": "Obad", "jonas": "Jonah", "micéias": "Mic", "miqueias": "Mic", "naum": "Nah",
  "habacuque": "Hab", "sofonias": "Zeph", "ageu": "Hag", "zacarias": "Zech", "malaquias": "Mal",
  "mateus": "Matt", "marcos": "Mark", "lucas": "Luke", "joão": "John", "joao": "John",
  "atos": "Acts", "romanos": "Rom", "1 coríntios": "1Cor", "1 corintios": "1Cor",
  "2 coríntios": "2Cor", "2 corintios": "2Cor", "gálatas": "Gal", "galatas": "Gal",
  "efésios": "Eph", "efesios": "Eph", "filipenses": "Phil", "colossenses": "Col",
  "1 tessalonicenses": "1Thess", "2 tessalonicenses": "2Thess", "1 timóteo": "1Tim", "2 timóteo": "2Tim",
  "tito": "Titus", "filemom": "Phlm", "hebreus": "Heb", "tiago": "Jas",
  "1 pedro": "1Pet", "2 pedro": "2Pet", "1 joão": "1John", "2 joão": "2John", "3 joão": "3John",
  "judas": "Jude", "apocalipse": "Rev"
};

function parseReference(ref) {
  const normalized = ref.trim().toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/:/g, "/")
    .replace(/–/g, "-");

  let bookMatch = null;
  for (const [name, book] of Object.entries(BOOK_MAP)) {
    if (normalized.startsWith(name + " ") || normalized === name) {
      bookMatch = { name, book, rest: normalized.slice(name.length).trim() };
      break;
    }
  }

  if (!bookMatch) return null;

  const parts = bookMatch.rest.split("/").filter(Boolean);
  const chapter = parts[0] || "";
  const verses = parts[1] || "";

  if (!chapter) return null;

  const firstVerse = (verses.match(/\d+/) || [""])[0];

  return { book: bookMatch.book, chapter, verse: firstVerse };
}

function bibleGatewayUrl(ref) {
  const parsed = parseReference(ref);
  if (parsed) {
    const params = new URLSearchParams({ livro: parsed.book, capitulo: parsed.chapter });
    if (parsed.verse) params.set("versiculo", parsed.verse);
    return `biblia/?${params.toString()}`;
  }
  return `biblia/?q=${encodeURIComponent(ref)}`;
}

function markToday() {
  const key = `devocional:visited:${new Date().toISOString().slice(0,10)}`;
  if (!localStorage.getItem(key)) localStorage.setItem(key, "1");
}

/* ─── Estatísticas Pessoais ─── */
function getVisitedDates() {
  const dates = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("devocional:visited:")) {
      dates.push(key.replace("devocional:visited:", ""));
    }
  }
  return dates.sort();
}

function calcStreak(dates) {
  if (!dates.length) return { current: 0, best: 0 };
  const sorted = [...new Set(dates)].sort();
  let current = 0, best = 0, streak = 1;
  const today = new Date().toISOString().slice(0,10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i-1]);
    const curr = new Date(sorted[i]);
    const diff = (curr - prev) / 86400000;
    if (diff === 1) { streak++; } else { best = Math.max(best, streak); streak = 1; }
  }
  best = Math.max(best, streak);

  const last = sorted[sorted.length - 1];
  current = (last === today || last === yesterday) ? streak : 0;
  return { current, best };
}

function countNotes() {
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("devocional:notes:") && localStorage.getItem(key).trim()) count++;
  }
  return count;
}

function animateCount(el, target) {
  const duration = 900;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function renderStats() {
  const panel = document.getElementById("stats-panel");
  if (!panel) return;

  const dates = getVisitedDates();
  const { current: streakCurrent, best: streakBest } = calcStreak(dates);
  const totalRead = dates.length;
  const totalFavs = state.favorites.size;
  const totalNotes = countNotes();
  const firstDate = dates.length ? new Date(dates[0]).toLocaleDateString("pt-BR") : "—";

  const stats = [
    { icon: "🔥", label: "Sequência Atual", value: streakCurrent, suffix: streakCurrent === 1 ? " dia" : " dias", color: "#e8612a" },
    { icon: "🏆", label: "Recorde", value: streakBest, suffix: streakBest === 1 ? " dia" : " dias", color: "#c9a84c" },
    { icon: "📖", label: "Dias Lidos", value: totalRead, suffix: "", color: "#3d5c41" },
    { icon: "❤️", label: "Favoritos", value: totalFavs, suffix: "", color: "#c0335f" },
    { icon: "✏️", label: "Anotações", value: totalNotes, suffix: "", color: "#5a7a5e" },
  ];

  panel.innerHTML = `
    <div class="stats-card">
      <div class="stats-grid">
        ${stats.map((s, i) => `
          <div class="stat-item" style="animation-delay:${i * 0.08}s">
            <span class="stat-icon">${s.icon}</span>
            <span class="stat-value" data-target="${s.value}" style="color:${s.color}">0</span>
            <span class="stat-suffix">${s.suffix}</span>
            <span class="stat-label">${s.label}</span>
          </div>
        `).join("")}
        <div class="stat-item" style="animation-delay:${stats.length * 0.08}s">
          <span class="stat-icon">📅</span>
          <span class="stat-value stat-date">${firstDate}</span>
          <span class="stat-label">Lendo desde</span>
        </div>
      </div>
      <div class="stats-actions">
        <button id="btn-export-diary" class="btn-export-diary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Exportar Diário (.txt)
        </button>
        <span id="export-msg" class="export-msg"></span>
      </div>
    </div>
  `;

  // Animar contadores
  panel.querySelectorAll(".stat-value[data-target]").forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCount(el, target);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(el);
  });

  document.getElementById("btn-export-diary")?.addEventListener("click", exportDiary);
}

/* ─── Exportar Diário ─── */
function exportDiary() {
  const notes = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("devocional:notes:")) {
      const text = localStorage.getItem(key).trim();
      if (text) {
        const id = key.replace("devocional:notes:", "");
        notes.push({ id, text });
      }
    }
  }

  if (!notes.length) {
    const msg = document.getElementById("export-msg");
    if (msg) { msg.textContent = "Nenhuma anotação encontrada."; setTimeout(() => { msg.textContent = ""; }, 3000); }
    return;
  }

  const today = new Date().toLocaleDateString("pt-BR");
  let content = `MEUS DEVOCIONAIS — Pr. Marco Lima\nExportado em: ${today}\n${"═".repeat(42)}\n\n`;

  notes.sort((a, b) => a.id.localeCompare(b.id)).forEach(({ id, text }) => {
    const dev = state.devotionals.find(d => d.id === id);
    const title = dev ? dev.title : id;
    const ref = dev ? dev.reference : "";
    content += `📖 ${id.toUpperCase()} — ${title}\n`;
    if (ref) content += `Referência: ${ref}\n`;
    content += `Anotação:\n${text}\n\n${"═".repeat(42)}\n\n`;
  });

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `devocional-diario-${today.replace(/\//g, "-")}.txt`;
  a.click();
  URL.revokeObjectURL(url);

  const msg = document.getElementById("export-msg");
  if (msg) { msg.textContent = `${notes.length} anotações exportadas ✓`; setTimeout(() => { msg.textContent = ""; }, 3500); }
}

/* ─── Planos de Leitura ─── */
const READING_PLANS = [
  {
    id: "fe-move-montanhas",
    icon: "⛰️",
    title: "Fé que Move Montanhas",
    days: 7,
    themes: ["Fé"],
    color: "#5a7a5e",
    description: "7 dias mergulhado no tema da fé que transforma e move o impossível.",
  },
  {
    id: "vida-de-oracao",
    icon: "🙏",
    title: "Vida de Oração",
    days: 14,
    themes: ["Oração", "Espírito"],
    color: "#3d5c41",
    description: "14 dias cultivando uma vida de oração profunda e consistente.",
  },
  {
    id: "vencendo-ansiedade",
    icon: "🕊️",
    title: "Vencendo a Ansiedade",
    days: 7,
    themes: ["Ansiedade", "Descanso"],
    color: "#7a9e7e",
    description: "7 dias de palavras de paz, descanso e confiança em Deus.",
  },
  {
    id: "familia-e-amor",
    icon: "👨‍👩‍👧‍👦",
    title: "Família e Amor",
    days: 14,
    themes: ["Amor", "Esperança"],
    color: "#c9a84c",
    description: "14 dias fortalecendo os laços de amor no lar e na comunidade.",
  },
  {
    id: "crescimento-espiritual",
    icon: "🌱",
    title: "Crescimento Espiritual",
    days: 30,
    themes: ["Discipulado", "Força", "Coragem"],
    color: "#2c5f2e",
    description: "30 dias de discipulado, coragem e crescimento na fé.",
  },
  {
    id: "gratidao-e-alegria",
    icon: "🌟",
    title: "Gratidão e Alegria",
    days: 7,
    themes: ["Gratidão", "Alegria"],
    color: "#c9a84c",
    description: "7 dias cultivando um coração grato e alegre diante de Deus.",
  },
  {
    id: "esperanca-momentos-dificeis",
    icon: "🌅",
    title: "Esperança nos Momentos Difíceis",
    days: 14,
    themes: ["Esperança", "Consolação"],
    color: "#6a8fa8",
    description: "14 dias de esperança e consolo para os momentos mais desafiadores.",
  },
  {
    id: "protecao-diaria",
    icon: "🛡️",
    title: "Proteção Diária",
    days: 14,
    themes: ["Proteção"],
    color: "#496a8f",
    description: "14 dias descansando na proteção e no cuidado fiel do Senhor.",
  },
  {
    id: "caminhando-na-luz",
    icon: "💡",
    title: "Caminhando na Luz",
    days: 10,
    themes: ["Luz"],
    color: "#d2a93c",
    description: "10 dias para viver com clareza, direção e verdade diante de Deus.",
  },
  {
    id: "renovacao-interior",
    icon: "🌿",
    title: "Renovação Interior",
    days: 14,
    themes: ["Renovação"],
    color: "#4f8f67",
    description: "14 dias de renovação espiritual, mente transformada e novo ânimo.",
  },
  {
    id: "descanso-em-deus",
    icon: "🌙",
    title: "Descanso em Deus",
    days: 10,
    themes: ["Descanso"],
    color: "#6f85a8",
    description: "10 dias para aquietar o coração e confiar no descanso do Senhor.",
  },
  {
    id: "perseveranca-na-provacao",
    icon: "⛰️",
    title: "Perseverança na Provação",
    days: 7,
    themes: ["Perseverança"],
    color: "#7d6b4f",
    description: "7 dias para permanecer firme quando a fé é provada.",
  },
  {
    id: "o-senhor-meu-pastor",
    icon: "🐑",
    title: "O Senhor é Meu Pastor",
    days: 8,
    themes: ["Pastor"],
    color: "#5f7f55",
    description: "8 dias meditando no cuidado, direção e provisão do Bom Pastor.",
  },
  {
    id: "paz-que-guarda",
    icon: "🕊️",
    title: "Paz que Guarda",
    days: 7,
    themes: ["Paz"],
    color: "#76a6a0",
    description: "7 dias recebendo a paz de Deus para guardar mente e coração.",
  },
  {
    id: "guia-e-direcao",
    icon: "🧭",
    title: "Guia e Direção",
    days: 8,
    themes: ["Guia"],
    color: "#587d8f",
    description: "8 dias buscando direção segura na Palavra e na presença de Deus.",
  },
  {
    id: "desejos-alinhados",
    icon: "🎯",
    title: "Desejos Alinhados",
    days: 8,
    themes: ["Desejos"],
    color: "#a27b54",
    description: "8 dias para alinhar desejos, decisões e vontade ao coração de Deus.",
  },
  {
    id: "lancando-as-cargas",
    icon: "🎒",
    title: "Lançando as Cargas",
    days: 7,
    themes: ["Carga"],
    color: "#8c6f58",
    description: "7 dias entregando pesos, preocupações e fardos ao Senhor.",
  },
  {
    id: "bondade-do-senhor",
    icon: "☀️",
    title: "Bondade do Senhor",
    days: 7,
    themes: ["Bondade"],
    color: "#c9a84c",
    description: "7 dias reconhecendo a bondade de Deus em cada detalhe da vida.",
  },
  {
    id: "obediencia-pratica",
    icon: "✅",
    title: "Obediência Prática",
    days: 8,
    themes: ["Obediência"],
    color: "#3d5c41",
    description: "8 dias transformando fé em atitudes concretas de obediência.",
  },
  {
    id: "forca-para-continuar",
    icon: "💪",
    title: "Força para Continuar",
    days: 7,
    themes: ["Força"],
    color: "#5a7a5e",
    description: "7 dias para receber força de Deus e prosseguir sem desistir.",
  },
  {
    id: "provisao-e-confianca",
    icon: "🍞",
    title: "Provisão e Confiança",
    days: 7,
    themes: ["Provisão"],
    color: "#b58b43",
    description: "7 dias aprendendo a confiar na provisão fiel do Pai.",
  },
  {
    id: "coragem-no-chamado",
    icon: "🦁",
    title: "Coragem no Chamado",
    days: 7,
    themes: ["Coragem"],
    color: "#9b5a3c",
    description: "7 dias para vencer o medo e responder ao chamado de Deus.",
  },
  {
    id: "restauracao-da-alma",
    icon: "🩹",
    title: "Restauração da Alma",
    days: 7,
    themes: ["Restauração"],
    color: "#6f9d85",
    description: "7 dias de cura, restauração e recomeço diante do Senhor.",
  },
  {
    id: "gloria-de-deus",
    icon: "✨",
    title: "Glória de Deus",
    days: 7,
    themes: ["Glória"],
    color: "#b89447",
    description: "7 dias contemplando a glória de Deus e vivendo para honrá-lo.",
  },
  {
    id: "mordomia-e-dizimos",
    icon: "🌾",
    title: "Mordomia e Dízimos",
    days: 7,
    themes: ["Dízimos"],
    color: "#8b7a3c",
    description: "7 dias sobre fidelidade, generosidade e mordomia cristã.",
  },
  {
    id: "testemunho-vivo",
    icon: "📣",
    title: "Testemunho Vivo",
    days: 7,
    themes: ["Testemunho"],
    color: "#7a5a8f",
    description: "7 dias para viver e comunicar Cristo com palavras e atitudes.",
  },
  {
    id: "prioridades-do-reino",
    icon: "👑",
    title: "Prioridades do Reino",
    days: 7,
    themes: ["Prioridade"],
    color: "#6b6f3d",
    description: "7 dias reorganizando a vida segundo as prioridades do Reino.",
  },
  {
    id: "paciencia-no-processo",
    icon: "⏳",
    title: "Paciência no Processo",
    days: 7,
    themes: ["Paciência"],
    color: "#7f8c8d",
    description: "7 dias aprendendo a esperar com fé e perseverança.",
  },
  {
    id: "coracao-guardado",
    icon: "❤️",
    title: "Coração Guardado",
    days: 7,
    themes: ["Coração"],
    color: "#b45b6a",
    description: "7 dias cuidando do coração, das motivações e dos afetos.",
  },
  {
    id: "sabedoria-para-decidir",
    icon: "🧠",
    title: "Sabedoria para Decidir",
    days: 7,
    themes: ["Sabedoria"],
    color: "#8a6f3f",
    description: "7 dias buscando sabedoria de Deus para decisões e caminhos.",
  },
  {
    id: "moto-rotas-de-paz",
    icon: "🕊️",
    title: "Rotas de Paz",
    days: 5,
    themes: ["Rotas de Paz"],
    isMoto: true,
    color: "#b0413e",
    description: "5 dias para combater a ansiedade e encontrar paz na estrada da vida.",
  },
  {
    id: "moto-motor-forte",
    icon: "⚙️",
    title: "Motor Forte",
    days: 5,
    themes: ["Motor Forte"],
    isMoto: true,
    color: "#b0413e",
    description: "Devocionais sobre fé inabalável, força interior e confiança em Deus.",
  },
  {
    id: "moto-irmaos",
    icon: "🤝",
    title: "Irmãos de Asfalto",
    days: 5,
    themes: ["Irmãos de Asfalto"],
    isMoto: true,
    color: "#b0413e",
    description: "Como viver a verdadeira comunhão e cuidar dos irmãos na estrada.",
  },
  {
    id: "moto-chuva",
    icon: "🌧️",
    title: "Pilotando na Chuva",
    days: 5,
    themes: ["Pilotando na Chuva"],
    isMoto: true,
    color: "#b0413e",
    description: "Lidando com as tempestades, perdas e dificuldades repentinas.",
  },
  {
    id: "moto-revisao",
    icon: "🔧",
    title: "Revisão Geral",
    days: 5,
    themes: ["Revisão Geral"],
    isMoto: true,
    color: "#b0413e",
    description: "Autoexame, arrependimento, confissão e renovação espiritual.",
  },
  {
    id: "moto-bussola",
    icon: "🧭",
    title: "A Bússola Divina",
    days: 5,
    themes: ["A Bússola Divina"],
    isMoto: true,
    color: "#b0413e",
    description: "Buscando direção e sabedoria na Palavra de Deus.",
  },
  {
    id: "moto-destino",
    icon: "🏁",
    title: "Destino Final",
    days: 5,
    themes: ["Destino Final"],
    isMoto: true,
    color: "#b0413e",
    description: "Focando na eternidade e na nossa verdadeira cidadania celestial.",
  },
  {
    id: "moto-tanque",
    icon: "⛽",
    title: "Tanque Cheio",
    days: 5,
    themes: ["Tanque Cheio"],
    isMoto: true,
    color: "#b0413e",
    description: "A importância da oração constante para não ficar na reserva.",
  },
  {
    id: "moto-mochila",
    icon: "🎒",
    title: "Mochila Leve",
    days: 5,
    themes: ["Mochila Leve"],
    isMoto: true,
    color: "#b0413e",
    description: "Desapego material, perdão e o alívio das cargas pesadas.",
  },
  {
    id: "moto-condutor",
    icon: "🚦",
    title: "O Bom Condutor",
    days: 5,
    themes: ["O Bom Condutor"],
    isMoto: true,
    color: "#b0413e",
    description: "Paciência, testemunho cristão e amor ao próximo no trânsito e na vida.",
  }
];

function getPlanDevotionals(plan) {
  const collection = plan.isMoto ? state.motoDevotionals : state.devotionals;
  const filtered = collection.filter(d => plan.themes.includes(d.theme));
  const result = [];
  if (filtered.length === 0) return result;
  for (let i = 0; i < plan.days; i++) {
    result.push(filtered[i % filtered.length]);
  }
  return result;
}

function planKey(planId, idx) { return `devocional:plano:${planId}:${idx}`; }

function getPlanProgress(planId, total) {
  let done = 0;
  for (let i = 0; i < total; i++) {
    if (localStorage.getItem(planKey(planId, i)) === "1") done++;
  }
  return done;
}

function renderPlans() {
  const renderPlanCard = plan => {
    const devs = getPlanDevotionals(plan);
    const done = getPlanProgress(plan.id, devs.length);
    const pct = devs.length ? Math.round((done / devs.length) * 100) : 0;
    return `
      <div class="plan-card" data-plan-id="${plan.id}" style="border-top: 3px solid ${plan.color}">
        <div class="plan-card-top">
          <span class="plan-card-icon">${plan.icon}</span>
          <div class="plan-card-info">
            <h3>${escapeHtml(plan.title)}</h3>
            <span class="plan-card-meta">${plan.days} dias · ${plan.themes.join(", ")}</span>
          </div>
        </div>
        <p class="plan-card-desc">${escapeHtml(plan.description)}</p>
        <div class="plan-mini-bar"><div class="plan-mini-fill" style="width:${pct}%;background:${plan.color}"></div></div>
        <div class="plan-card-footer">
          <span class="plan-card-progress" style="color:${plan.color}">${done}/${devs.length} concluídos</span>
          <button class="btn-open-plan" data-plan-id="${plan.id}" style="background:${plan.color}">
            ${done === 0 ? "Iniciar Plano" : done === devs.length ? "Ver Plano ✓" : "Continuar"}
          </button>
        </div>
      </div>
    `;
  };

  const grid = document.getElementById("plans-grid");
  if (grid) {
    grid.innerHTML = READING_PLANS.filter(p => !p.isMoto).map(renderPlanCard).join("");
  }

  const motoGrid = document.getElementById("moto-plans-grid");
  if (motoGrid) {
    motoGrid.innerHTML = READING_PLANS.filter(p => p.isMoto).map(renderPlanCard).join("");
  }

  document.querySelectorAll(".btn-open-plan").forEach(btn => {
    btn.addEventListener("click", () => openPlanDrawer(btn.dataset.planId));
  });
}

function openPlanDrawer(planId) {
  const plan = READING_PLANS.find(p => p.id === planId);
  if (!plan) return;

  const devs = getPlanDevotionals(plan);
  const done = getPlanProgress(planId, devs.length);
  const pct = devs.length ? Math.round((done / devs.length) * 100) : 0;

  document.getElementById("plan-drawer-icon").textContent = plan.icon;
  document.getElementById("plan-drawer-title").textContent = plan.title;
  document.getElementById("plan-drawer-subtitle").textContent = `${plan.days} dias · ${plan.themes.join(", ")}`;
  document.getElementById("plan-progress-fill").style.width = pct + "%";
  document.getElementById("plan-progress-fill").style.background = plan.color;
  document.getElementById("plan-progress-label").textContent = `${done} de ${devs.length} concluídos (${pct}%)`;

  const list = document.getElementById("plan-drawer-list");
  list.innerHTML = devs.map((dev, i) => {
    const isDone = localStorage.getItem(planKey(planId, i)) === "1";
    return `
      <li class="plan-list-item ${isDone ? "plan-item-done" : ""}" data-plan-id="${planId}" data-idx="${i}">
        <label class="plan-item-check">
          <input type="checkbox" ${isDone ? "checked" : ""} data-plan-id="${planId}" data-idx="${i}" />
          <span class="plan-check-box" style="${isDone ? `background:${plan.color};border-color:${plan.color}` : ""}">
            ${isDone ? "✓" : ""}
          </span>
        </label>
        <div class="plan-item-body">
          <span class="plan-item-num">Dia ${i + 1}</span>
          <span class="plan-item-title">${escapeHtml(dev.title)}</span>
          <span class="plan-item-ref">${escapeHtml(dev.reference)}</span>
        </div>
        <a class="plan-item-link" href="${devotionalPath(dev)}" title="Abrir devocional">→</a>
      </li>
    `;
  }).join("");

  list.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", () => {
      const pid = cb.dataset.planId;
      const idx = cb.dataset.idx;
      localStorage.setItem(planKey(pid, idx), cb.checked ? "1" : "0");
      openPlanDrawer(pid);
      renderPlans();
    });
  });

  const drawer = document.getElementById("plan-drawer");
  drawer.setAttribute("aria-hidden", "false");
  drawer.classList.add("plan-drawer-open");
  document.body.style.overflow = "hidden";
}

function closePlanDrawer() {
  const drawer = document.getElementById("plan-drawer");
  drawer.setAttribute("aria-hidden", "true");
  drawer.classList.remove("plan-drawer-open");
  document.body.style.overflow = "";
}

function attachPlanDrawerEvents() {
  document.getElementById("plan-drawer-close")?.addEventListener("click", closePlanDrawer);
  document.getElementById("plan-drawer-backdrop")?.addEventListener("click", closePlanDrawer);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closePlanDrawer(); });
}

/* ─── Motociclista Cristão ─── */
function renderMotoGrid() {
  const grid = document.getElementById("moto-grid");
  if (!grid) return;
  grid.innerHTML = state.motoDevotionals.map((dev, idx) => `
    <div class="moto-card" data-idx="${idx}">
      <div class="moto-card-inner">
        <span class="moto-card-theme">${escapeHtml(dev.theme)}</span>
        <h3>${escapeHtml(dev.title)}</h3>
        <p class="moto-card-ref">${escapeHtml(dev.reference)}</p>
      </div>
      <div class="moto-card-action">Ler →</div>
    </div>
  `).join("");

  grid.querySelectorAll(".moto-card").forEach(card => {
    card.addEventListener("click", () => openMotoModal(card.dataset.idx));
  });
}

function openMotoModal(idx) {
  const dev = state.motoDevotionals[idx];
  if (!dev) return;
  
  const content = document.getElementById("moto-modal-content");
  content.innerHTML = `
    <div class="devo-body">
      <div class="devo-header-text" style="margin-bottom: 24px;">
        <span class="devo-label">${escapeHtml(dev.theme)}</span>
        <h2 style="font-size: 1.8rem; margin-top: 4px;">${escapeHtml(dev.title)}</h2>
      </div>
      <div class="verse-box">
        <div class="verse-label">📖 ${escapeHtml(dev.reference)}</div>
        <blockquote>${escapeHtml(dev.scripture)}</blockquote>
        <div class="verse-footer">
          <a class="verse-link" href="${bibleGatewayUrl(dev.reference)}">Ler na Bíblia local →</a>
        </div>
      </div>
      <div class="devo-section devo-reflection">
        <h4><span class="section-icon">💭</span> Pensamento</h4>
        <p>${escapeHtml(dev.reflection)}</p>
      </div>
      <div class="devo-section devo-application">
        <h4><span class="section-icon">✅</span> Para Praticar Hoje</h4>
        <ul>
          ${dev.application.map(a => `<li>${escapeHtml(a)}</li>`).join("")}
        </ul>
      </div>
      <div class="devo-section devo-prayer">
        <h4><span class="section-icon">🙏</span> Oração</h4>
        <p>${escapeHtml(dev.prayer)}</p>
      </div>
    </div>
  `;
  
  const modal = document.getElementById("moto-modal");
  modal.setAttribute("aria-hidden", "false");
  modal.classList.add("moto-modal-open");
  document.body.style.overflow = "hidden";
}

function closeMotoModal() {
  const modal = document.getElementById("moto-modal");
  modal.setAttribute("aria-hidden", "true");
  modal.classList.remove("moto-modal-open");
  document.body.style.overflow = "";
}

function attachMotoEvents() {
  document.getElementById("moto-modal-close")?.addEventListener("click", closeMotoModal);
  document.getElementById("moto-modal-backdrop")?.addEventListener("click", closeMotoModal);
}

/* ─── Biography Modal ─── */
function attachBioModal() {
  const btn = document.querySelector(".footer-main-logo-btn");
  const modal = document.getElementById("bio-modal");
  const closeBtn = document.querySelector(".bio-modal-close");
  const overlay = document.querySelector(".bio-modal-overlay");

  if (!btn || !modal) return;

  function openBio() {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn?.focus();
  }

  function closeBio() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  btn.addEventListener("click", openBio);
  closeBtn?.addEventListener("click", closeBio);
  overlay?.addEventListener("click", closeBio);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal.hidden) closeBio();
  });
}

/* ─── Boot ─── */
async function boot() {
  const [devotionalsResponse, motoResponse] = await Promise.all([
    fetch("./data/devocionais.json"),
    fetch("./data/moto.json").catch(() => ({ json: () => [] }))
  ]);
  state.devotionals = await devotionalsResponse.json();
  state.motoDevotionals = await motoResponse.json();

  const firstDate = devotionalDate(state.devotionals[0]);
  if (firstDate) START_DATE = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());

  attachSearchEvents();
  await renderAll();
  renderStats();
  renderMotoGrid();
  renderPlans();
  attachPlanDrawerEvents();
  attachMotoEvents();
  attachBioModal();
  markToday();
}

boot().catch(() => {
  todayContainer.innerHTML = `<div class="devo-card"><div class="devo-body"><p>Não foi possível carregar os devocionais. Verifique se os arquivos estão juntos e tente novamente.</p></div></div>`;
});
