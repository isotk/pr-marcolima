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
  favorites: new Set(JSON.parse(localStorage.getItem("devocional:favorites") || "[]")),
};

const todayContainer = document.getElementById("today-card");
const pastContainer = document.getElementById("past-cards");
const vodContainer = document.getElementById("verse-of-the-day");

const FIXED_COUNT = 5;
const START_DATE = new Date(2026, 5, 1);

function fullDate(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
}

function daysSinceStart(date) {
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

/* ─── Verse of the Day ─── */
function renderVerseOfDay() {
  if (!vodContainer || !state.devotionals.length) return;
  const dev = devotionalForOffset(0);
  if (!dev) return;
  vodContainer.innerHTML = `
    <div class="vod-inner">
      <span class="vod-badge">Versículo do Dia</span>
      <blockquote class="vod-text">${dev.scripture}</blockquote>
      <cite class="vod-ref">— ${dev.reference}</cite>
      <a class="vod-link" href="${bibleGatewayUrl(dev.reference)}" target="_blank" rel="noopener noreferrer">Leia no contexto completo →</a>
    </div>
  `;
}

/* ─── Devotional Card ─── */
function renderCard(devotional, offset, isToday) {
  const dateStr = fullDate(offset);
  const label = isToday ? "Devocional de Hoje" : dateStr;
  const isFav = state.favorites.has(devotional.id);
  const savedNote = localStorage.getItem(noteKey(devotional.id)) || "";

  return `
    <article class="devo-card" data-id="${devotional.id}" style="animation-delay: ${offset * 0.15}s">
      ${devotional.image ? `<img src="${devotional.image}" alt="${devotional.title}" class="devo-image" loading="lazy" />` : ""}
      <div class="devo-card-header">
        <div class="devo-date-full">
          <span class="devo-date-icon">📅</span>
          <span class="devo-date-text">${dateStr}</span>
        </div>
        <div class="devo-header-text">
          ${isToday ? '<span class="devo-today-badge">HOJE</span>' : ""}
          <h2>${devotional.title}</h2>
          <span class="devo-theme-tag">${devotional.theme}</span>
        </div>
        <button class="devo-fav" data-id="${devotional.id}" title="Favoritar" aria-label="Favoritar devocional">
          ${isFav ? "❤️" : "🤍"}
        </button>
      </div>

      <div class="devo-body">
        <div class="verse-box">
          <div class="verse-label">📖 ${devotional.reference}</div>
          <blockquote>${devotional.scripture}</blockquote>
          <div class="verse-footer">
            <a class="verse-link" href="${bibleGatewayUrl(devotional.reference)}" target="_blank" rel="noopener noreferrer">Ler na Bíblia NVI →</a>
          </div>
        </div>

        ${devotional.context ? `
        <div class="devo-section devo-context">
          <h4><span class="section-icon">📜</span> Contexto Bíblico</h4>
          <p>${devotional.context}</p>
        </div>` : ""}

        ${devotional.commentary ? `
        <div class="devo-section devo-commentary">
          <h4><span class="section-icon">📚</span> Comentário</h4>
          ${devotional.commentary.map(c => `
            <div class="commentary-item">
              <span class="commentary-author">${c.author}</span>
              <p>${c.text}</p>
            </div>
          `).join("")}
        </div>` : ""}

        <div class="devo-section devo-reflection">
          <h4><span class="section-icon">💭</span> Reflexão</h4>
          <p>${devotional.reflection}</p>
        </div>

        <div class="devo-section devo-application">
          <h4><span class="section-icon">✅</span> ${devotional.theme} — Aplicação Prática</h4>
          <ul>
            ${devotional.application.map(a => `<li>${a}</li>`).join("")}
          </ul>
        </div>

        <div class="devo-section devo-prayer">
          <h4><span class="section-icon">🙏</span> Para Orar</h4>
          <p>${devotional.prayer}</p>
        </div>

        <div class="devo-author">
          <span>Enviado por: <strong>${devotional.author || "Pr. Marco Lima"}</strong></span>
        </div>

        <div class="devo-share">
          <button class="btn-whatsapp" data-id="${devotional.id}" title="Compartilhar no WhatsApp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </button>
          <button class="btn-instagram" data-id="${devotional.id}" title="Compartilhar no Instagram">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            Instagram
          </button>
          <button class="btn-copy" data-id="${devotional.id}" title="Copiar texto">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            Copiar
          </button>
          <span class="share-msg" data-id="${devotional.id}"></span>
        </div>

        <div class="devo-notes">
          <h4>✏️ Quer anotar algo?</h4>
          <textarea data-id="${devotional.id}" placeholder="Escreva sua resposta, motivo de oração ou decisão prática...">${savedNote}</textarea>
          <div class="devo-notes-actions">
            <button class="btn-save" data-id="${devotional.id}">Salvar no meu diário</button>
            <span class="save-msg" data-id="${devotional.id}"></span>
          </div>
        </div>
      </div>
    </article>
  `;
}

/* ─── Events ─── */
function buildShareText(dev) {
  return `📖 *${dev.title}*\n_${dev.theme}_\n\n${dev.scripture}\n— ${dev.reference}\n\n💭 ${dev.reflection}\n\n✅ ${dev.application.join("\n✅ ")}\n\n🙏 ${dev.prayer}\n\n— Pr. Marco Lima`;
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
      const dev = state.devotionals.find(d => d.id === id);
      if (!dev) return;
      const text = encodeURIComponent(buildShareText(dev));
      window.open(`https://wa.me/?text=${text}`, "_blank");
    });
  });

  container.querySelectorAll(".btn-instagram").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const dev = state.devotionals.find(d => d.id === id);
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

  container.querySelectorAll(".btn-copy").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const dev = state.devotionals.find(d => d.id === id);
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

function renderAll() {
  const today = devotionalForOffset(0);
  if (today) {
    todayContainer.innerHTML = renderCard(today, 0, true);
    attachEvents(todayContainer);
  }

  const pastHtml = [1, 2, 3, 4, 5, 6].map(i => {
    const dev = devotionalForOffset(i);
    return dev ? renderCard(dev, i, false) : "";
  }).join("");
  pastContainer.innerHTML = pastHtml;
  attachEvents(pastContainer);

  renderVerseOfDay();
}

/* ─── Bible Links ─── */
const BOOK_MAP = {
  "gênesis": "gn", "genesis": "gn",
  "êxodo": "ex", "exodo": "ex",
  "levítico": "lv", "levitico": "lv",
  "números": "nm", "numeros": "nm",
  "deuteronômio": "dt", "deuteronomio": "dt",
  "josué": "js", "jose": "js",
  "juízes": "jz", "juizes": "jz",
  "rute": "rt",
  "1 samuel": "1sm", "2 samuel": "2sm",
  "1 reis": "1rs", "2 reis": "2rs",
  "1 crônicas": "1cr", "2 crônicas": "2cr",
  "esdras": "ed",
  "neemias": "ne",
  "ester": "et",
  "jó": "jb", "jo": "jb",
  "salmos": "sl", "salmo": "sl",
  "provérbios": "pv", "proverbios": "pv",
  "eclesiastes": "ec",
  "cantares": "ct",
  "isaías": "is", "isaias": "is",
  "jeremias": "jr",
  "lamentações": "lm", "lamentacoes": "lm",
  "ezequiel": "ez",
  "daniel": "dn",
  "oséias": "os", "oseias": "os",
  "joel": "jl",
  "amós": "am", "amos": "am",
  "obadias": "ob",
  "jonas": "jn",
  "micéias": "mq", "miqueias": "mq",
  "naum": "na",
  "habacuque": "hc",
  "sofonias": "sf",
  "ageu": "ag",
  "zacarias": "zc",
  "malaquias": "ml",
  "mateus": "mt",
  "marcos": "mc",
  "lucas": "lc",
  "joão": "jo", "joao": "jo",
  "atos": "at",
  "romanos": "rm",
  "1 coríntios": "1co", "1 corintios": "1co",
  "2 coríntios": "2co", "2 corintios": "2co",
  "gálatas": "gl", "galatas": "gl",
  "efésios": "ef", "efesios": "ef",
  "filipenses": "fp",
  "colossenses": "cl",
  "1 tessalonicenses": "1ts", "2 tessalonicenses": "2ts",
  "1 timóteo": "1tm", "2 timóteo": "2tm",
  "tito": "tt",
  "filemom": "fm",
  "hebreus": "hb",
  "tiago": "tg",
  "1 pedro": "1pe", "2 pedro": "2pe",
  "1 joão": "1jo", "2 joão": "2jo", "3 joão": "3jo",
  "judas": "jd",
  "apocalipse": "ap"
};

function parseReference(ref) {
  const normalized = ref.trim().toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/:/g, "/")
    .replace(/–/g, "-");

  let bookMatch = null;
  for (const [name, abbr] of Object.entries(BOOK_MAP)) {
    if (normalized.startsWith(name + " ") || normalized === name) {
      bookMatch = { name, abbr, rest: normalized.slice(name.length).trim() };
      break;
    }
  }

  if (!bookMatch) return null;

  const parts = bookMatch.rest.split("/").filter(Boolean);
  const chapter = parts[0] || "";
  const verses = parts[1] || "";

  if (!chapter) return null;

  const cleanVerses = verses.replace(/-/g, ",").replace(/\s/g, "");

  return `${bookMatch.abbr}/${chapter}${cleanVerses ? "/" + cleanVerses : ""}`;
}

function bibleGatewayUrl(ref) {
  const parsed = parseReference(ref);
  if (parsed) {
    return `https://www.bibliaonline.com.br/nvt/${parsed}`;
  }
  return `https://www.bibliaonline.com.br/nvt/busca?q=${encodeURIComponent(ref)}`;
}

function markToday() {
  const key = `devocional:visited:${new Date().toISOString().slice(0,10)}`;
  if (!localStorage.getItem(key)) localStorage.setItem(key, "1");
}

/* ─── Boot ─── */
async function boot() {
  const response = await fetch("./data/devocionais.json");
  state.devotionals = await response.json();
  renderAll();
  markToday();
}

boot().catch(() => {
  todayContainer.innerHTML = `<div class="devo-card"><div class="devo-body"><p>Não foi possível carregar os devocionais. Verifique se os arquivos estão juntos e tente novamente.</p></div></div>`;
});
