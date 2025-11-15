// Base API URL
const BASE_API_URL = '/api';

// Data loaded from API
let products = [];
let orders = [];
let reviews = [];

// DOM elements
const productsContainer = document.querySelector('.products');
const orderList = document.querySelector('.order-list');
const reviewsList = document.querySelector('.reviews-list');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalAmount = document.getElementById('cart-total-amount');
const cartCount = document.querySelector('.cart-count');
const searchBar = document.querySelector('.search-bar');
const categoryFilter = document.querySelectorAll('.filter')[0];
const priceFilter = document.querySelectorAll('.filter')[1];
const profileSection = document.querySelector('.profile-section');
const homeLink = document.querySelector('.home-link');
const productsLink = document.querySelector('.products-link');
const profileLink = document.querySelector('.profile-link');
const contactLink = document.querySelector('.contact-link');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Auth elements
const loginBtn = document.querySelector('.login-btn');
const registerBtn = document.querySelector('.register-btn');
const logoutBtn = document.querySelector('.logout-btn');
const userInfo = document.querySelector('.user-info');
const loggedInUser = document.getElementById('logged-in-user');

// Modals
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const cartModal = document.getElementById('cart-modal');
const successModal = document.getElementById('success-modal');
const contactModal = document.getElementById('contact-modal');
const cartIcon = document.querySelector('.cart-icon');
const closeBtns = document.querySelectorAll('.close-btn');
const checkoutBtn = document.querySelector('.checkout-btn');

// App state
let cart = [];
let currentUser = null;

async function init() {
await Promise.all([loadProducts(), loadOrders(), loadReviews()]);
renderProducts(products);
renderOrders();
renderReviews();
setupEventListeners();
updateCartCount();
updateAuthUI();
}

async function loadProducts() {
try {
const res = await fetch(`${BASE_API_URL}/products/`);
products = await res.json();
} catch (e) {
console.error('Failed to load products', e);
}
}

async function loadOrders() {
try {
const res = await fetch(`${BASE_API_URL}/orders/`);
orders = await res.json();
} catch (e) {
console.warn('No orders yet');
orders = [];
}
}

async function loadReviews() {
try {
const res = await fetch(`${BASE_API_URL}/reviews/`);
reviews = await res.json();
} catch (e) {
console.warn('No reviews yet');
reviews = [];
}
}

function updateAuthUI() {
if (currentUser) {
loginBtn.style.display = 'none';
registerBtn.style.display = 'none';
logoutBtn.style.display = 'block';
userInfo.style.display = 'flex';
loggedInUser.textContent = currentUser.name;
profileLink.style.display = 'block';
} else {
loginBtn.style.display = 'block';
registerBtn.style.display = 'block';
logoutBtn.style.display = 'none';
userInfo.style.display = 'none';
profileLink.style.display = 'none';
}
}

function renderProducts(productsToRender) {
productsContainer.innerHTML = '';
if (productsToRender.length === 0) {
productsContainer.innerHTML = '<p style="grid-column:1/-1;textalign:center;">No products found matching your criteria.</p>';
return;
}
productsToRender.forEach(product => {
const productCard = document.createElement('div');
productCard.className = 'product-card';
productCard.innerHTML = `
<img src="${product.image}" alt="${product.title}" class="product-img"
onerror="this.src='https://via.placeholder.com/300x200?text=Product+Image'">
<div class="product-info">
<div class="product-title">${product.title}</div>
<div class="product-price">₹${product.price}</div>
<div class="product-farmer">Farmer: ${product.farmer}</div>
<div class="rating">${renderStars(product.rating)}</div>
<button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
</div>
`;
productsContainer.appendChild(productCard);
});
}

function renderStars(rating) {
const fullStars = Math.floor(rating);
const hasHalfStar = rating % 1 >= 0.5;
let stars = '★'.repeat(fullStars);
if (hasHalfStar) stars += '½';
stars += '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
return stars;
}

function renderOrders() {
orderList.innerHTML = '';
if (orders.length === 0) {
orderList.innerHTML = '<p>You have no orders yet.</p>';
return;
}
orders.forEach(order => {
const orderItem = document.createElement('div');
orderItem.className = 'order-item';
let itemsHtml = '<div class="order-products">';
order.items.forEach(item => {
itemsHtml += `<p>${item.quantity} x ${item.product} - ₹${item.price *
item.quantity}</p>`;
});
itemsHtml += '</div>';
orderItem.innerHTML = `
<h3>Order #${order.id}</h3>
<p><strong>Date:</strong> ${order.date}</p>
${itemsHtml}
<p><strong>Total:</strong> ₹${order.total}</p>
<p><strong>Status:</strong> ${order.status}</p>
`;
orderList.appendChild(orderItem);
});
}

function renderReviews() {
reviewsList.innerHTML = '';
if (reviews.length === 0) {
    reviewsList.innerHTML = '<p>You have not reviewed any products yet.</p>';
    return;
    }
    reviews.forEach(review => {
    const reviewItem = document.createElement('div');
    reviewItem.className = 'order-item';
    reviewItem.innerHTML = `
    <h3>${review.product}</h3>
    <p><strong>Date:</strong> ${review.date}</p>
    <div class="rating">${renderStars(review.rating)}</div>
    <p>${review.comment}</p>
    `;
    reviewsList.appendChild(reviewItem);
    });
    }

function renderCart() {
cartItemsContainer.innerHTML = '';
let total = 0;
if (cart.length === 0) {
cartItemsContainer.innerHTML = `
<div class="empty-cart">
<p>Your cart is empty</p>
<button class="submit-btn"
onclick="cartModal.style.display='none'">Continue Shopping</button>
</div>
`;
document.querySelector('.cart-total').style.display = 'none';
document.querySelector('.checkout-btn').style.display = 'none';
return;
}
document.querySelector('.cart-total').style.display = 'block';
document.querySelector('.checkout-btn').style.display = 'block';
cart.forEach(item => {
const product = products.find(p => p.id === item.id);
if (product) {
const cartItem = document.createElement('div');
cartItem.className = 'cart-item';
cartItem.innerHTML = `
<img src="${product.image}" alt="${product.title}" class="cart-item-img"
onerror="this.src='https://via.placeholder.com/60x60?text=Product'">
<div class="cart-item-details">
<div class="cart-item-title">${product.title}</div>
<div class="cart-item-price">₹${product.price}</div>
<div class="cart-item-quantity">
<button class="quantity-btn minus" data-id="${product.id}">-</button>
<span>${item.quantity}</span>
<button class="quantity-btn plus" data-id="${product.id}">+</button>
</div>
</div>
<button class="remove-btn" data-id="${product.id}">×</button>
`;
cartItemsContainer.appendChild(cartItem);
total += product.price * item.quantity;
}
});
cartTotalAmount.textContent = total;
updateCartCount();
}

function updateCartCount() {
const count = cart.reduce((sum, item) => sum + item.quantity, 0);
cartCount.textContent = count;
cartCount.style.display = count > 0 ? 'flex' : 'none';
}

function setupEventListeners() {
loginBtn.addEventListener('click', () => loginModal.style.display = 'flex');
registerBtn.addEventListener('click', () => registerModal.style.display = 'flex');
logoutBtn.addEventListener('click', logout);

cartIcon.addEventListener('click', () => {
renderCart();
cartModal.style.display = 'flex';
});

contactLink.addEventListener('click', (e) => {
e.preventDefault();
contactModal.style.display = 'flex';
});

closeBtns.forEach(btn => {
btn.addEventListener('click', function() {
this.closest('.modal').style.display = 'none';
});
});

window.addEventListener('click', (e) => {
if (e.target.classList.contains('modal')) {
e.target.style.display = 'none';
}
});

productsContainer.addEventListener('click', (e) => {
if (e.target.classList.contains('add-to-cart')) {
const productId = parseInt(e.target.getAttribute('data-id'));
addToCart(productId);
alert('Product added to cart!');
}
});

cartItemsContainer.addEventListener('click', (e) => {
const productId = parseInt(e.target.getAttribute('data-id'));
if (e.target.classList.contains('minus')) {
updateCartItemQuantity(productId, -1);
} else if (e.target.classList.contains('plus')) {
updateCartItemQuantity(productId, 1);
} else if (e.target.classList.contains('remove-btn')) {
removeFromCart(productId);
}
});

if (checkoutBtn) {
checkoutBtn.addEventListener('click', checkout);
}

searchBar.addEventListener('input', filterProducts);
categoryFilter.addEventListener('change', filterProducts);
priceFilter.addEventListener('change', filterProducts);

homeLink.addEventListener('click', (e) => {
e.preventDefault();
showHomePage();
});
productsLink.addEventListener('click', (e) => {
e.preventDefault();
showProductsPage();
});
profileLink.addEventListener('click', (e) => {
e.preventDefault();
showProfilePage();
});

tabs.forEach(tab => {
tab.addEventListener('click', () => {
tabs.forEach(t => t.classList.remove('active'));
tabContents.forEach(c => c.classList.remove('active'));
tab.classList.add('active');
document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
});
});

document.getElementById('login-form')?.addEventListener('submit', (e) => {
e.preventDefault();
const email = document.getElementById('login-email').value;
const password = document.getElementById('login-password').value;
login(email, password);
});
document.getElementById('register-form')?.addEventListener('submit', (e) => {
e.preventDefault();
const name = document.getElementById('reg-name').value;
const email = document.getElementById('reg-email').value;
const phone = document.getElementById('reg-phone').value;
const password = document.getElementById('reg-password').value;
const role = document.getElementById('reg-role').value;
register(name, email, phone, password, role);
});
document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Message sent to farmer!');
    contactModal.style.display = 'none';
    });
    document.getElementById('profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
    });
}

function login(email, password) {
currentUser = {
name: email.split('@')[0],
email: email,
role: 'buyer'
};
alert('Login successful!');
loginModal.style.display = 'none';
updateAuthUI();
}

function register(name, email, phone, password, role) {
currentUser = {
name: name,
email: email,
role: role
};
alert('Registration successful! You are now logged in.');
registerModal.style.display = 'none';
updateAuthUI();
}

function logout() {
currentUser = null;
alert('You have been logged out.');
updateAuthUI();
}

function showHomePage() {
profileSection.style.display = 'none';
document.querySelector('.products').style.display = 'grid';
document.querySelector('.hero').style.display = 'block';
document.querySelector('.search-filter').style.display = 'flex';
}

function showProductsPage() {
profileSection.style.display = 'none';
document.querySelector('.products').style.display = 'grid';
document.querySelector('.hero').style.display = 'none';
document.querySelector('.search-filter').style.display = 'flex';
}

function showProfilePage() {
if (!currentUser) {
alert('Please login to view your profile');
return;
}
profileSection.style.display = 'block';
document.querySelector('.products').style.display = 'none';
document.querySelector('.hero').style.display = 'none';
document.querySelector('.search-filter').style.display = 'none';
}

function addToCart(productId) {
if (!currentUser) {
alert('Please login to add items to cart');
loginModal.style.display = 'flex';
return;
}
const existingItem = cart.find(item => item.id === productId);
if (existingItem) {
existingItem.quantity += 1;
} else {
cart.push({ id: productId, quantity: 1 });
}
updateCartCount();
}

function updateCartItemQuantity(productId, change) {
const item = cart.find(item => item.id === productId);
if (item) {
item.quantity += change;
if (item.quantity <= 0) {
removeFromCart(productId);
} else {
renderCart();
}
}
}

function removeFromCart(productId) {
cart = cart.filter(item => item.id !== productId);
renderCart();
}

async function checkout() {
if (!currentUser) {
alert('Please login to checkout');
loginModal.style.display = 'flex';
return;
}
if (cart.length === 0) return;
try {
  const itemsPayload = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return { product_id: item.id, quantity: item.quantity, price: product ? product.price : 0 };
  });
  const res = await fetch(`${BASE_API_URL}/orders/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Placed', items: itemsPayload })
  });
  if (!res.ok) throw new Error('Order failed');
  await loadOrders();
  cart = [];
  renderCart();
  cartModal.style.display = 'none';
  successModal.style.display = 'flex';
} catch (e) {
  alert('Failed to place order. Please try again.');
}
}

function filterProducts() {
const searchTerm = searchBar.value.toLowerCase();
const category = categoryFilter.value;
const priceRange = priceFilter.value;
let filtered = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm) ||
    product.farmer.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm);
    const matchesCategory = !category || product.category === category;
    let matchesPrice = true;
    if (priceRange) {
    const [min, max] = priceRange.split('-').map(Number);
    matchesPrice = product.price >= min && (!max || product.price <= max);
    }
    return matchesSearch && matchesCategory && matchesPrice;
    });
    renderProducts(filtered);
}

init();


