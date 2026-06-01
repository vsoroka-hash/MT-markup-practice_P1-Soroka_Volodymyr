// Make setupSlider globally accessible for api.js to call after dynamic render
window.setupSlider = (
  wrapperSelector,
  listSelector,
  prevSelector,
  nextSelector,
  dotsContainerSelector,
) => {
  const wrapper = document.querySelector(wrapperSelector);
  if (!wrapper) return;

  const list = wrapper.querySelector(listSelector);
  const prevBtn = wrapper.querySelector(prevSelector);
  const nextBtn = wrapper.querySelector(nextSelector);
  const dotsContainer = wrapper.querySelector(dotsContainerSelector);

  if (!list) return;

  let dots = [];
  const initDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    // Calculate how many visible items per view
    const listRect = list.getBoundingClientRect();
    const itemRect = list.children[0].getBoundingClientRect();
    const gap = parseFloat(window.getComputedStyle(list).gap) || 0;
    const itemsPerView = Math.floor((listRect.width + gap) / (itemRect.width + gap)) || 1;
    
    const itemsCount = list.children.length;
    // Total dots needed = total items - items per view + 1 (so we don't have unreachable dots at the end)
    const dotsCount = Math.max(1, itemsCount - itemsPerView + 1);

    for (let i = 0; i < dotsCount; i++) {
      const li = document.createElement("li");
      li.classList.add("dot");
      if (i === 0) li.classList.add("active");
      dotsContainer.appendChild(li);
    }
    dots = dotsContainer.querySelectorAll(".dot");
  };
  
  if (list.children.length > 0) {
    initDots();
  }

  const updateButtons = () => {
    if (!prevBtn && !nextBtn) return;
    const scrollPos = Math.ceil(list.scrollLeft);
    // clientWidth doesn't include padding, use offsetWidth if box-sizing is border-box, or just rely on scrollWidth - clientWidth which is correct standard. However, JS rounding issues can cause it to be off by 1-2px.
    const maxScroll = Math.floor(list.scrollWidth - list.clientWidth);

    if (prevBtn) prevBtn.disabled = scrollPos <= 0;
    if (nextBtn) nextBtn.disabled = scrollPos >= maxScroll - 2; // -2px tolerance for fractional pixel rounding
  };

  const scrollToItem = (index) => {
    const items = list.children;
    if (items.length === 0 || index < 0 || index >= items.length) return;
    const itemWidth = items[0].getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(list).gap) || 0;
    list.scrollTo({
      left: index * (itemWidth + gap),
      behavior: "smooth",
    });
  };

  const updateDots = () => {
    if (!dots.length) return;

    const scrollPos = list.scrollLeft;
    const itemWidth = list.children[0].getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(list).gap) || 0;
    const fullWidth = itemWidth + gap;

    const index = Math.round(scrollPos / fullWidth);

    dots.forEach((dot, i) => {
      // Ensure we don't go out of bounds if index is larger than dots
      dot.classList.toggle("active", i === Math.min(index, dots.length - 1));
    });
  };

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const itemWidth = list.children[0].getBoundingClientRect().width;
      const gap = parseFloat(window.getComputedStyle(list).gap) || 0;
      list.scrollBy({ left: -(itemWidth + gap), behavior: "smooth" });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const itemWidth = list.children[0].getBoundingClientRect().width;
      const gap = parseFloat(window.getComputedStyle(list).gap) || 0;
      list.scrollBy({ left: itemWidth + gap, behavior: "smooth" });
    });
  }

  if (dots.length) {
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        scrollToItem(index);
      });
    });
  }

  list.addEventListener("scroll", () => {
    requestAnimationFrame(() => {
      updateDots();
      updateButtons();
    });
  });

  // Handle window resize to recalculate dots
  window.addEventListener('resize', () => {
    if (list.children.length > 0) {
      initDots();
      updateDots();
      updateButtons();
      // Re-attach listeners for new dots
      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
          scrollToItem(index);
        });
      });
    }
  });

  // Initial call
  updateButtons();
};

// Feedback slider initialised immediately (static HTML)
setupSlider(
  '.feedback-slider-wrapper',
  '.feedbacks-list',
  '.feedback-prev-btn',
  '.feedback-next-btn',
  '.pagination-dots',
);

// NOTE: Bestsellers slider is initialised in api.js after data is loaded

