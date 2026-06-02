// Indian Rupee formatter
function formatINR(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

// State Management
let state = {
  products: [],
  cart: [],
  currentProduct: null,
  selectedSize: null,
  selectedColor: null,
  activeFilter: 'all',
  sortBy: 'default',
  searchQuery: '',
  checkoutStep: 1,
  billing: {
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  }
};

// DOM References
const DOM = {
  header: document.querySelector('header'),
  productsGrid: document.getElementById('products-grid'),
  filterTabs: document.querySelectorAll('.filter-tab'),
  sortSelect: document.getElementById('sort-select'),
  searchInput: document.getElementById('search-input'),
  globalSearchInput: document.getElementById('global-search-input'),
  
  // Cart Drawer
  cartToggle: document.getElementById('cart-toggle'),
  cartDrawerOverlay: document.getElementById('cart-drawer-overlay'),
  cartClose: document.getElementById('cart-close'),
  cartItemsContainer: document.getElementById('cart-items-container'),
  cartCountBadge: document.getElementById('cart-count-badge'),
  cartItemCountHeader: document.getElementById('cart-item-count-header'),
  shippingProgressMsg: document.getElementById('shipping-progress-msg'),
  shippingProgressBar: document.getElementById('shipping-progress-bar'),
  cartSubtotal: document.getElementById('cart-subtotal'),
  cartCheckoutBtn: document.getElementById('cart-checkout-btn'),
  
  // Product Details Modal
  detailModalOverlay: document.getElementById('detail-modal-overlay'),
  detailCloseBtn: document.getElementById('detail-close-btn'),
  detailMainImg: document.getElementById('detail-main-img-el'),
  detailThumbnails: document.getElementById('detail-thumbnails'),
  detailCategory: document.getElementById('detail-category'),
  detailTitle: document.getElementById('detail-title'),
  detailRatingVal: document.getElementById('detail-rating-val'),
  detailReviewsCount: document.getElementById('detail-reviews-count'),
  detailPrice: document.getElementById('detail-price'),
  detailDescription: document.getElementById('detail-description'),
  detailSizes: document.getElementById('detail-sizes'),
  detailColors: document.getElementById('detail-colors'),
  detailFeatures: document.getElementById('detail-features'),
  detailAddToCartBtn: document.getElementById('detail-add-to-cart-btn'),
  
  // Checkout Modal
  checkoutModalOverlay: document.getElementById('checkout-modal-overlay'),
  checkoutCloseBtn: document.getElementById('checkout-close-btn'),
  checkoutSteps: document.querySelectorAll('.checkout-step-indicator'),
  checkoutPanels: document.querySelectorAll('.checkout-panel'),
  checkoutNextBtn: document.getElementById('checkout-next-btn'),
  checkoutBackBtn: document.getElementById('checkout-back-btn'),
  checkoutSummaryItems: document.getElementById('checkout-summary-items'),
  checkoutSubtotal: document.getElementById('checkout-subtotal'),
  checkoutShipping: document.getElementById('checkout-shipping'),
  checkoutTax: document.getElementById('checkout-tax'),
  checkoutTotal: document.getElementById('checkout-total'),
  successOrderId: document.getElementById('success-order-id'),
  
  // Checkout Inputs
  shippingForm: document.getElementById('shipping-form'),
  paymentForm: document.getElementById('payment-form'),
  cardNumInput: document.getElementById('card-number-input'),
  cardNameInput: document.getElementById('card-name-input'),
  cardExpiryInput: document.getElementById('card-expiry-input'),
  cardCvvInput: document.getElementById('card-cvv-input'),
  
  // Card Mockup
  mockCardNumber: document.getElementById('mock-card-number'),
  mockCardName: document.getElementById('mock-card-name'),
  mockCardExpiry: document.getElementById('mock-card-expiry'),
  mockCard: document.getElementById('mock-credit-card'),
  
  // Lookbook Slider
  lookbookSlider: document.getElementById('lookbook-slider'),
  lookbookPrev: document.getElementById('lookbook-prev'),
  lookbookNext: document.getElementById('lookbook-next'),
  
  // Mobile Navigation
  mobileMenuBtn: document.getElementById('mobile-menu-btn'),
  navMenu: document.querySelector('header nav')
};

// Initialize Application
function initApp() {
  // Load mock products
  state.products = window.PRODUCTS || [];
  
  // Load Cart from localStorage
  loadCart();
  
  // Setup Event Listeners
  setupEventListeners();
  
  // Render catalog
  renderCatalog();
  
  // Initial cart UI update
  updateCartUI();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Load Cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem('global_grab_cart');
  if (savedCart) {
    try {
      state.cart = JSON.parse(savedCart);
    } catch (e) {
      state.cart = [];
    }
  }
}

// Save Cart to localStorage
function saveCart() {
  localStorage.setItem('global_grab_cart', JSON.stringify(state.cart));
}

// Render catalog products based on current active filters & search queries
function renderCatalog() {
  let filtered = [...state.products];

  // Apply type filtering
  if (state.activeFilter === 'baggy') {
    filtered = filtered.filter(p => p.type === 'baggy');
  } else if (state.activeFilter === 'super-baggy') {
    filtered = filtered.filter(p => p.type === 'super-baggy');
  }

  // Apply search query filtering
  if (state.searchQuery.trim() !== '') {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.features.some(f => f.toLowerCase().includes(q))
    );
  }

  // Apply sorting
  if (state.sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  if (filtered.length === 0) {
    DOM.productsGrid.innerHTML = `
      <div class="cart-empty-state" style="grid-column: 1 / -1; padding: 4rem 0;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
        </svg>
        <p>Koi product nahi mila.</p>
        <button class="btn-secondary" onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  // Build one product card HTML
  function buildCard(product) {
    const fullStars = Math.floor(product.rating);
    const halfStar = product.rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    let starsHtml = '';
    for(let i=0; i<fullStars; i++) starsHtml += `<svg fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
    if(halfStar) starsHtml += `<svg fill="currentColor" viewBox="0 0 20 20" style="opacity:0.5;"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
    for(let i=0; i<emptyStars; i++) starsHtml += `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="opacity:0.3;"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499c.15-.469.83-.469.98 0l2.64 8.12a1 1 0 00.95.69h8.518c.5 0 .708.63.302.946l-6.89 5.003a1 1 0 00-.364 1.118l2.64 8.12c.15.469-.383.856-.8.566l-6.89-5.004a1 1 0 00-1.175 0l-6.89 5.004c-.417.29-.95-.097-.8-.566l2.64-8.12a1 1 0 00-.364-1.118L2.43 13.265c-.406-.317-.198-.946.302-.946h8.518a1 1 0 00.95-.69l2.64-8.12z"/></svg>`;
    return `
      <article class="product-card" data-id="${product.id}">
        <div class="product-img-wrapper">
          ${product.rating >= 4.9 ? '<span class="product-badge">Best Seller</span>' : ''}
          <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
          <div class="product-quick-view">
            <button onclick="openProductDetail('${product.id}')">Quick View</button>
          </div>
        </div>
        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3 class="product-title">${product.name}</h3>
          <div class="product-rating">
            ${starsHtml}
            <span>(${product.reviewsCount})</span>
          </div>
          <div class="product-bottom">
            <span class="product-price">${formatINR(product.price)}</span>
            <button class="product-add-btn" aria-label="Add to cart" onclick="quickAddToCart('${product.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  // Gold divider heading for sections
  function sectionDivider(label, emoji, count) {
    return `
      <div style="grid-column:1/-1; display:flex; align-items:center; gap:1.2rem; margin:2rem 0 0.5rem;">
        <div style="flex:1; height:1px; background:linear-gradient(to right, rgba(212,175,55,0.5), transparent);"></div>
        <div style="text-align:center;">
          <span style="font-family:var(--font-display); font-size:1.6rem; font-weight:800; letter-spacing:-0.02em; background:linear-gradient(135deg,#D4AF37,#FFD700); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">
            ${emoji} ${label}
          </span>
          <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem; font-weight:500;">${count} styles available</div>
        </div>
        <div style="flex:1; height:1px; background:linear-gradient(to left, rgba(212,175,55,0.5), transparent);"></div>
      </div>
    `;
  }

  // Show ALL → two divided sections
  if (state.activeFilter === 'all') {
    const baggys = filtered.filter(p => p.type === 'baggy');
    const superBaggys = filtered.filter(p => p.type === 'super-baggy');
    let html = '';
    if (baggys.length > 0) {
      html += sectionDivider('Baggy Jeans', '🔵', baggys.length);
      html += baggys.map(buildCard).join('');
    }
    if (superBaggys.length > 0) {
      html += sectionDivider('Super Baggy', '🔥', superBaggys.length);
      html += superBaggys.map(buildCard).join('');
    }
    DOM.productsGrid.innerHTML = html;
  } else {
    // Filtered single section
    DOM.productsGrid.innerHTML = filtered.map(buildCard).join('');
  }
}

// Reset filter tabs and inputs
window.resetFilters = function() {
  state.activeFilter = 'all';
  state.searchQuery = '';
  state.sortBy = 'default';
  
  if (DOM.searchInput) DOM.searchInput.value = '';
  if (DOM.globalSearchInput) DOM.globalSearchInput.value = '';
  if (DOM.sortSelect) DOM.sortSelect.value = 'default';
  
  DOM.filterTabs.forEach(tab => {
    if (tab.dataset.filter === 'all') {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  renderCatalog();
};

// Event Listeners Setup
function setupEventListeners() {
  // Sticky header transition
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      DOM.header.classList.add('scrolled');
    } else {
      DOM.header.classList.remove('scrolled');
    }
  });

  // Mobile hamburger menu toggle
  if (DOM.mobileMenuBtn) {
    DOM.mobileMenuBtn.addEventListener('click', () => {
      DOM.navMenu.style.display = DOM.navMenu.style.display === 'flex' ? 'none' : 'flex';
      DOM.navMenu.style.position = 'absolute';
      DOM.navMenu.style.top = '100%';
      DOM.navMenu.style.left = '0';
      DOM.navMenu.style.width = '100%';
      DOM.navMenu.style.background = 'rgba(10, 10, 12, 0.95)';
      DOM.navMenu.style.backdropFilter = 'blur(10px)';
      DOM.navMenu.style.padding = '2rem';
      DOM.navMenu.style.flexDirection = 'column';
      DOM.navMenu.style.alignItems = 'center';
      DOM.navMenu.style.borderBottom = '1px solid var(--border-color)';
    });
  }

  // Filter tabs click listeners
  DOM.filterTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      DOM.filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.activeFilter = tab.dataset.filter;
      renderCatalog();
      
      // Scroll smoothly to products grid
      document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Sort dropdown
  if (DOM.sortSelect) {
    DOM.sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderCatalog();
    });
  }

  // Search input filters (catalog page)
  if (DOM.searchInput) {
    DOM.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderCatalog();
    });
  }

  // Global search input filters (header page)
  if (DOM.globalSearchInput) {
    DOM.globalSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      
      // Sync inputs if on same page
      if (DOM.searchInput) DOM.searchInput.value = e.target.value;
      
      renderCatalog();
      
      // Ensure we are viewing catalog
      document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Cart Drawer open/close events
  DOM.cartToggle.addEventListener('click', toggleCartDrawer);
  DOM.cartClose.addEventListener('click', toggleCartDrawer);
  DOM.cartDrawerOverlay.addEventListener('click', (e) => {
    if (e.target === DOM.cartDrawerOverlay) toggleCartDrawer();
  });

  // Product detail modal close events
  DOM.detailCloseBtn.addEventListener('click', closeProductDetail);
  DOM.detailModalOverlay.addEventListener('click', (e) => {
    if (e.target === DOM.detailModalOverlay) closeProductDetail();
  });

  // Detail Modal Add to Cart
  DOM.detailAddToCartBtn.addEventListener('click', addToCartFromDetail);

  // Lookbook slider arrow navigation
  if (DOM.lookbookSlider) {
    DOM.lookbookPrev.addEventListener('click', () => {
      DOM.lookbookSlider.scrollBy({ left: -DOM.lookbookSlider.clientWidth, behavior: 'smooth' });
    });
    DOM.lookbookNext.addEventListener('click', () => {
      DOM.lookbookSlider.scrollBy({ left: DOM.lookbookSlider.clientWidth, behavior: 'smooth' });
    });
  }

  // Checkout modal actions
  DOM.cartCheckoutBtn.addEventListener('click', openCheckoutModal);
  DOM.checkoutCloseBtn.addEventListener('click', closeCheckoutModal);
  DOM.checkoutModalOverlay.addEventListener('click', (e) => {
    if (e.target === DOM.checkoutModalOverlay) closeCheckoutModal();
  });

  DOM.checkoutNextBtn.addEventListener('click', handleCheckoutNext);
  DOM.checkoutBackBtn.addEventListener('click', handleCheckoutBack);

  // Credit card dynamic visualization listeners
  setupCardVisuals();
}

// Toggle Cart Drawer
function toggleCartDrawer() {
  DOM.cartDrawerOverlay.classList.toggle('active');
  document.body.style.overflow = DOM.cartDrawerOverlay.classList.contains('active') ? 'hidden' : '';
}

// Update Cart Subtotals & Dynamic UI Items
function updateCartUI() {
  // Update badge number
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (totalItems > 0) {
    DOM.cartCountBadge.textContent = totalItems;
    DOM.cartCountBadge.classList.add('active');
  } else {
    DOM.cartCountBadge.classList.remove('active');
  }
  
  DOM.cartItemCountHeader.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;

  // Update lists
  if (state.cart.length === 0) {
    DOM.cartItemsContainer.innerHTML = `
      <div class="cart-empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        <p>Aapki cart abhi khaali hai.</p>
        <button class="btn-primary" onclick="toggleCartDrawer()">Jeans Dekho</button>
      </div>
    `;
    DOM.cartCheckoutBtn.disabled = true;
    DOM.cartCheckoutBtn.style.opacity = '0.5';
    DOM.cartSubtotal.textContent = '₹0';
    
    // Progress
    DOM.shippingProgressMsg.innerHTML = `Items add karo aur pao <span>Free Shipping</span>`;
    DOM.shippingProgressBar.style.width = '0%';
  } else {
    DOM.cartCheckoutBtn.disabled = false;
    DOM.cartCheckoutBtn.style.opacity = '1';
    
    DOM.cartItemsContainer.innerHTML = state.cart.map((item, index) => {
      return `
        <div class="cart-item">
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <div>
              <h4 class="cart-item-title">${item.name}</h4>
              <div class="cart-item-meta">
                <span>Size: ${item.size}</span>
                <span>
                  Color: <span class="cart-color-dot" style="background-color: ${item.color.hex};"></span> ${item.color.name}
                </span>
              </div>
            </div>
            <div class="cart-item-actions">
              <div class="quantity-control">
                <button class="quantity-btn" onclick="updateItemQty(${index}, -1)">-</button>
                <span class="quantity-val">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateItemQty(${index}, 1)">+</button>
              </div>
              <button class="cart-item-remove" onclick="removeCartItem(${index})">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Remove
              </button>
            </div>
          </div>
          <div class="cart-item-price">${formatINR(item.price * item.quantity)}</div>
        </div>
      `;
    }).join('');
    
    // Calculate values
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    DOM.cartSubtotal.textContent = formatINR(subtotal);
    state.billing.subtotal = subtotal;
    
    // Free Shipping Progress (₹5000 threshold)
    const freeShippingThreshold = 5000;
    if (subtotal >= freeShippingThreshold) {
      DOM.shippingProgressMsg.innerHTML = `🎉 You qualify for <span>FREE SHIPPING</span>!`;
      DOM.shippingProgressBar.style.width = '100%';
    } else {
      const remaining = freeShippingThreshold - subtotal;
      const progressPercent = (subtotal / freeShippingThreshold) * 100;
      DOM.shippingProgressMsg.innerHTML = `Spend <span>${formatINR(remaining)}</span> more for free shipping`;
      DOM.shippingProgressBar.style.width = `${progressPercent}%`;
    }
  }
}

// Update Item Quantity
window.updateItemQty = function(index, delta) {
  state.cart[index].quantity += delta;
  
  if (state.cart[index].quantity <= 0) {
    state.cart.splice(index, 1);
  }
  
  saveCart();
  updateCartUI();
};

// Remove item from cart
window.removeCartItem = function(index) {
  state.cart.splice(index, 1);
  saveCart();
  updateCartUI();
};

// Add to Cart helper
function addItemToCart(product, size, color) {
  // Check if item exists
  const existingItemIndex = state.cart.findIndex(item => 
    item.id === product.id && 
    item.size === size && 
    item.color.name === color.name
  );
  
  if (existingItemIndex > -1) {
    state.cart[existingItemIndex].quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: size,
      color: color,
      quantity: 1
    });
  }
  
  saveCart();
  updateCartUI();
  
  // Show temporary toast or feedback
  showCartFeedback();
}

// Toast Feedback animation for adding to cart
function showCartFeedback() {
  // Briefly open the drawer to show addition, or animate cart badge
  DOM.cartCountBadge.style.animation = 'scaleBounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  setTimeout(() => {
    DOM.cartCountBadge.style.animation = '';
  }, 400);

  // Auto-slide open cart to give strong UX cue, then close after 1.5s
  toggleCartDrawer();
  setTimeout(() => {
    // Only auto-close if checkout or modal isn't active
    if (DOM.cartDrawerOverlay.classList.contains('active') && 
        !DOM.detailModalOverlay.classList.contains('active') && 
        !DOM.checkoutModalOverlay.classList.contains('active')) {
      toggleCartDrawer();
    }
  }, 1800);
}

// Add directly from catalog grid using defaults
window.quickAddToCart = function(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;
  
  // Pick default sizes/colors
  const defaultSize = product.sizes[0];
  const defaultColor = product.colors[0];
  
  addItemToCart(product, defaultSize, defaultColor);
};

// Open Product Detailed View Dialog
window.openProductDetail = function(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;
  
  state.currentProduct = product;
  state.selectedSize = product.sizes[0];
  state.selectedColor = product.colors[0];
  
  // Display Info
  DOM.detailCategory.textContent = product.category;
  DOM.detailTitle.textContent = product.name;
  DOM.detailPrice.textContent = formatINR(product.price);
  DOM.detailDescription.textContent = product.description;
  DOM.detailRatingVal.textContent = product.rating;
  DOM.detailReviewsCount.textContent = `(${product.reviewsCount} verified reviews)`;
  
  // Render main image
  DOM.detailMainImg.innerHTML = `<img src="${product.images[0]}" alt="${product.name}">`;
  
  // Render thumbnails
  if (product.images.length > 1) {
    DOM.detailThumbnails.innerHTML = product.images.map((img, idx) => `
      <div class="detail-thumb ${idx === 0 ? 'active' : ''}" onclick="selectGalleryImage(this, '${img}')">
        <img src="${img}" alt="${product.name}">
      </div>
    `).join('');
    DOM.detailThumbnails.style.display = 'flex';
  } else {
    DOM.detailThumbnails.style.display = 'none';
  }
  
  // Render Size chips
  DOM.detailSizes.innerHTML = product.sizes.map(size => `
    <button class="size-chip ${size === state.selectedSize ? 'active' : ''}" onclick="selectDetailSize(this, '${size}')">
      ${size}
    </button>
  `).join('');
  
  // Render Color rings
  DOM.detailColors.innerHTML = product.colors.map(color => `
    <div class="color-ring ${color.name === state.selectedColor.name ? 'active' : ''}" onclick="selectDetailColor(this, '${color.name}')">
      <span class="color-swatch" style="background-color: ${color.hex};" title="${color.name}"></span>
    </div>
  `).join('');
  
  // Render Bullet features
  DOM.detailFeatures.innerHTML = product.features.map(feat => `
    <li>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
      ${feat}
    </li>
  `).join('');
  
  // Display modal overlay
  DOM.detailModalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

// Close Product Detailed View Dialog
function closeProductDetail() {
  DOM.detailModalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  state.currentProduct = null;
}

// Select gallery image thumbnail
window.selectGalleryImage = function(thumbEl, imgSrc) {
  document.querySelectorAll('.detail-thumb').forEach(t => t.classList.remove('active'));
  thumbEl.classList.add('active');
  DOM.detailMainImg.querySelector('img').src = imgSrc;
};

// Size Selection handler
window.selectDetailSize = function(buttonEl, size) {
  document.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
  buttonEl.classList.add('active');
  state.selectedSize = size;
};

// Color Selection handler
window.selectDetailColor = function(ringEl, colorName) {
  document.querySelectorAll('.color-ring').forEach(r => r.classList.remove('active'));
  ringEl.classList.add('active');
  state.selectedColor = state.currentProduct.colors.find(c => c.name === colorName);
};

// Add to Cart from Detail Dialog
function addToCartFromDetail() {
  if (!state.currentProduct || !state.selectedSize || !state.selectedColor) return;
  addItemToCart(state.currentProduct, state.selectedSize, state.selectedColor);
  closeProductDetail();
}

/* --- CHECKOUT SYSTEM --- */

// Open Checkout Multi-step modal
function openCheckoutModal() {
  // If cart is empty, do nothing
  if (state.cart.length === 0) return;
  
  // Close cart drawer
  DOM.cartDrawerOverlay.classList.remove('active');
  
  // Initialize state
  state.checkoutStep = 1;
  updateCheckoutStepUI();
  renderCheckoutSummary();
  
  DOM.checkoutModalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close Checkout Multi-step modal
function closeCheckoutModal() {
  DOM.checkoutModalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Render checkout cart billing breakdown
function renderCheckoutSummary() {
  DOM.checkoutSummaryItems.innerHTML = state.cart.map(item => {
      return `
    <div class="cart-item" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem;">
      <div class="cart-item-img" style="width: 50px; height: 60px;">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details" style="flex-grow: 1;">
        <h5 style="font-size: 0.85rem; font-weight: 600; line-height: 1.2;">${item.name}</h5>
        <span style="font-size: 0.75rem; color: var(--text-secondary);">Qty: ${item.quantity} | Size: ${item.size}</span>
      </div>
      <div style="font-family: var(--font-display); font-weight: 600; font-size: 0.9rem;">${formatINR(item.price * item.quantity)}</div>
    </div>
  `;
    }).join('');
  
  // Calculation
  const subtotal = state.billing.subtotal;
  const shipping = subtotal >= 5000 ? 0 : 99; // ₹99 shipping or FREE above ₹5000
  const tax = subtotal * 0.18; // 18% GST (India)
  const total = subtotal + shipping + tax;
  
  state.billing.shipping = shipping;
  state.billing.tax = tax;
  state.billing.total = total;
  
  DOM.checkoutSubtotal.textContent = formatINR(subtotal);
  DOM.checkoutShipping.textContent = shipping === 0 ? 'FREE' : formatINR(shipping);
  DOM.checkoutTax.textContent = formatINR(Math.round(tax));
  DOM.checkoutTotal.textContent = formatINR(Math.round(total));
}

// Multi-step Navigation
function updateCheckoutStepUI() {
  // Step header indicator highlighting
  DOM.checkoutSteps.forEach((indicator, idx) => {
    const stepNum = idx + 1;
    indicator.classList.remove('active', 'completed');
    
    if (stepNum === state.checkoutStep) {
      indicator.classList.add('active');
    } else if (stepNum < state.checkoutStep) {
      indicator.classList.add('completed');
    }
  });

  // Step panel visibility
  DOM.checkoutPanels.forEach((panel, idx) => {
    const stepNum = idx + 1;
    panel.classList.remove('active');
    if (stepNum === state.checkoutStep) {
      panel.classList.add('active');
    }
  });

  // Footer button configurations
  if (state.checkoutStep === 1) {
    DOM.checkoutBackBtn.style.display = 'none';
    DOM.checkoutNextBtn.textContent = 'Continue to Payment';
    DOM.checkoutNextBtn.style.display = 'flex';
  } else if (state.checkoutStep === 2) {
    DOM.checkoutBackBtn.style.display = 'flex';
    DOM.checkoutNextBtn.textContent = `Pay ${formatINR(Math.round(state.billing.total))}`;
    DOM.checkoutNextBtn.style.display = 'flex';
  } else {
    // Success panel
    DOM.checkoutBackBtn.style.display = 'none';
    DOM.checkoutNextBtn.style.display = 'none';
  }
}

// Validate inputs of step 1 (Shipping Form)
function validateShippingForm() {
  const inputs = DOM.shippingForm.querySelectorAll('input[required]');
  let isValid = true;
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = 'var(--color-accent-pink)';
      isValid = false;
    } else {
      input.style.borderColor = '';
    }
  });
  return isValid;
}

// Validate inputs of step 2 (Payment Form)
function validatePaymentForm() {
  const inputs = DOM.paymentForm.querySelectorAll('input[required]');
  let isValid = true;
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = 'var(--color-accent-pink)';
      isValid = false;
    } else {
      input.style.borderColor = '';
    }
  });
  return isValid;
}

// Next Step Action
function handleCheckoutNext() {
  if (state.checkoutStep === 1) {
    if (validateShippingForm()) {
      state.checkoutStep = 2;
      updateCheckoutStepUI();
    }
  } else if (state.checkoutStep === 2) {
    if (validatePaymentForm()) {
      // Mock payment loading processing
        DOM.checkoutNextBtn.disabled = true;
      DOM.checkoutNextBtn.textContent = 'Processing Payment...';
      
      setTimeout(() => {
        // Complete checkout
        state.checkoutStep = 3;
        DOM.checkoutNextBtn.disabled = false;
        
        // Generate random order ID
        const orderId = 'GG-' + Math.floor(100000 + Math.random() * 900000);
        DOM.successOrderId.textContent = orderId;
        
        updateCheckoutStepUI();
        
        // Success actions: Clear cart
        state.cart = [];
        saveCart();
        updateCartUI();
        
        // Trigger visual celebration (confetti)
        triggerConfetti();
      }, 1500);
    }
  }
}

// Back Step Action
function handleCheckoutBack() {
  if (state.checkoutStep > 1) {
    state.checkoutStep--;
    updateCheckoutStepUI();
  }
}

// Setup payment field visual mockup syncing
function setupCardVisuals() {
  if (!DOM.cardNumInput) return;
  
  DOM.cardNumInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || '';
    e.target.value = formatted;
    
    DOM.mockCardNumber.textContent = formatted || '•••• •••• •••• ••••';
    
    // Choose dynamic card themes based on first digits
    if (val.startsWith('4')) {
      DOM.mockCard.className = 'credit-card cyan-blue';
    } else {
      DOM.mockCard.className = 'credit-card';
    }
  });

  DOM.cardNameInput.addEventListener('input', (e) => {
    DOM.mockCardName.textContent = e.target.value || 'CARDHOLDER NAME';
  });

  DOM.cardExpiryInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    e.target.value = val;
    DOM.mockCardExpiry.textContent = val || 'MM/YY';
  });

  DOM.cardCvvInput.addEventListener('input', (e) => {
    // limit 3 digits
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
  });
}

// Simple CSS-based Confetti visual celebration
function triggerConfetti() {
  const colors = ['#7000ff', '#ff3366', '#00f0ff', '#bbff00'];
  const confettiCount = 100;
  const overlay = DOM.checkoutModalOverlay;

  for (let i = 0; i < confettiCount; i++) {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.width = Math.random() * 8 + 5 + 'px';
    el.style.height = Math.random() * 8 + 5 + 'px';
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.top = '10%';
    el.style.left = '50%';
    el.style.borderRadius = '50%';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9999';
    overlay.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 15 + 10;
    let x = 0;
    let y = 0;
    let dx = Math.cos(angle) * velocity;
    let dy = Math.sin(angle) * velocity - 10; // negative bias to shoot upwards first
    const gravity = 0.5;

    let frames = 0;
    function updateConfetti() {
      x += dx;
      y += dy;
      dy += gravity;
      dx *= 0.98; // air resistance
      
      el.style.transform = `translate(${x}px, ${y}px) rotate(${frames * 3}deg)`;
      frames++;

      if (y < window.innerHeight && frames < 120) {
        requestAnimationFrame(updateConfetti);
      } else {
        el.remove();
      }
    }
    requestAnimationFrame(updateConfetti);
  }
}

/* --- 3D MOUSE TRACKING TILT EFFECT --- */

function apply3DTilt() {
  // Product Cards 3D Tilt
  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const maxDist = 350;

      if (Math.abs(distX) < maxDist && Math.abs(distY) < maxDist) {
        const rotateX = -(distY / maxDist) * 12;
        const rotateY = (distX / maxDist) * 12;
        const scale = 1.04;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
        card.style.transition = 'transform 0.1s ease';

        // Golden shimmer highlight that follows mouse
        const shimmerX = ((distX / maxDist) + 1) * 50;
        const shimmerY = ((distY / maxDist) + 1) * 50;
        card.style.background = `radial-gradient(circle at ${shimmerX}% ${shimmerY}%, rgba(212,175,55,0.08) 0%, rgba(19,19,22,0.6) 60%)`;
      } else {
        // Reset when mouse moves away
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
        card.style.transition = 'transform 0.4s ease';
        card.style.background = 'rgba(19,19,22,0.6)';
      }
    });
  });

  // Category Cards subtle 3D tilt
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = -((y - centerY) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0) scale(1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    });
  });

  // Hero heading floating animation
  const heroH1 = document.querySelector('.hero h1');
  if (heroH1) {
    heroH1.style.animation = 'heroFloat 4s ease-in-out infinite';
  }
}

// Floating animation keyframe (inject dynamically)
const floatStyle = document.createElement('style');
floatStyle.textContent = `
  @keyframes heroFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes cardGlow {
    0%, 100% { box-shadow: 0 30px 80px rgba(0,0,0,0.6), 0 10px 30px rgba(212,175,55,0.1); }
    50% { box-shadow: 0 30px 80px rgba(0,0,0,0.6), 0 10px 40px rgba(212,175,55,0.25); }
  }
  .product-card:hover {
    animation: cardGlow 2s ease-in-out infinite;
  }
`;
document.head.appendChild(floatStyle);

// Re-apply 3D tilt after catalog re-renders
const _origRenderCatalog = window.renderCatalog || renderCatalog;

function initTiltOnReady() {
  apply3DTilt();
  // Re-apply on catalog mutations
  const observer = new MutationObserver(() => apply3DTilt());
  const grid = document.getElementById('products-grid');
  if (grid) observer.observe(grid, { childList: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTiltOnReady);
} else {
  initTiltOnReady();
}
