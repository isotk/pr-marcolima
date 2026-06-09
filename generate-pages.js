#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const SITE_URL = "https://pr-marcolima.vercel.app";
const root = __dirname;
const devotionals = JSON.parse(fs.readFileSync(path.join(root, "data/devocionais.json"), "utf8"));
const outDir = path.join(root, "devocional");

const BOOK_MAP = {
  "gênesis": "Gen", "genesis": "Gen", "êxodo": "Exod", "exodo": "Exod", "levítico": "Lev", "levitico": "Lev",
  "números": "Num", "numeros": "Num", "deuteronômio": "Deut", "deuteronomio": "Deut", "josué": "Josh",
  "juízes": "Judg", "juizes": "Judg", "rute": "Ruth", "1 samuel": "1Sam", "2 samuel": "2Sam",
  "1 reis": "1Kgs", "2 reis": "2Kgs", "esdras": "Ezra", "neemias": "Neh", "ester": "Esth",
  "jó": "Job", "jo": "Job", "salmos": "Ps", "salmo": "Ps", "provérbios": "Prov", "proverbios": "Prov",
  "eclesiastes": "Eccl", "isaías": "Isa", "isaias": "Isa", "jeremias": "Jer", "ezequiel": "Ezek",
  "daniel": "Dan", "joel": "Joel", "habacuque": "Hab", "ageu": "Hag", "zacarias": "Zech", "malaquias": "Mal",
  "mateus": "Matt", "marcos": "Mark", "lucas": "Luke", "joão": "John", "joao": "John", "atos": "Acts", "romanos": "Rom",
  "1 coríntios": "1Cor", "1 corintios": "1Cor", "2 coríntios": "2Cor", "2 corintios": "2Cor",
  "gálatas": "Gal", "galatas": "Gal", "efésios": "Eph", "efesios": "Eph", "filipenses": "Phil",
  "colossenses": "Col", "1 tessalonicenses": "1Thess", "2 tessalonicenses": "2Thess", "hebreus": "Heb",
  "tiago": "Jas", "1 pedro": "1Pet", "2 pedro": "2Pet", "1 joão": "1John", "1 joao": "1John",
  "judas": "Jude", "apocalipse": "Rev"
};

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function daySlug(devotional) {
  return String(devotional.id || "").match(/^dia-\d{3}/)?.[0] || devotional.id;
}

function pageUrl(devotional) {
  return `${SITE_URL}/devocional/${daySlug(devotional)}/`;
}

function devotionalDate(devotional) {
  const match = String(devotional.id || "").match(/(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return "Devocional Diário";
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(date);
}

function bibleUrl(reference) {
  const normalized = String(reference || "").trim().toLowerCase().replace(/\s+/g, " ").replace(/:/g, "/").replace(/–/g, "-");
  for (const [name, book] of Object.entries(BOOK_MAP)) {
    if (normalized.startsWith(name + " ")) {
      const parts = normalized.slice(name.length).trim().split("/").filter(Boolean);
      const chapter = parts[0] || "";
      const verse = ((parts[1] || "").match(/\d+/) || [""])[0];
      if (chapter) {
        const params = new URLSearchParams({ livro: book, capitulo: chapter });
        if (verse) params.set("versiculo", verse);
        return `../../biblia/?${params.toString()}`;
      }
    }
  }
  return `../../biblia/?q=${encodeURIComponent(reference)}`;
}

function description(devotional) {
  return `${devotional.reference}: ${devotional.scripture}`.slice(0, 155);
}

function paragraphs(text) {
  return String(text || "")
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map(p => `<p>${escapeHtml(p)}</p>`)
    .join("\n");
}

function renderPage(devotional, index) {
  const url = pageUrl(devotional);
  const prev = devotionals[index - 1];
  const next = devotionals[index + 1];
  const title = `${devotional.title} | Devocional Diário | Pr. Marco Lima`;
  const desc = description(devotional);
  const image = `${SITE_URL}/${devotional.image}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: devotional.title,
    description: desc,
    image,
    author: { "@type": "Person", name: "Pr. Marco Lima" },
    publisher: { "@type": "Person", name: "Pr. Marco Lima" },
    mainEntityOfPage: url,
    inLanguage: "pt-BR"
  };
  const shareText = encodeURIComponent(`${devotional.title}\n${devotional.reference}\n\n${devotional.scripture}\n\n${url}`);

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(desc)}" />
    <meta name="robots" content="index,follow" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(devotional.title)}" />
    <meta property="og:description" content="${escapeHtml(desc)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(devotional.title)}" />
    <meta name="twitter:description" content="${escapeHtml(desc)}" />
    <meta name="twitter:image" content="${image}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../../assets/styles.css" />
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
  </head>
  <body>
    <header class="site-header">
      <div class="container header-inner">
        <a href="../../" class="header-logo-link"><img src="../../assets/images/logo.png" alt="Pr. Marco Lima" class="header-logo" /></a>
        <div class="header-info">
          <h1 class="header-name">Pr. Marco Lima</h1>
          <a href="https://instagram.com/prmarcolima" target="_blank" rel="noopener noreferrer" class="header-social">@prmarcolima</a>
        </div>
      </div>
    </header>
    <main class="main single-main">
      <section class="section-today">
        <div class="container">
          <a class="back-link" href="../../">← Voltar aos devocionais</a>
          <article class="devo-card single-devo-card">
            <img src="../../${devotional.image}" alt="${escapeHtml(devotional.imageAlt || devotional.title)}" class="devo-image" />
            <div class="devo-card-header">
              <div class="devo-date-full">
                <span class="devo-date-icon">📅</span>
                <span class="devo-date-text">${escapeHtml(devotionalDate(devotional))}</span>
              </div>
              <div class="devo-header-text">
                <span class="devo-today-badge">${escapeHtml(devotional.theme)}</span>
                <h2>${escapeHtml(devotional.title)}</h2>
              </div>
            </div>
            <div class="devo-body">
              <div class="verse-box">
                <div class="verse-label">📖 ${escapeHtml(devotional.reference)}</div>
                <blockquote>${escapeHtml(devotional.scripture)}</blockquote>
                <div class="verse-footer">
                  <a class="verse-link" href="${bibleUrl(devotional.reference)}">Ler na Bíblia local →</a>
                </div>
              </div>
              <div class="devo-section devo-reflection">
                <h4><span class="section-icon">💭</span> Pensamento</h4>
                ${paragraphs(devotional.reflection)}
              </div>
              <div class="devo-section devo-application">
                <h4><span class="section-icon">✅</span> Para Praticar Hoje</h4>
                <ul>${devotional.application.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
              </div>
              <div class="devo-section devo-prayer">
                <h4><span class="section-icon">🙏</span> Oração</h4>
                <p>${escapeHtml(devotional.prayer)}</p>
              </div>
              <div class="devo-share">
                <a class="btn-whatsapp" href="https://wa.me/?text=${shareText}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                <a class="btn-facebook" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" rel="noopener noreferrer"><span class="share-letter">f</span> Facebook</a>
                <a class="btn-download" href="../../${devotional.image}" download>Baixar imagem</a>
                <a class="btn-copy" href="../../">Todos os devocionais</a>
              </div>
            </div>
          </article>
          <nav class="single-nav" aria-label="Navegação entre devocionais">
            ${prev ? `<a href="../${daySlug(prev)}/">← ${escapeHtml(prev.title)}</a>` : `<span></span>`}
            ${next ? `<a href="../${daySlug(next)}/">${escapeHtml(next.title)} →</a>` : `<span></span>`}
          </nav>
        </div>
      </section>
    </main>
  </body>
</html>`;
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const [index, devotional] of devotionals.entries()) {
  const dir = path.join(outDir, daySlug(devotional));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), renderPage(devotional, index), "utf8");
}

const sitemap = [`${SITE_URL}/`, `${SITE_URL}/biblia/`, `${SITE_URL}/livros/`, ...devotionals.map(pageUrl)].map(url => `  <url><loc>${url}</loc></url>`).join("\n");
fs.writeFileSync(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap}\n</urlset>\n`, "utf8");
fs.writeFileSync(path.join(root, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`, "utf8");

console.log(JSON.stringify({ pages: devotionals.length, sitemap: true, robots: true }, null, 2));
