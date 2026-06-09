const booksGrid = document.getElementById("books-grid");
const booksSearch = document.getElementById("books-search");
const booksSummary = document.getElementById("books-summary");

const state = { books: [], query: "" };

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
    .toLowerCase();
}

function matchesBook(book) {
  const query = normalize(state.query.trim());
  if (!query) return true;
  return normalize([
    book.title,
    book.author,
    book.description,
    ...(book.tags || [])
  ].join(" ")).includes(query);
}

function renderEmpty() {
  return `
    <div class="books-empty">
      <div class="books-empty-icon">📚</div>
      <h3>Nenhum livro cadastrado ainda</h3>
      <p>Coloque seus PDFs em <strong>assets/livros/</strong> e cadastre os dados em <strong>data/livros.json</strong>.</p>
      <p>Quando você adicionar os arquivos, esta página exibirá automaticamente os cards para leitura e download.</p>
    </div>
  `;
}

function renderBook(book) {
  const cover = book.cover
    ? `<img class="book-cover" src="../${escapeHtml(book.cover)}" alt="Capa de ${escapeHtml(book.title)}" loading="lazy" />`
    : `<div class="book-cover-placeholder"><span>PDF</span></div>`;
  const canDownload = book.download !== false;

  return `
    <article class="book-card">
      ${cover}
      <div class="book-card-body">
        <span class="book-kind">${escapeHtml(book.category || "Material")}</span>
        <h3>${escapeHtml(book.title)}</h3>
        <p class="book-author">${escapeHtml(book.author || "Pr. Marco Lima")}</p>
        <p class="book-description">${escapeHtml(book.description || "Material disponível para leitura.")}</p>
        ${(book.tags || []).length ? `<div class="book-tags">${book.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
        <div class="book-actions">
          <a class="btn-open" href="../${escapeHtml(book.file)}" target="_blank" rel="noopener noreferrer">Ler PDF</a>
          ${canDownload ? `<a class="btn-download" href="../${escapeHtml(book.file)}" download>Baixar PDF</a>` : ""}
        </div>
      </div>
    </article>
  `;
}

function renderBooks() {
  const filtered = state.books.filter(matchesBook);
  booksSummary.textContent = state.books.length
    ? `${filtered.length} livro${filtered.length === 1 ? "" : "s"} encontrado${filtered.length === 1 ? "" : "s"}.`
    : "Adicione PDFs para começar sua biblioteca.";
  booksGrid.innerHTML = state.books.length ? filtered.map(renderBook).join("") : renderEmpty();
}

async function boot() {
  const response = await fetch("../data/livros.json");
  state.books = await response.json();
  booksSearch.addEventListener("input", () => {
    state.query = booksSearch.value;
    renderBooks();
  });
  renderBooks();
}

boot().catch(() => {
  booksGrid.innerHTML = `<div class="books-empty"><h3>Não foi possível carregar os livros.</h3><p>Verifique o arquivo data/livros.json.</p></div>`;
});
