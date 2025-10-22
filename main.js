/* ===================================
   DryFruitMart - Main JavaScript
   Pure Vanilla JS with DOM Manipulation
   =================================== */

// ===================================
// PRODUCT DATA
// ===================================

const products = [
  {
    id: 1,
    name: "Premium Almonds",
    price: 799,
    category: "nuts",
    image: "img/Almond.jpg",
    description:
      "High-quality California almonds, rich in protein and vitamins. Perfect for snacking or cooking.",
    badge: "Bestseller",
  },
  {
    id: 2,
    name: "Medjool Dates",
    price: 599,
    category: "dates",
    image: "img/medjool.webp",
    description:
      "Premium Medjool dates from the finest farms. Naturally sweet and energy-rich.",
    badge: "Bestseller",
  },
  {
    id: 3,
    name: "Cashew Nuts",
    price: 899,
    category: "nuts",
    image: "img/cashew1.jpg",
    description:
      "Whole cashews from India, roasted to perfection. Creamy texture and rich taste.",
    badge: "Premium",
  },
  {
    id: 4,
    name: "Dried Cranberries",
    price: 449,
    category: "berries",
    image: "img/berries.jpg",
    description:
      "Tangy and sweet dried cranberries, packed with antioxidants and vitamins.",
    badge: "New",
  },
  {
    id: 5,
    name: "Walnut Halves",
    price: 699,
    category: "nuts",
    image: "img/walnut-1.jpg",
    description:
      "Premium walnut halves rich in Omega-3. Great for brain health.",
    badge: "",
  },
  {
    id: 6,
    name: "Mixed Nuts Gift Box",
    price: 1299,
    category: "giftbox",
    image: "img/mixedN.webp",
    description:
      "Premium gift box with a selection of finest almonds, cashews, pistachios and walnuts.",
    badge: "Gift",
  },
  {
    id: 7,
    name: "Dried Blueberries",
    price: 549,
    category: "berries",
    image: "img/blueberrie.jpg",
    description: "Sweet and chewy dried blueberries, loaded with antioxidants.",
    badge: "New",
  },
  {
    id: 8,
    name: "Pistachios",
    price: 999,
    category: "nuts",
    image: "img/pistachio-1.jpg",
    description:
      "Premium Turkish pistachios, lightly salted. Perfect for snacking.",
    badge: "Premium",
  },
  {
    id: 9,
    name: "Ajwa Dates",
    price: 899,
    category: "dates",
    image: "img/ajwaDate.jpg",
    description:
      "Sacred Ajwa dates from Medina, known for their health benefits.",
    badge: "Premium",
  },
  {
    id: 10,
    name: "Mixed Berry Box",
    price: 799,
    category: "berries",
    image: "img/mixedB.jpg",
    description:
      "Assorted dried berries including cranberries, blueberries and strawberries.",
    badge: "Bestseller",
  },
  {
    id: 11,
    name: "Hazelnuts",
    price: 649,
    category: "nuts",
    image: "img/hazelnuts-1.jpg",
    description: "Crunchy hazelnuts perfect for snacking or baking.",
    badge: "",
  },
  {
    id: 12,
    name: "Luxury Gift Hamper",
    price: 1999,
    category: "giftbox",
    image: "img/gift.jpg",
    description:
      "Ultimate gift hamper with premium selection of dry fruits in elegant packaging.",
    badge: "Gift",
  },
  {
    id: 13,
    name: "Brazil Nuts",
    price: 749,
    category: "nuts",
    image: "img/pecan.jpg",
    description: "Large Brazil nuts rich in selenium. Great for heart health.",
    badge: "",
  },
  {
    id: 14,
    name: "Goji Berries",
    price: 599,
    category: "berries",
    image: "img/gberries.jpg",
    description:
      "Superfood goji berries packed with antioxidants and vitamins.",
    badge: "New",
  },
  {
    id: 15,
    name: "Deglet Noor Dates",
    price: 449,
    category: "dates",
    image: "img/deglet.webp",
    description:
      "Semi-dry Deglet Noor dates with delicate honey-like sweetness.",
    badge: "",
  },
  {
    id: 16,
    name: "Premium Trail Mix",
    price: 849,
    category: "giftbox",
    image: "img/trail-mix.jpg",
    description:
      "Perfect blend of nuts, seeds and dried fruits for energy on the go.",
    badge: "Bestseller",
  },
];

// ===================================
// STATE MANAGEMENT
// ===================================

const AppState = {
  currentPage: "home",
  currentUser: null,
  cart: [],
  filters: {
    category: "all",
    search: "",
    sort: "default",
  },
};

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Get cart from localStorage
function getCart() {
  const cart = localStorage.getItem("dryfruitmart_cart");
  return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("dryfruitmart_cart", JSON.stringify(cart));
  AppState.cart = cart;
}

// Get user from localStorage
function getCurrentUser() {
  const user = localStorage.getItem("dryfruitmart_user");
  return user ? JSON.parse(user) : null;
}

// Save user to localStorage
function saveUser(user) {
  localStorage.setItem("dryfruitmart_user", JSON.stringify(user));
  AppState.currentUser = user;
}

// Logout user
function logoutUser() {
  localStorage.removeItem("dryfruitmart_user");
  AppState.currentUser = null;
  renderHeader();
  showToast("Logged out successfully");
}

// Add to cart
function addToCart(productId) {
  const cart = getCart();
  const product = products.find((p) => p.id === productId);

  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  saveCart(cart);
  updateCartCount();
  animateCartIcon();
  showToast(`${product.name} added to cart!`);
}

// Remove from cart
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
  updateCartCount();

  // Re-render cart page if we're on it
  if (AppState.currentPage === "cart") {
    renderCartPage();
  }
}

// Update cart quantity
function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find((item) => item.id === productId);

  if (item) {
    item.quantity = Math.max(1, quantity);
    saveCart(cart);

    // Re-render cart page
    if (AppState.currentPage === "cart") {
      renderCartPage();
    }
  }
}

// Update cart count in header
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.querySelector(".cart-count");

  if (cartCountEl) {
    cartCountEl.textContent = totalItems;
    cartCountEl.style.display = totalItems > 0 ? "block" : "none";
  }
}

// Animate cart icon
function animateCartIcon() {
  const cartIcon = document.querySelector(".cart-icon");
  if (cartIcon) {
    cartIcon.classList.add("cart-icon-pulse");
    setTimeout(() => {
      cartIcon.classList.remove("cart-icon-pulse");
    }, 500);
  }
}

// Show toast notification
function showToast(message) {
  // Remove existing toast
  const existingToast = document.querySelector(".toast");
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast
  const toast = document.createElement("div");
  toast.className = "toast show";
  toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;

  document.body.appendChild(toast);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Navigate to page
function navigateTo(page) {
  AppState.currentPage = page;
  renderPage();
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Close mobile menu if open
  const navMenu = document.querySelector(".nav-menu");
  if (navMenu) {
    navMenu.classList.remove("active");
  }
}

// ===================================
// HEADER COMPONENT
// ===================================

function renderHeader() {
  const user = getCurrentUser();

  return `
        <header id="header">
            <div class="header-container">
                <a href="#" class="logo" onclick="navigateTo('home'); return false;">
                    <i class="fas fa-leaf"></i>
                    DryFruitMart
                </a>
                
                <button class="mobile-menu-toggle" onclick="toggleMobileMenu()">
                    <i class="fas fa-bars"></i>
                </button>
                
                <nav>
                    <ul class="nav-menu">
                        <li><a href="#" onclick="navigateTo('home'); return false;">Home</a></li>
                        <li class="category-dropdown">
                            <button class="category-btn" onclick="toggleCategoryDropdown(event)">
                                Shop <i class="fas fa-chevron-down"></i>
                            </button>
                            <div class="dropdown-content">
                                <a href="#" onclick="navigateTo('shop'); setFilter('category', 'all'); return false;">All Products</a>
                                <a href="#" onclick="navigateTo('shop'); setFilter('category', 'nuts'); return false;">Nuts</a>
                                <a href="#" onclick="navigateTo('shop'); setFilter('category', 'dates'); return false;">Dates</a>
                                <a href="#" onclick="navigateTo('shop'); setFilter('category', 'berries'); return false;">Berries</a>
                                <a href="#" onclick="navigateTo('shop'); setFilter('category', 'giftbox'); return false;">Gift Boxes</a>
                            </div>
                        </li>
                        <li><a href="#" onclick="navigateTo('about'); return false;">About</a></li>
                        <li><a href="#" onclick="navigateTo('contact'); return false;">Contact</a></li>
                        <li><a href="#" onclick="navigateTo('career'); return false;">Career</a></li>
                    </ul>
                </nav>
                
                <div class="header-actions">
                    ${
                      user
                        ? `
                        <span class="user-name">Hello, ${user.name}</span>
                        <button class="header-btn" onclick="logoutUser()" title="Logout">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                    `
                        : `
                        <button class="header-btn" onclick="openLoginModal()" title="Login">
                            <i class="fas fa-user"></i>
                        </button>
                    `
                    }
                    <button class="header-btn cart-icon" onclick="navigateTo('cart')" title="Cart">
                        <i class="fas fa-shopping-cart"></i>
                        <span class="cart-count">0</span>
                    </button>
                </div>
            </div>
        </header>
    `;
}

// Toggle mobile menu
function toggleMobileMenu() {
  const navMenu = document.querySelector(".nav-menu");
  if (navMenu) {
    navMenu.classList.toggle("active");
  }
}

// Toggle category dropdown on mobile
function toggleCategoryDropdown(event) {
  event.preventDefault();
  const dropdown = event.target.closest(".category-dropdown");
  if (dropdown) {
    dropdown.classList.toggle("active");
  }
}

// ===================================
// FOOTER COMPONENT
// ===================================

function renderFooter() {
  return `
        <footer id="footer">
            <div class="footer-content">
                <div class="footer-section">
                    <h3><i class="fas fa-leaf"></i> DryFruitMart</h3>
                    <p>Your trusted source for premium quality dry fruits, nuts, dates, and berries. We deliver fresh, healthy products right to your doorstep.</p>
                    <div class="social-links">
                        <a href="#" class="social-icon" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="social-icon" title="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="social-icon" title="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="social-icon" title="Pinterest"><i class="fab fa-pinterest"></i></a>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul class="footer-links">
                        <li><a href="#" onclick="navigateTo('home'); return false;">Home</a></li>
                        <li><a href="#" onclick="navigateTo('shop'); return false;">Shop</a></li>
                        <li><a href="#" onclick="navigateTo('about'); return false;">About Us</a></li>
                        <li><a href="#" onclick="navigateTo('contact'); return false;">Contact</a></li>
                        <li><a href="#" onclick="navigateTo('career'); return false;">Careers</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3>Categories</h3>
                    <ul class="footer-links">
                        <li><a href="#" onclick="navigateTo('shop'); setFilter('category', 'nuts'); return false;">Premium Nuts</a></li>
                        <li><a href="#" onclick="navigateTo('shop'); setFilter('category', 'dates'); return false;">Fresh Dates</a></li>
                        <li><a href="#" onclick="navigateTo('shop'); setFilter('category', 'berries'); return false;">Dried Berries</a></li>
                        <li><a href="#" onclick="navigateTo('shop'); setFilter('category', 'giftbox'); return false;">Gift Boxes</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3>Contact Info</h3>
                    <ul class="footer-links">
                        <li><i class="fas fa-map-marker-alt"></i> 123 Dry Fruit Street, Kabul, Afghanistan</li>
                        <li><i class="fas fa-phone"></i> +93 98765 43210</li>
                        <li><i class="fas fa-envelope"></i> info@dryfruitmart.com</li>
                        <li><i class="fas fa-clock"></i> Mon-Sun - Sat: 9AM - 6PM</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2024 DryFruitMart. All rights reserved. Made with <i class="fas fa-heart" style="color: #ff7b00;"></i> for healthy living.</p>
            </div>
        </footer>
    `;
}

// ===================================
// PRODUCT CARD COMPONENT
// ===================================

function createProductCard(product) {
  return `
        <div class="product-card">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${
    product.name
  }" class="product-image">
                ${
                  product.badge
                    ? `<span class="product-badge">${product.badge}</span>`
                    : ""
                }
                <div class="product-actions">
                    <button class="btn-icon" onclick="openProductModal(${
                      product.id
                    })" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    <span class="currency">AF</span>${product.price}
                </div>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// ===================================
// HOME PAGE
// ===================================

function renderHomePage() {
  const bestsellers = products
    .filter((p) => p.badge === "Bestseller")
    .slice(0, 8);

  return `
        <section class="hero">
            <div class="hero-content">
                <h1>Healthy Dry Fruits, Delivered Fresh</h1>
                <p>Premium quality nuts, dates, and berries sourced from the finest farms around the world</p>
                <button class="btn-primary" onclick="navigateTo('shop')">
                    Shop Now <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </section>
        
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Our Bestsellers</h2>
                    <p class="section-subtitle">Most loved products by our customers</p>
                </div>
                
                <div class="product-grid">
                    ${bestsellers
                      .map((product) => createProductCard(product))
                      .join("")}
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <button class="btn-primary" onclick="navigateTo('shop')">
                        View All Products
                    </button>
                </div>
            </div>
        </section>
    `;
}

// ===================================
// SHOP PAGE
// ===================================

function setFilter(filterType, value) {
  AppState.filters[filterType] = value;
  if (AppState.currentPage === "shop") {
    renderShopPage();
  }
}

function filterProducts() {
  let filtered = [...products];

  // Filter by category
  if (AppState.filters.category !== "all") {
    filtered = filtered.filter((p) => p.category === AppState.filters.category);
  }

  // Filter by search
  if (AppState.filters.search) {
    const searchTerm = AppState.filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
    );
  }

  // Sort products
  switch (AppState.filters.sort) {
    case "price-low":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "name":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return filtered;
}

function renderShopPage() {
  const filteredProducts = filterProducts();

  const content = `
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Shop Premium Dry Fruits</h2>
                    <p class="section-subtitle">Discover our complete collection</p>
                </div>
                
                <div class="shop-filters">
                    <div class="filter-group">
                        <label for="category-filter">Category</label>
                        <select id="category-filter" onchange="setFilter('category', this.value)">
                            <option value="all" ${
                              AppState.filters.category === "all"
                                ? "selected"
                                : ""
                            }>All Products</option>
                            <option value="nuts" ${
                              AppState.filters.category === "nuts"
                                ? "selected"
                                : ""
                            }>Nuts</option>
                            <option value="dates" ${
                              AppState.filters.category === "dates"
                                ? "selected"
                                : ""
                            }>Dates</option>
                            <option value="berries" ${
                              AppState.filters.category === "berries"
                                ? "selected"
                                : ""
                            }>Berries</option>
                            <option value="giftbox" ${
                              AppState.filters.category === "giftbox"
                                ? "selected"
                                : ""
                            }>Gift Boxes</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label for="search-filter">Search Products</label>
                        <input 
                            type="text" 
                            id="search-filter" 
                            placeholder="Search by name..." 
                            value="${AppState.filters.search}"
                            oninput="setFilter('search', this.value)"
                        >
                    </div>
                    
                    <div class="filter-group">
                        <label for="sort-filter">Sort By</label>
                        <select id="sort-filter" onchange="setFilter('sort', this.value)">
                            <option value="default" ${
                              AppState.filters.sort === "default"
                                ? "selected"
                                : ""
                            }>Default</option>
                            <option value="price-low" ${
                              AppState.filters.sort === "price-low"
                                ? "selected"
                                : ""
                            }>Price: Low to High</option>
                            <option value="price-high" ${
                              AppState.filters.sort === "price-high"
                                ? "selected"
                                : ""
                            }>Price: High to Low</option>
                            <option value="name" ${
                              AppState.filters.sort === "name" ? "selected" : ""
                            }>Name: A to Z</option>
                        </select>
                    </div>
                </div>
                
                ${
                  filteredProducts.length > 0
                    ? `
                    <div class="product-grid">
                        ${filteredProducts
                          .map((product) => createProductCard(product))
                          .join("")}
                    </div>
                `
                    : `
                    <div class="empty-cart">
                        <i class="fas fa-search"></i>
                        <h2>No products found</h2>
                        <p>Try adjusting your filters or search terms</p>
                    </div>
                `
                }
            </div>
        </section>
    `;

  const appDiv = document.querySelector("#app");
  appDiv.innerHTML = renderHeader() + content + renderFooter();
  updateCartCount();
}

// ===================================
// CART PAGE
// ===================================

function renderCartPage() {
  const cart = getCart();
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = cart.length > 0 ? 50 : 0;
  const total = subtotal + shipping;

  const content = `
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Shopping Cart</h2>
                    <p class="section-subtitle">${
                      cart.length
                    } item(s) in your cart</p>
                </div>
                
                ${
                  cart.length > 0
                    ? `
                    <div class="cart-container">
                        <div class="cart-items">
                            ${cart
                              .map(
                                (item) => `
                                <div class="cart-item">
                                    <img src="${item.image}" alt="${
                                  item.name
                                }" class="cart-item-image">
                                    <div class="cart-item-details">
                                        <h3 class="cart-item-name">${
                                          item.name
                                        }</h3>
                                        <div class="cart-item-price">AF${
                                          item.price
                                        }</div>
                                        <div class="quantity-controls">
                                            <button class="qty-btn" onclick="updateCartQuantity(${
                                              item.id
                                            }, ${item.quantity - 1})">
                                                <i class="fas fa-minus"></i>
                                            </button>
                                            <input 
                                                type="number" 
                                                class="quantity-input" 
                                                value="${item.quantity}" 
                                                min="1"
                                                onchange="updateCartQuantity(${
                                                  item.id
                                                }, parseInt(this.value))"
                                            >
                                            <button class="qty-btn" onclick="updateCartQuantity(${
                                              item.id
                                            }, ${item.quantity + 1})">
                                                <i class="fas fa-plus"></i>
                                            </button>
                                            <button class="btn-remove" onclick="removeFromCart(${
                                              item.id
                                            })">
                                                <i class="fas fa-trash"></i> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                        
                        <div class="cart-summary">
                            <h3 class="summary-title">Order Summary</h3>
                            <div class="summary-row">
                                <span>Subtotal</span>
                                <span>AF${subtotal}</span>
                            </div>
                            <div class="summary-row">
                                <span>Shipping</span>
                                <span>AF${shipping}</span>
                            </div>
                            <div class="summary-row total">
                                <span>Total</span>
                                <span>AF${total}</span>
                            </div>
                            <button class="btn-checkout" onclick="handleCheckout()">
                                <i class="fas fa-lock"></i> Proceed to Checkout
                            </button>
                        </div>
                    </div>
                `
                    : `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <h2>Your cart is empty</h2>
                        <p>Add some delicious dry fruits to get started!</p>
                        <button class="btn-primary" onclick="navigateTo('shop')">
                            Start Shopping
                        </button>
                    </div>
                `
                }
            </div>
        </section>
    `;

  const appDiv = document.querySelector("#app");
  appDiv.innerHTML = renderHeader() + content + renderFooter();
  updateCartCount();
}

function handleCheckout() {
  const user = getCurrentUser();

  if (!user) {
    showToast("Please login to proceed with checkout");
    openLoginModal();
    return;
  }

  showToast("Checkout feature coming soon! This is a demo.");
}

// ===================================
// PRODUCT MODAL
// ===================================

function openProductModal(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const modal = document.createElement("div");
  modal.className = "modal active";
  modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="this.closest('.modal').remove()">
                <i class="fas fa-times"></i>
            </button>
            <div class="product-detail">
                <div>
                    <img src="${product.image}" alt="${
    product.name
  }" class="product-detail-image">
                </div>
                <div class="product-detail-info">
                    <div class="product-detail-category">${
                      product.category
                    }</div>
                    <h2>${product.name}</h2>
                    ${
                      product.badge
                        ? `<span class="product-badge">${product.badge}</span>`
                        : ""
                    }
                    <div class="product-detail-price">₹${product.price}</div>
                    <p class="product-detail-description">${
                      product.description
                    }</p>
                    <button class="btn-primary" onclick="addToCart(${
                      product.id
                    }); this.closest('.modal').remove();">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  // Close on outside click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// ===================================
// LOGIN MODAL
// ===================================

function openLoginModal() {
  const modal = document.createElement("div");
  modal.className = "modal active";
  modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="this.closest('.modal').remove()">
                <i class="fas fa-times"></i>
            </button>
            <form class="login-form" onsubmit="handleLogin(event)">
                <h2>Welcome Back</h2>
                <p>Login to continue shopping</p>
                
                <div class="form-group">
                    <label for="login-email">Email Address</label>
                    <input 
                        type="email" 
                        id="login-email" 
                        placeholder="demo@dryfruits.com" 
                        required
                    >
                </div>
                
                <div class="form-group">
                    <label for="login-password">Password</label>
                    <input 
                        type="password" 
                        id="login-password" 
                        placeholder="demo123" 
                        required
                    >
                </div>
                
                <div id="login-error" class="form-error" style="display: none;"></div>
                
                <button type="submit" class="btn-submit">
                    <i class="fas fa-sign-in-alt"></i> Login
                </button>
                
                <div class="form-footer">
                    Demo credentials: <strong>demo@dryfruits.com</strong> / <strong>demo123</strong>
                </div>
            </form>
        </div>
    `;

  document.body.appendChild(modal);

  // Close on outside click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const errorDiv = document.getElementById("login-error");

  // Demo authentication
  if (email === "demo@dryfruits.com" && password === "demo123") {
    const user = {
      name: "Demo User",
      email: email,
    };

    saveUser(user);
    document.querySelector(".modal").remove();
    renderHeader();
    updateCartCount();
    showToast("Welcome back, Demo User!");
  } else {
    errorDiv.textContent =
      "Invalid email or password. Use demo@dryfruits.com / demo123";
    errorDiv.style.display = "block";
  }
}

// ===================================
// CONTENT PAGES
// ===================================

function renderAboutPage() {
  const content = `
        <section class="section">
            <div class="container">
                <div class="content-page">
                    <h1>About DryFruitMart</h1>
                    
                    <p>Welcome to DryFruitMart, your premier destination for high-quality dry fruits, nuts, dates, and berries. Since our establishment, we've been committed to bringing you the finest products from around the world, delivered fresh to your doorstep.</p>
                    
                    <h2>Our Mission</h2>
                    <p>At DryFruitMart, we believe that healthy eating should be delicious, accessible, and sustainable. Our mission is to provide premium quality dry fruits that not only taste amazing but also contribute to your overall well-being.</p>
                    
                    <h2>Why Choose Us?</h2>
                    <ul>
                        <li><strong>Premium Quality:</strong> All our products are sourced from certified farms and undergo strict quality checks.</li>
                        <li><strong>Fresh Delivery:</strong> We ensure products reach you in perfect condition with our efficient delivery system.</li>
                        <li><strong>Wide Selection:</strong> From almonds to dates, we offer a diverse range of products to suit every taste.</li>
                        <li><strong>Competitive Prices:</strong> Enjoy premium quality at affordable prices with regular discounts and offers.</li>
                        <li><strong>Customer Satisfaction:</strong> Your satisfaction is our priority, backed by our hassle-free return policy.</li>
                    </ul>
                    
                    <h2>Our Values</h2>
                    <p>We are guided by principles of quality, integrity, and sustainability. Every product we offer reflects our commitment to excellence and our respect for the environment and the communities we serve.</p>
                    
                    <p>Thank you for choosing DryFruitMart. We look forward to being your trusted partner in healthy living!</p>
                </div>
            </div>
        </section>
    `;

  const appDiv = document.querySelector("#app");
  appDiv.innerHTML = renderHeader() + content + renderFooter();
  updateCartCount();
}

function renderContactPage() {
  const content = `
        <section class="section">
            <div class="container">
                <div class="content-page">
                    <h1>Contact Us</h1>
                    
                    <p>We'd love to hear from you! Whether you have questions about our products, need help with an order, or just want to share feedback, our team is here to help.</p>
                    
                    <div class="contact-info">
                        <div class="contact-card">
                            <i class="fas fa-map-marker-alt"></i>
                            <h3>Visit Us</h3>
                            <p>123 Dry Fruit Street<br>Kabul, Shahr-e Naw<br>Afghanistan</p>
                        </div>
                        
                        <div class="contact-card">
                            <i class="fas fa-phone"></i>
                            <h3>Call Us</h3>
                            <p>+93 98765 43210<br>+93 98765 43211<br>Mon - Sat: 9AM - 6PM</p>
                        </div>
                        
                        <div class="contact-card">
                            <i class="fas fa-envelope"></i>
                            <h3>Email Us</h3>
                            <p>info@dryfruitmart.com<br>support@dryfruitmart.com<br>We reply within 24 hours</p>
                        </div>
                    </div>
                    
                    <h2>Send Us a Message</h2>
                    
                    <form onsubmit="handleContactForm(event)">
                        <div class="form-group">
                            <label for="contact-name">Your Name</label>
                            <input type="text" id="contact-name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="contact-email">Your Email</label>
                            <input type="email" id="contact-email" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="contact-subject">Subject</label>
                            <input type="text" id="contact-subject" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="contact-message">Message</label>
                            <input type="text" id="contact-message" style="height: 120px;" required>
                        </div>
                        
                        <button type="submit" class="btn-submit">
                            <i class="fas fa-paper-plane"></i> Send Message
                        </button>
                    </form>
                </div>
            </div>
        </section>
    `;

  const appDiv = document.querySelector("#app");
  appDiv.innerHTML = renderHeader() + content + renderFooter();
  updateCartCount();
}

function handleContactForm(event) {
  event.preventDefault();
  showToast("Thank you for your message! We'll get back to you soon.");
  event.target.reset();
}

function renderCareerPage() {
  const content = `
        <section class="section">
            <div class="container">
                <div class="content-page">
                    <h1>Join Our Team</h1>
                    
                    <p>At DryFruitMart, we're always looking for passionate, talented individuals who share our commitment to quality and customer satisfaction. Join us in our mission to deliver healthy, delicious products to customers across the country!</p>
                    
                    <h2>Why Work With Us?</h2>
                    <ul>
                        <li>Competitive salary and benefits package</li>
                        <li>Opportunities for professional growth and development</li>
                        <li>Collaborative and supportive work environment</li>
                        <li>Employee discounts on all products</li>
                        <li>Health and wellness programs</li>
                        <li>Work-life balance initiatives</li>
                    </ul>
                    
                    <h2>Current Openings</h2>
                    
                    <h3>Quality Control Manager</h3>
                    <p><strong>Location:</strong> Kabul, Afghanistan | <strong>Type:</strong> Full-time</p>
                    <p>We're seeking an experienced Quality Control Manager to oversee our product quality processes and ensure all items meet our high standards.</p>
                    
                    <h3>Digital Marketing Specialist</h3>
                    <p><strong>Location:</strong> Remote | <strong>Type:</strong> Full-time</p>
                    <p>Join our marketing team to create engaging campaigns, manage social media, and drive online growth.</p>
                    
                    <h3>Customer Service Representative</h3>
                    <p><strong>Location:</strong> Kabul, Afghanistan | <strong>Type:</strong> Full-time</p>
                    <p>Help us deliver exceptional customer experiences by addressing inquiries and resolving issues promptly.</p>
                    
                    <h3>Supply Chain Coordinator</h3>
                    <p><strong>Location:</strong> Kabul, Afghanistan | <strong>Type:</strong> Full-time</p>
                    <p>Manage our logistics operations to ensure timely delivery of fresh products to our customers.</p>
                    
                    <h2>How to Apply</h2>
                    <p>Interested in joining our team? Send your resume and cover letter to <strong>careers@dryfruitmart.com</strong>. Please include the position title in the subject line.</p>
                    
                    <p>We review all applications carefully and will contact shortlisted candidates within 2 weeks. Even if you don't see a position that fits your skills right now, feel free to send us your resume for future opportunities!</p>
                </div>
            </div>
        </section>
    `;

  const appDiv = document.querySelector("#app");
  appDiv.innerHTML = renderHeader() + content + renderFooter();
  updateCartCount();
}

// ===================================
// PAGE RENDERER
// ===================================

function renderPage() {
  const appDiv = document.querySelector("#app");

  switch (AppState.currentPage) {
    case "home":
      appDiv.innerHTML = renderHeader() + renderHomePage() + renderFooter();
      break;
    case "shop":
      renderShopPage();
      break;
    case "cart":
      renderCartPage();
      break;
    case "about":
      renderAboutPage();
      break;
    case "contact":
      renderContactPage();
      break;
    case "career":
      renderCareerPage();
      break;
    default:
      appDiv.innerHTML = renderHeader() + renderHomePage() + renderFooter();
  }

  updateCartCount();
}

// ===================================
// SCROLL TO TOP
// ===================================

function initScrollToTop() {
  const scrollBtn = document.getElementById("scrollToTop");

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add("visible");
    } else {
      scrollBtn.classList.remove("visible");
    }
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ===================================
// INITIALIZATION
// ===================================

function init() {
  // Load cart from localStorage
  AppState.cart = getCart();

  // Load user from localStorage
  AppState.currentUser = getCurrentUser();

  // Render initial page
  renderPage();

  // Initialize scroll to top
  initScrollToTop();
}

// Start the app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
