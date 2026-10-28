/* =========================================================
   BLUE BIJU MAKEUP — script.js
   Tudo o que precisa ser editado está no topo deste arquivo:
   CONFIG e PRODUCTS.
   ========================================================= */

/* ---------------------------------------------------------
   1. CONFIGURAÇÕES DA LOJA
   --------------------------------------------------------- */
const CONFIG = {
  // Número do WhatsApp com DDI + DDD, só números
  whatsappNumber: "5584991464709",

  // Número como aparece na seção de contato (deixe "" para ocultar)
  whatsappDisplay: "(84) 99146-4709",

  instagramUrl: "https://www.instagram.com/blue.bijumakeup/",

  // Mensagem padrão dos botões gerais de WhatsApp
  defaultMessage: "Olá! Vim pelo site da Blue Biju Makeup e gostaria de ver os produtos. 💙",

  // Mensagem dos cards de produto ({produto} é trocado pelo nome)
  productMessage: "Olá! Vi o {produto} no site da Blue Biju Makeup e gostaria de saber mais. 💙",

  // Deixe "" para ocultar
  hours: "",   // ex.: "Seg a sáb, das 9h às 18h"
  address: "", // ex.: "Rua Exemplo, 123 – Centro"

  // Subcategorias: preencha SOMENTE com as que existem no catálogo.
  // Listas vazias ficam ocultas na página.
  makeupSubcategories: [
    // "Lábios", "Olhos", "Pele", "Acessórios de maquiagem", "Kits"
  ],
  accessorySubcategories: [
    // "Brincos", "Colares", "Pulseiras", "Anéis", "Acessórios para cabelo"
  ],
};

/* ---------------------------------------------------------
   2. PRODUTOS EM DESTAQUE ("Queridinhos da Blue")
   - image: arquivo em assets/images/ (quadrado de preferência)
   - badge: "Destaque" | "Novidade" | "Queridinho" | "" (sem selo)
   - price: preencha SOMENTE se confirmado. Ex.: "R$ 29,90". "" oculta.
   --------------------------------------------------------- */
const PRODUCTS = [
  { name: "Gloss Lip Glossy Dailus", category: "Maquiagem", badge: "Queridinho", description: "Gloss de 3 ml para lábios com brilho intenso.", price: "", image: "produto-gloss.jpg" },
  { name: "Paleta de sombras",     category: "Maquiagem",   badge: "Destaque",   description: "Quarteto cintilante em cobre, prata, champanhe e dourado.", price: "", image: "produto-paleta-sombras.jpg" },
  { name: "Base líquida Hidra Glow", category: "Maquiagem", badge: "",           description: "Base Niina Secrets com ácido hialurônico, 30 ml.", price: "", image: "produto-base-liquida.jpg" },
  { name: "Kit de pincéis",        category: "Maquiagem",   badge: "Destaque",   description: "Pincéis para pele e olhos, com estojo transparente.", price: "", image: "produto-kit-pinceis.jpg" },
  { name: "Brinco argola",         category: "Bijuterias",  badge: "Novidade",   description: "Argola clássica e leve, que combina com qualquer look.", price: "", image: "produto-brinco-argola.jpg" },
  { name: "Colar delicado",        category: "Bijuterias",  badge: "",           description: "Corrente fina com pingente de gota brilhante.", price: "", image: "produto-colar-delicado.jpg" },
  { name: "Pulseira",              category: "Bijuterias",  badge: "",           description: "Pulseiras com pedras brilhantes para usar sozinhas ou em mix.", price: "", image: "produto-pulseira.jpg" },
  { name: "Presilha de cabelo",    category: "Acessórios",  badge: "Novidade",   description: "Piranha marmorizada em tom rosé para prender o cabelo com charme.", price: "", image: "produto-presilha.jpg" },
  { name: "Esmaltes Anita Rio",    category: "Esmaltes",    badge: "Novidade",   description: "Coleção Rio com cores vibrantes e tons pastel.", price: "", image: "produto-esmaltes.jpg" },
  { name: "Cera depilatória Depil Bella", category: "Depilação", badge: "",      description: "Cera cremosa Chocolate Branco, baixa fusão, 800 g.", price: "", image: "produto-depilacao.jpg" },
  { name: "Linha Pink Lemonade",   category: "Salon Line",  badge: "Queridinho", description: "Cachos dos Sonhos: creme 3 em 1, óleo sérum e kit shampoo + creme.", price: "", image: "produto-salon-line.jpg" },
  { name: "Cabine UV/LED Sun 5",   category: "Eletrônicos", badge: "",           description: "Cabine para secagem de unhas em gel, com visor digital.", price: "", image: "produto-eletronicos.jpg" },
];

const IMAGE_PATH = "assets/images/";

/* =========================================================
   A partir daqui, não é preciso editar.
   ========================================================= */

/** Monta o link do WhatsApp com mensagem codificada */
function waLink(message = CONFIG.defaultMessage) {
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Escapa texto antes de inserir em HTML */
function esc(str = "") {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/** Aplica links de WhatsApp e Instagram em todos os elementos marcados */
function bindExternalLinks(root = document) {
  root.querySelectorAll("[data-wa]").forEach((el) => {
    el.href = waLink(el.dataset.waMsg || CONFIG.defaultMessage);
    el.target = "_blank";
    el.rel = "noopener";
  });
  root.querySelectorAll("[data-instagram]").forEach((el) => {
    el.href = CONFIG.instagramUrl;
    el.target = "_blank";
    el.rel = "noopener";
  });
}

/** Quando a foto ainda não existe, mostra um placeholder elegante com o nome do arquivo */
function handleMissingImages(root = document) {
  root.querySelectorAll(".media img").forEach((img) => {
    const wrap = img.closest(".media");
    const markEmpty = () => wrap.classList.add("is-empty");
    const markLoaded = () => wrap.classList.remove("is-empty");
    if (img.complete) {
      img.naturalWidth === 0 ? markEmpty() : markLoaded();
    }
    img.addEventListener("error", markEmpty);
    img.addEventListener("load", markLoaded);
  });
}

/** Renderiza os cards de produtos em destaque */
function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map((p) => {
    const badgeClass = p.badge ? `product-card__badge--${p.badge.toLowerCase()}` : "";
    const message = CONFIG.productMessage.replace("{produto}", p.name);
    return `
      <article class="product-card">
        <figure class="media product-card__media" data-label="${esc(p.image)}">
          ${p.badge ? `<span class="product-card__badge ${badgeClass}">${esc(p.badge)}</span>` : ""}
          <img src="${IMAGE_PATH}${esc(p.image)}" alt="${esc(p.name)}" width="800" height="800" loading="lazy">
        </figure>
        <div class="product-card__body">
          <span class="product-card__cat">${esc(p.category)}</span>
          <h3 class="product-card__name">${esc(p.name)}</h3>
          <p class="product-card__desc">${esc(p.description)}</p>
          ${p.price ? `<p class="product-card__price">${esc(p.price)}</p>` : ""}
          <div class="product-card__cta">
            <a class="btn" href="#" data-wa data-wa-msg="${esc(message)}" aria-label="Quero esse: ${esc(p.name)}">Quero esse</a>
          </div>
        </div>
      </article>`;
  }).join("");
}

/** Preenche as subcategorias e informações de contato (itens vazios ficam ocultos) */
function renderConfigContent() {
  const fillChips = (id, list) => {
    const ul = document.getElementById(id);
    if (!ul || !list.length) return;
    ul.innerHTML = list.map((item) => `<li>${esc(item)}</li>`).join("");
    ul.hidden = false;
  };
  fillChips("makeupChips", CONFIG.makeupSubcategories);
  fillChips("accessoryChips", CONFIG.accessorySubcategories);

  document.querySelectorAll("[data-info]").forEach((li) => {
    const value = CONFIG[li.dataset.info];
    if (value) li.querySelector("span").textContent = value;
    else li.remove();
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

/** Header com efeito ao rolar + botão flutuante de WhatsApp */
function initScrollEffects() {
  const header = document.getElementById("header");
  const floatBtn = document.querySelector(".wa-float");
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 12);
    floatBtn?.classList.toggle("is-visible", y > window.innerHeight * 0.6);
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/** Menu mobile: abre/fecha, fecha com Esc, clique fora ou ao escolher um link */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  const backdrop = document.getElementById("navBackdrop");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    if (open) {
      backdrop.hidden = false;
      requestAnimationFrame(() => backdrop.classList.add("is-visible"));
      nav.querySelector("a")?.focus({ preventScroll: true });
    } else {
      backdrop.classList.remove("is-visible");
      setTimeout(() => { backdrop.hidden = true; }, 300);
    }
  };

  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  backdrop.addEventListener("click", () => setOpen(false));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
  // Fecha o menu se a tela crescer para desktop
  window.matchMedia("(min-width: 921px)").addEventListener("change", (e) => e.matches && setOpen(false));
}

/** Destaca no menu a seção visível */
function initActiveNav() {
  const links = [...document.querySelectorAll(".nav__list a[href^='#']")];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if (!("IntersectionObserver" in window) || !sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  sections.forEach((s) => observer.observe(s));
}

/* ---------- Inicialização ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderConfigContent();
  bindExternalLinks();
  handleMissingImages();
  initScrollEffects();
  initMobileNav();
  initActiveNav();
});
