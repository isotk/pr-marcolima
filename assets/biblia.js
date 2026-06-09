const BOOK_NAMES = {
  Gen: "Gênesis", Exod: "Êxodo", Lev: "Levítico", Num: "Números", Deut: "Deuteronômio",
  Josh: "Josué", Judg: "Juízes", Ruth: "Rute", "1Sam": "1 Samuel", "2Sam": "2 Samuel",
  "1Kgs": "1 Reis", "2Kgs": "2 Reis", "1Chr": "1 Crônicas", "2Chr": "2 Crônicas",
  Ezra: "Esdras", Neh: "Neemias", Esth: "Ester", Job: "Jó", Ps: "Salmos",
  Prov: "Provérbios", Eccl: "Eclesiastes", Song: "Cantares", Isa: "Isaías", Jer: "Jeremias",
  Lam: "Lamentações", Ezek: "Ezequiel", Dan: "Daniel", Hos: "Oséias", Joel: "Joel",
  Amos: "Amós", Obad: "Obadias", Jonah: "Jonas", Mic: "Miquéias", Nah: "Naum",
  Hab: "Habacuque", Zeph: "Sofonias", Hag: "Ageu", Zech: "Zacarias", Mal: "Malaquias",
  Matt: "Mateus", Mark: "Marcos", Luke: "Lucas", John: "João", Acts: "Atos",
  Rom: "Romanos", "1Cor": "1 Coríntios", "2Cor": "2 Coríntios", Gal: "Gálatas", Eph: "Efésios",
  Phil: "Filipenses", Col: "Colossenses", "1Thess": "1 Tessalonicenses", "2Thess": "2 Tessalonicenses",
  "1Tim": "1 Timóteo", "2Tim": "2 Timóteo", Titus: "Tito", Phlm: "Filemom", Heb: "Hebreus",
  Jas: "Tiago", "1Pet": "1 Pedro", "2Pet": "2 Pedro", "1John": "1 João", "2John": "2 João",
  "3John": "3 João", Jude: "Judas", Rev: "Apocalipse"
};

const BOOK_ALIASES = {
  gn: "Gen", genesis: "Gen", "gênesis": "Gen",
  ex: "Exod", exodo: "Exod", "êxodo": "Exod",
  lv: "Lev", levitico: "Lev", "levítico": "Lev",
  nm: "Num", numeros: "Num", "números": "Num",
  dt: "Deut", deuteronomio: "Deut", "deuteronômio": "Deut",
  js: "Josh", josue: "Josh", "josué": "Josh",
  jz: "Judg", juizes: "Judg", "juízes": "Judg",
  rt: "Ruth", rute: "Ruth",
  "1sm": "1Sam", "1 samuel": "1Sam", "2sm": "2Sam", "2 samuel": "2Sam",
  "1rs": "1Kgs", "1 reis": "1Kgs", "2rs": "2Kgs", "2 reis": "2Kgs",
  "1cr": "1Chr", "1 cronicas": "1Chr", "1 crônicas": "1Chr", "2cr": "2Chr", "2 cronicas": "2Chr", "2 crônicas": "2Chr",
  ed: "Ezra", esdras: "Ezra", ne: "Neh", neemias: "Neh", et: "Esth", ester: "Esth",
  jo: "Job", job: "Job", "jó": "Job", sl: "Ps", salmo: "Ps", salmos: "Ps",
  pv: "Prov", proverbios: "Prov", "provérbios": "Prov", ec: "Eccl", eclesiastes: "Eccl",
  ct: "Song", cantares: "Song", is: "Isa", isaias: "Isa", "isaías": "Isa", jr: "Jer", jeremias: "Jer",
  lm: "Lam", lamentacoes: "Lam", "lamentações": "Lam", ez: "Ezek", ezequiel: "Ezek", dn: "Dan", daniel: "Dan",
  os: "Hos", oseias: "Hos", "oséias": "Hos", jl: "Joel", am: "Amos", amos: "Amos", "amós": "Amos",
  ob: "Obad", obadias: "Obad", jn: "Jonah", jonas: "Jonah", mq: "Mic", miqueias: "Mic", "miquéias": "Mic",
  na: "Nah", naum: "Nah", hc: "Hab", habacuque: "Hab", sf: "Zeph", sofonias: "Zeph", ag: "Hag", ageu: "Hag",
  zc: "Zech", zacarias: "Zech", ml: "Mal", malaquias: "Mal",
  mt: "Matt", mateus: "Matt", mc: "Mark", marcos: "Mark", lc: "Luke", lucas: "Luke", john: "John", joao: "John", "joão": "John",
  at: "Acts", atos: "Acts", rm: "Rom", romanos: "Rom", "1co": "1Cor", "1 corintios": "1Cor", "1 coríntios": "1Cor",
  "2co": "2Cor", "2 corintios": "2Cor", "2 coríntios": "2Cor", gl: "Gal", galatas: "Gal", "gálatas": "Gal",
  ef: "Eph", efesios: "Eph", "efésios": "Eph", fp: "Phil", filipenses: "Phil", cl: "Col", colossenses: "Col",
  "1ts": "1Thess", "1 tessalonicenses": "1Thess", "2ts": "2Thess", "2 tessalonicenses": "2Thess",
  "1tm": "1Tim", "1 timoteo": "1Tim", "1 timóteo": "1Tim", "2tm": "2Tim", "2 timoteo": "2Tim", "2 timóteo": "2Tim",
  tt: "Titus", tito: "Titus", fm: "Phlm", filemom: "Phlm", hb: "Heb", hebreus: "Heb", tg: "Jas", tiago: "Jas",
  "1pe": "1Pet", "1 pedro": "1Pet", "2pe": "2Pet", "2 pedro": "2Pet",
  "1jo": "1John", "1 joao": "1John", "1 joão": "1John", "2jo": "2John", "2 joao": "2John", "2 joão": "2John",
  "3jo": "3John", "3 joao": "3John", "3 joão": "3John", jd: "Jude", judas: "Jude", ap: "Rev", apocalipse: "Rev"
};

const state = { bible: null, book: null, chapter: 1 };

const bookSelect = document.getElementById("bible-book");
const chapterSelect = document.getElementById("bible-chapter");
const titleEl = document.getElementById("bible-title");
const versesEl = document.getElementById("bible-verses");
const resultsEl = document.getElementById("bible-results");
const searchInput = document.getElementById("bible-search");
const searchBtn = document.getElementById("bible-search-btn");
const searchHint = document.getElementById("bible-search-hint");
const prevBtn = document.getElementById("bible-prev");
const nextBtn = document.getElementById("bible-next");
const copyBtn = document.getElementById("bible-copy-link");
const versionEl = document.getElementById("bible-version");

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function currentBook() {
  return state.bible.books.find(book => book.book === state.book) || state.bible.books[0];
}

function currentChapter() {
  return currentBook().chapters.find(chapter => chapter.chapter === state.chapter) || currentBook().chapters[0];
}

function updateUrl() {
  const url = new URL(location.href);
  url.searchParams.set("livro", state.book);
  url.searchParams.set("capitulo", state.chapter);
  history.replaceState(null, "", url);
}

function fillBooks() {
  bookSelect.innerHTML = state.bible.books.map(book => `
    <option value="${book.book}">${escapeHtml(BOOK_NAMES[book.book] || book.englishName || book.book)}</option>
  `).join("");
}

function fillChapters() {
  const book = currentBook();
  chapterSelect.innerHTML = book.chapters.map(chapter => `
    <option value="${chapter.chapter}">${chapter.chapter}</option>
  `).join("");
}

function renderChapter() {
  const book = currentBook();
  const chapter = currentChapter();
  const bookName = BOOK_NAMES[book.book] || book.englishName || book.book;

  bookSelect.value = book.book;
  chapterSelect.value = String(chapter.chapter);
  titleEl.textContent = `${bookName} ${chapter.chapter}`;
  versionEl.textContent = state.bible.name || "Almeida Livre";
  versesEl.innerHTML = chapter.verses.map(verse => `
    <p class="bible-verse" id="v${verse.number}"><sup>${verse.number}</sup>${escapeHtml(verse.text)}</p>
  `).join("");
  resultsEl.innerHTML = "";
  updateButtons();
  updateUrl();
}

function updateButtons() {
  const index = state.bible.books.findIndex(book => book.book === state.book);
  const book = currentBook();
  prevBtn.disabled = index === 0 && state.chapter === 1;
  nextBtn.disabled = index === state.bible.books.length - 1 && state.chapter === book.chapters.length;
}

function go(delta) {
  const index = state.bible.books.findIndex(book => book.book === state.book);
  const book = currentBook();
  const nextChapter = state.chapter + delta;

  if (nextChapter >= 1 && nextChapter <= book.chapters.length) {
    state.chapter = nextChapter;
  } else if (delta < 0 && index > 0) {
    const previousBook = state.bible.books[index - 1];
    state.book = previousBook.book;
    state.chapter = previousBook.chapters.length;
    fillChapters();
  } else if (delta > 0 && index < state.bible.books.length - 1) {
    const nextBook = state.bible.books[index + 1];
    state.book = nextBook.book;
    state.chapter = 1;
    fillChapters();
  }

  renderChapter();
}

function parseReference(query) {
  const cleaned = normalize(query).replace(/:/g, " ");
  const match = cleaned.match(/^(.+?)\s+(\d+)(?:\s+(\d+))?$/);
  if (!match) return null;
  const book = BOOK_ALIASES[match[1]];
  if (!book) return null;
  return { book, chapter: Number(match[2]), verse: match[3] ? Number(match[3]) : null };
}

function openReference(ref) {
  const book = state.bible.books.find(item => item.book === ref.book);
  if (!book) return false;
  const chapter = book.chapters.find(item => item.chapter === ref.chapter);
  if (!chapter) return false;

  state.book = book.book;
  state.chapter = chapter.chapter;
  fillChapters();
  renderChapter();

  if (ref.verse) {
    setTimeout(() => {
      const el = document.getElementById(`v${ref.verse}`);
      if (el) {
        el.classList.add("highlight");
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 80);
  }
  return true;
}

function renderResults(query) {
  const normalizedQuery = normalize(query);
  const results = [];

  for (const book of state.bible.books) {
    const bookName = BOOK_NAMES[book.book] || book.englishName || book.book;
    for (const chapter of book.chapters) {
      for (const verse of chapter.verses) {
        if (normalize(verse.text).includes(normalizedQuery)) {
          results.push({ book: book.book, bookName, chapter: chapter.chapter, verse: verse.number, text: verse.text });
          if (results.length >= 80) break;
        }
      }
      if (results.length >= 80) break;
    }
    if (results.length >= 80) break;
  }

  searchHint.textContent = `${results.length} resultado${results.length === 1 ? "" : "s"}${results.length === 80 ? " encontrados; mostrando os 80 primeiros." : " encontrado" + (results.length === 1 ? "." : "s.")}`;
  resultsEl.innerHTML = results.length ? `
    <h3>Resultados da busca</h3>
    ${results.map(result => `
      <button class="bible-result" type="button" data-book="${result.book}" data-chapter="${result.chapter}" data-verse="${result.verse}">
        <strong>${escapeHtml(result.bookName)} ${result.chapter}:${result.verse}</strong>
        <span>${escapeHtml(result.text)}</span>
      </button>
    `).join("")}
  ` : `<p class="panel-empty">Nenhum resultado encontrado.</p>`;
}

function runSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  const ref = parseReference(query);
  if (ref && openReference(ref)) {
    searchHint.textContent = "Referência aberta.";
    return;
  }

  if (normalize(query).length < 3) {
    searchHint.textContent = "Digite pelo menos 3 letras para buscar no texto bíblico.";
    return;
  }

  renderResults(query);
}

function attachEvents() {
  bookSelect.addEventListener("change", () => {
    state.book = bookSelect.value;
    state.chapter = 1;
    fillChapters();
    renderChapter();
  });

  chapterSelect.addEventListener("change", () => {
    state.chapter = Number(chapterSelect.value);
    renderChapter();
  });

  prevBtn.addEventListener("click", () => go(-1));
  nextBtn.addEventListener("click", () => go(1));
  searchBtn.addEventListener("click", runSearch);
  searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") runSearch();
  });

  resultsEl.addEventListener("click", event => {
    const btn = event.target.closest(".bible-result");
    if (!btn) return;
    openReference({ book: btn.dataset.book, chapter: Number(btn.dataset.chapter), verse: Number(btn.dataset.verse) });
  });

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(location.href).then(() => {
      copyBtn.textContent = "Link copiado";
      setTimeout(() => { copyBtn.textContent = "Copiar link"; }, 1800);
    });
  });
}

function bootFromUrl() {
  const params = new URLSearchParams(location.search);
  const bookParam = params.get("livro");
  const chapterParam = Number(params.get("capitulo"));
  const book = state.bible.books.find(item => item.book === bookParam) || state.bible.books[0];
  const chapter = book.chapters.find(item => item.chapter === chapterParam) || book.chapters[0];
  state.book = book.book;
  state.chapter = chapter.chapter;
}

async function boot() {
  const response = await fetch("../data/biblia-almeida-livre.json");
  state.bible = await response.json();
  bootFromUrl();
  fillBooks();
  fillChapters();
  attachEvents();
  renderChapter();
}

boot().catch(() => {
  versesEl.innerHTML = `<p>Não foi possível carregar a Bíblia local. Tente novamente.</p>`;
});
