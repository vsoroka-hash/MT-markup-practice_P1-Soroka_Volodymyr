const LOCAL_URL = 'http://localhost:3000';
const REMOTE_URL = 'https://my-json-server.typicode.com/vsoroka-hash/MT-markup-practice_P1-Soroka_Volodymyr';
let BASE_URL = LOCAL_URL;

// Application state
const state = {
  currentPage: 1,
  limit: 4,
  currentQuery: '',
};

const refs = {
  bestsellersList: document.getElementById('bestsellers-list'),
  bouquetsList: document.getElementById('bouquets-list'),
  loadMoreBtn: document.getElementById('load-more-btn'),
  searchInput: document.getElementById('search-input'),
  backdrop: document.querySelector('[data-modal]'),
  openModalBtns: document.querySelectorAll('[data-modal-open]'),
  closeModalBtn: document.querySelector('[data-modal-close]'),
  modalForm: document.querySelector('.modal-form'),
  footerForm: document.querySelector('.footer-subscription-form'),
  loader: document.getElementById('catalogue-loader'),
  // Product Details modal
  productModal: document.getElementById('product-modal'),
  productModalClose: document.getElementById('product-modal-close'),
  productModalImg: document.getElementById('product-modal-img'),
  productModalSource: document.getElementById('product-modal-source'),
  productModalTitle: document.getElementById('product-modal-title'),
  productModalPrice: document.getElementById('product-modal-price-value'),
  productModalDesc: document.getElementById('product-modal-description'),
  productModalBuyBtn: document.querySelector('.product-modal-buy-btn'),
  // Order Modal
  orderModal: document.getElementById('order-modal'),
  orderModalClose: document.getElementById('order-modal-close'),
  orderForm: document.getElementById('order-form'),
};

// ==================== Loader ====================

function showLoader() {
  if (refs.loader) refs.loader.style.display = 'flex';
}

function hideLoader() {
  if (refs.loader) refs.loader.style.display = 'none';
}

// ==================== API requests ====================

async function fetchBestsellers() {
  try {
    const response = await axios.get(`${BASE_URL}/bestsellers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bestsellers:', error);
    return [];
  }
}

async function fetchBouquets(page, limit, query = '') {
  try {
    const params = {
      _page: page,
      _limit: limit,
    };
    if (query) {
      params.q = query;
    }
    const response = await axios.get(`${BASE_URL}/bouquets`, { params });
    // json-server returns total item count in X-Total-Count header
    const total = parseInt(response.headers['x-total-count'] ?? response.data.length, 10);
    return { data: response.data, total };
  } catch (error) {
    console.error('Error fetching bouquets:', error);
    return { data: [], total: 0 };
  }
}

// ==================== Rendering ====================

function renderBestsellers(items) {
  if (!refs.bestsellersList) return;
  const markup = items
    .map(
      item => `
      <li class="bestsellers-item">
        <picture>
          <source
            type="image/webp"
            srcset="
              ./images/${item.imageBase}-1x.webp 1x,
              ./images/${item.imageBase}-2x.webp 2x
            "
          />
          <img
            loading="lazy"
            src="./images/${item.imageBase}-1x.jpg"
            srcset="./images/${item.imageBase}-2x.jpg 2x"
            alt="${item.title}"
            class="bestsellers-img"
            width="400"
            height="320"
          />
        </picture>
        <h3 class="bestsellers-item-title">${item.title}</h3>
        <p class="text bestsellers-item-text">${item.description}</p>
        <p class="bestsellers-item-price">$${item.price}</p>
      </li>
    `
    )
    .join('');
  refs.bestsellersList.insertAdjacentHTML('beforeend', markup);
}

function renderBouquets(items) {
  if (!refs.bouquetsList) return;
  const markup = items
    .map(
      item => `
      <li class="catalogue-card" style="cursor:pointer;" data-id="${item.id}">
        <picture>
          <source
            type="image/webp"
            srcset="
              ./images/${item.imageBase}-1x.webp 1x,
              ./images/${item.imageBase}-2x.webp 2x
            "
          />
          <img
            loading="lazy"
            src="./images/${item.imageBase}-1x.jpg"
            srcset="./images/${item.imageBase}-2x.jpg 2x"
            alt="${item.title}"
            width="250"
            class="catalogue-img"
          />
        </picture>
        <h3 class="catalogue-item-title">${item.title}</h3>
        <p class="text bestsellers-item-text">${item.description}</p>
        <p class="catalogue-item-price">$${item.price}</p>
      </li>
    `
    )
    .join('');
  refs.bouquetsList.insertAdjacentHTML('beforeend', markup);
  // Attach product modal open listeners to newly rendered cards
  refs.bouquetsList.querySelectorAll('.catalogue-card:not([data-bound])').forEach(card => {
    card.setAttribute('data-bound', 'true');
    // Find the corresponding item by matching data-id
    const cardId = parseInt(card.getAttribute('data-id'));
    const item = items.find(i => i.id === cardId);
    if (item) {
      card.addEventListener('click', () => openProductModal(item));
    }
  });
}

// ==================== Data loading ====================

async function loadInitialData() {
  const bestsellers = await fetchBestsellers();
  renderBestsellers(bestsellers);
  // Re-init bestsellers slider after dynamic render (setupSlider is window.setupSlider from slider.js)
  if (typeof setupSlider === 'function') {
    setupSlider(
      '.bestsellers-slider-wrapper',
      '.bestsellers-list',
      '.bestsellers-prev-btn',
      '.bestsellers-next-btn',
      '.pagination-dots',
    );
  }
  // Attach product detail modal on bestseller cards
  if (refs.bestsellersList) {
    refs.bestsellersList.querySelectorAll('.bestsellers-item').forEach((card, index) => {
      card.style.cursor = 'pointer';
      const item = bestsellers[index];
      if (item) {
        card.addEventListener('click', () => openProductModal(item));
      }
    });
  }

  await loadBouquets();
}

async function loadBouquets() {
  showLoader();
  const { data: bouquets, total } = await fetchBouquets(state.currentPage, state.limit, state.currentQuery);
  hideLoader();

  // Handle empty state on first page — no results at all
  if (state.currentPage === 1 && bouquets.length === 0) {
    refs.bouquetsList.innerHTML = '<p class="text" style="text-align: center;">No bouquets found.</p>';
    refs.loadMoreBtn.style.display = 'none';
    return;
  }

  renderBouquets(bouquets);

  // How many items have been loaded in total so far
  const loadedSoFar = (state.currentPage - 1) * state.limit + bouquets.length;

  // Hide button immediately if we have loaded everything
  if (loadedSoFar >= total || bouquets.length < state.limit) {
    refs.loadMoreBtn.style.display = 'none';
  } else {
    refs.loadMoreBtn.style.display = 'inline-flex';
  }
}

// ==================== Event Listeners ====================

// Pagination — Load More
if (refs.loadMoreBtn) {
  refs.loadMoreBtn.addEventListener('click', async () => {
    state.currentPage += 1;
    await loadBouquets();
  });
}

// Filtering — Search input (debounced)
let searchDebounceTimer = null;
if (refs.searchInput) {
  refs.searchInput.addEventListener('input', (e) => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(async () => {
      state.currentQuery = e.target.value.trim();
      state.currentPage = 1;
      refs.bouquetsList.innerHTML = '';
      refs.loadMoreBtn.style.display = 'none';
      await loadBouquets();
    }, 300);
  });
}

// ==================== Forms ====================

if (refs.modalForm) {
  refs.modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Modal form submitted');
    refs.modalForm.reset();
    closeModal();
  });
}

if (refs.footerForm) {
  refs.footerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Footer form submitted');
    refs.footerForm.reset();
  });
}

// ==================== Contact Form Modal logic ====================

function openModal() {
  refs.backdrop.classList.add('is-open');
  document.body.classList.add('no-scroll');
}

function closeModal() {
  refs.backdrop.classList.remove('is-open');
  document.body.classList.remove('no-scroll');
}

// Open contact modal buttons (header/mobile menu)
refs.openModalBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
});

// Close by X button
if (refs.closeModalBtn) {
  refs.closeModalBtn.addEventListener('click', closeModal);
}

// Close by backdrop click
if (refs.backdrop) {
  refs.backdrop.addEventListener('click', (e) => {
    if (e.target === refs.backdrop) {
      closeModal();
    }
  });
}

// ==================== Product Details Modal logic ====================

function openProductModal(item) {
  // Populate content
  refs.productModalTitle.textContent = item.title;
  refs.productModalPrice.textContent = `$${item.price}`;
  refs.productModalDesc.textContent = item.description;

  const base = `./images/${item.imageBase}`;
  refs.productModalSource.srcset = `${base}-1x.webp 1x, ${base}-2x.webp 2x`;
  refs.productModalImg.src = `${base}-1x.jpg`;
  refs.productModalImg.srcset = `${base}-2x.jpg 2x`;
  refs.productModalImg.alt = item.title;

  // Reset quantity
  const qtyInput = document.getElementById('product-qty');
  if (qtyInput) qtyInput.value = 1;

  refs.productModal.classList.add('is-open');
  document.body.classList.add('no-scroll');
  refs.productModalClose.focus();
}

function closeProductModal() {
  refs.productModal.classList.remove('is-open');
  document.body.classList.remove('no-scroll');
}

// Close product modal by X button
if (refs.productModalClose) {
  refs.productModalClose.addEventListener('click', closeProductModal);
}

// Close product modal by backdrop click
if (refs.productModal) {
  refs.productModal.addEventListener('click', (e) => {
    if (e.target === refs.productModal) {
      closeProductModal();
    }
  });
}

// Close by Escape key (either modal)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (refs.backdrop.classList.contains('is-open')) closeModal();
    if (refs.productModal && refs.productModal.classList.contains('is-open')) closeProductModal();
    if (refs.orderModal && refs.orderModal.classList.contains('is-open')) closeOrderModal();
  }
});

// ==================== Order Modal logic ====================

function openOrderModal() {
  refs.orderModal.classList.add('is-open');
  document.body.classList.add('no-scroll');
}

function closeOrderModal() {
  refs.orderModal.classList.remove('is-open');
  if (!refs.productModal.classList.contains('is-open') && !refs.backdrop.classList.contains('is-open')) {
    document.body.classList.remove('no-scroll');
  }
}

if (refs.productModalBuyBtn) {
  refs.productModalBuyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeProductModal();
    openOrderModal();
  });
}

if (refs.orderModalClose) {
  refs.orderModalClose.addEventListener('click', closeOrderModal);
}

if (refs.orderModal) {
  refs.orderModal.addEventListener('click', (e) => {
    if (e.target === refs.orderModal) {
      closeOrderModal();
    }
  });
}

if (refs.orderForm) {
  refs.orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Order form submitted');
    refs.orderForm.reset();
    closeOrderModal();
  });
}

// ==================== Init ====================
async function init() {
  // Try local json-server first; if unavailable, switch to remote mock API
  try {
    await axios.get(`${LOCAL_URL}/bestsellers`);
    BASE_URL = LOCAL_URL;
  } catch {
    BASE_URL = REMOTE_URL;
  }
  await loadInitialData();
}

document.addEventListener('DOMContentLoaded', init);
