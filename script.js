"use strict";

const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

function closeMenu() {
  if (!menuButton || !siteNav) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
  siteNav.classList.remove("is-open");
}

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 620) closeMenu();
  });
}

const year = document.querySelector("#current-year");
if (year) year.textContent = String(new Date().getFullYear());

const books = [
  { title: "Dom Quixote de La Mancha", author: "Miguel de Cervantes", category: "Literatura Clássica", href: "https://link.amazon/B08LhTjQN", cover: "https://m.media-amazon.com/images/I/81XC3IE0biL._SY522_.jpg" },
  { title: "A última carta", author: "Rebecca Yarros", category: "Romance", href: "https://link.amazon/B01VwTfCp", cover: "https://m.media-amazon.com/images/I/81NjNkmjBqL._SY522_.jpg" },
  { title: "A Biblioteca da Meia-Noite", author: "Matt Haig", category: "Literatura", href: "https://link.amazon/B00RsH1OR", cover: "https://m.media-amazon.com/images/I/61efXnGAjeL._AC_SX679_.jpg" },
  { title: "Manual de Epicteto", author: "Epicteto", category: "Filosofia", href: "https://link.amazon/B0jaBVrWE", cover: "https://m.media-amazon.com/images/I/41mn5iCCQsL._SY445_SX342_ML2_.jpg" },
  { title: "Noites Brancas", author: "Fiódor Dostoiévski", category: "Literatura", href: "https://link.amazon/B0hu7zr4D", cover: "https://m.media-amazon.com/images/I/91WuvposcCL._AC_SL1500_.jpg" },
  { title: "A estranha na cama", author: "Raphael Montes", category: "Literatura Erotica", href: "https://link.amazon/B09ki0yqb", cover: "https://m.media-amazon.com/images/I/71YSm7ehYqL._AC_UF1000,1000_QL80_FMwebp_.jpg" },
  { title: "A metamorfose", author: "Franz Kafka", category: "Literatura Clássica", href: "https://link.amazon/B0abFnOI1", cover: "https://m.media-amazon.com/images/I/71neJqQwTjL._SL1144_.jpg" },
  { title: "Verity", author: "Colleen Hoover", category: "Policial, Suspense e Mistério", href: "https://link.amazon/B03PprFcv", cover: "https://m.media-amazon.com/images/I/51ABRx3d7GL._SY445_SX342_ML2_.jpg" },
  { title: "O Pequeno Príncipe", author: "Antoine de Saint-Exupéry", category: "Fantasia", href: "https://link.amazon/B09oz4h6K", cover: "https://m.media-amazon.com/images/I/41RO433P6VL._SX342_SY445_ML2_.jpg" },
  { title: "Meditações", author: "Marco Aurélio", category: "Filosofia", href: "https://a.co/d/04a1Z5AQ", cover: "https://m.media-amazon.com/images/I/41dSunJl10L._SY445_SX342_QL70_ML2_.jpg" },
  { title: "Dom Casmurro", author: "Machado de Assis", category: "Literatura Brasileira", href: "https://link.amazon/B0aKjViIF", cover: "https://m.media-amazon.com/images/I/713toqhfH8L._SY385_.jpg" },
  { title: "1984", author: "George Orwell", category: "Ficção Científica Distópico", href: "https://link.amazon/B0gCU2gpV", cover: "https://m.media-amazon.com/images/I/61hAKXNgRpL._SY385_.jpg" },
  { title: "A Sociedade do Anel", author: "J. R. R. Tolkien", category: "Fantasia", href: "https://link.amazon/B0b03XCgX", cover: "https://m.media-amazon.com/images/I/81hCVEC0ExL._SY466_.jpg" }
];

const catalog = document.querySelector(".catalog");
const searchInput = catalog && catalog.querySelector("[data-query]");
const categorySelect = catalog && catalog.querySelector("[data-category-select]");
const categoryChips = catalog && catalog.querySelector("[data-category-chips]");
const bookGrid = catalog && catalog.querySelector("[data-grid]");
const resultCount = catalog && catalog.querySelector("[data-count]");
const emptyState = catalog && catalog.querySelector("[data-empty]");
const clearButton = catalog && catalog.querySelector("[data-clear]");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function normalize(value) {
  return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

if (catalog && searchInput && categorySelect && categoryChips && bookGrid) {
  const categories = Array.from(new Set(books.map((book) => book.category)));
  const state = { category: "all" };

  categorySelect.innerHTML = '<option value="all">Todas as categorias</option>' +
    categories.map((category) => '<option value="' + escapeHtml(category) + '">' + escapeHtml(category) + '</option>').join("");

  categoryChips.innerHTML = '<button type="button" class="category-chip" data-category="all" aria-pressed="true">Todas <span class="category-count">' + books.length + '</span></button>' +
    categories.map((category) => {
      const count = books.filter((book) => book.category === category).length;
      return '<button type="button" class="category-chip" data-category="' + escapeHtml(category) + '" aria-pressed="false">' +
        escapeHtml(category) + ' <span class="category-count">' + count + '</span></button>';
    }).join("");

  function cardMarkup(book) {
    const title = escapeHtml(book.title);
    return '<article class="book-card">' +
      '<a class="book-cover" href="' + escapeHtml(book.href) + '" target="_blank" rel="noopener noreferrer" aria-label="Ver ' + title + ' na Amazon">' +
      '<img loading="lazy" src="' + escapeHtml(book.cover) + '" alt="Capa de ' + title + '">' +
      '</a>' +
      '<div class="book-info"><p class="book-category">' + escapeHtml(book.category) + '</p>' +
      '<h2>' + title + '</h2><p class="book-author">' + escapeHtml(book.author) + '</p></div>' +
      '</article>';
  }

  function applyFilters() {
    const query = normalize(searchInput.value.trim());
    const shownBooks = books.filter((book) => {
      const matchesQuery = !query || normalize(book.title + " " + book.author + " " + book.category).includes(query);
      const matchesCategory = state.category === "all" || book.category === state.category;
      return matchesQuery && matchesCategory;
    });

    bookGrid.innerHTML = shownBooks.map(cardMarkup).join("");
    bookGrid.querySelectorAll(".book-cover img").forEach((image) => {
      image.addEventListener("error", () => {
        const fallback = document.createElement("span");
        fallback.className = "cover-missing";
        fallback.textContent = "Capa indisponível";
        image.replaceWith(fallback);
      }, { once: true });
    });

    if (resultCount) resultCount.textContent = shownBooks.length + (shownBooks.length === 1 ? " livro encontrado" : " livros encontrados");
    if (emptyState) emptyState.classList.toggle("is-visible", shownBooks.length === 0);
    categorySelect.value = state.category;
    categoryChips.querySelectorAll("[data-category]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.category === state.category));
    });
  }

  searchInput.addEventListener("input", applyFilters);
  categorySelect.addEventListener("change", () => {
    state.category = categorySelect.value;
    applyFilters();
  });
  categoryChips.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    applyFilters();
  });
  if (clearButton) clearButton.addEventListener("click", () => {
    searchInput.value = "";
    state.category = "all";
    applyFilters();
    searchInput.focus();
  });

  applyFilters();
}
