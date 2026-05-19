const BASE_URL = 'http://localhost:3000';

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
};

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
    return response.data;
  } catch (error) {
    console.error('Error fetching bouquets:', error);
    return [];
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
      <li>
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
}

// ==================== Data loading ====================

async function loadInitialData() {
  const bestsellers = await fetchBestsellers();
  renderBestsellers(bestsellers);

  await loadBouquets();
}

async function loadBouquets() {
  const bouquets = await fetchBouquets(state.currentPage, state.limit, state.currentQuery);
  renderBouquets(bouquets);

  // Handle empty state
  if (state.currentPage === 1 && bouquets.length === 0) {
    refs.bouquetsList.innerHTML = '<p class="text" style="text-align: center;">No bouquets found.</p>';
    refs.loadMoreBtn.style.display = 'none';
    return;
  }

  // Hide "Show More" if fewer items returned than limit (end of collection)
  if (bouquets.length < state.limit) {
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

// Filtering — Search input
if (refs.searchInput) {
  refs.searchInput.addEventListener('input', async (e) => {
    state.currentQuery = e.target.value.trim();
    state.currentPage = 1;
    refs.bouquetsList.innerHTML = '';
    await loadBouquets();
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

// ==================== Modal logic ====================

function openModal() {
  refs.backdrop.classList.add('is-open');
  document.body.classList.add('no-scroll');
}

function closeModal() {
  refs.backdrop.classList.remove('is-open');
  document.body.classList.remove('no-scroll');
}

// Open modal buttons
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

// Close by Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && refs.backdrop.classList.contains('is-open')) {
    closeModal();
  }
});

// ==================== Init ====================
document.addEventListener('DOMContentLoaded', loadInitialData);
