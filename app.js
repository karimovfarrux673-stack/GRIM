const products = [
    { id: 1, name: 'Forma stol lampasi', category: 'Uy uchun', price: 489000, oldPrice: 599000, badge: 'Bestseller', colors: ['#d4c5a9', '#606963'], image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=82', tag: 'Yumshoq yorug‘lik' },
    { id: 2, name: 'Terra keramika vaza', category: 'Uy uchun', price: 219000, badge: 'Yangi', colors: ['#c47a57', '#d8c8af'], image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=82', tag: 'Qo‘lda ishlangan' },
    { id: 3, name: 'Studio simsiz quloqchin', category: 'Texnologiya', price: 899000, oldPrice: 1099000, badge: '−18%', colors: ['#d6d3cb', '#333936'], image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=82', tag: 'Premium audio' },
    { id: 4, name: 'Everyday shopper sumka', category: 'Aksessuar', price: 329000, badge: 'Yangi', colors: ['#a5ad91', '#bd7c5a'], image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=82', tag: 'Tabiiy paxta' },
    { id: 5, name: 'Sokinlik aromadiffuzori', category: 'Parvarish', price: 279000, colors: ['#ddd4c5'], image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=82', tag: 'Tabiiy hid' },
    { id: 6, name: 'Minimal bilak soati', category: 'Aksessuar', price: 1250000, badge: 'Tanlangan', colors: ['#d6c4a3', '#343a34'], image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=82', tag: 'Po‘lat korpus' },
    { id: 7, name: 'Kundalik termos 500 ml', category: 'Texnologiya', price: 359000, colors: ['#b5bba6', '#bc805e'], image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=82', tag: 'Issiqni 12 soat saqlaydi' },
    { id: 8, name: 'Lino dekor yostiq', category: 'Uy uchun', price: 189000, oldPrice: 229000, badge: '−17%', colors: ['#c8baa1', '#858f7e'], image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=82', tag: '100% zig‘ir' },
    { id: 9, name: 'Sakura qo‘l kremi', category: 'Parvarish', price: 99000, badge: 'Yangi', colors: ['#e5c8b1'], image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=82', tag: 'O‘simlik ekstrakti' },
    { id: 10, name: 'Solis stol soati', category: 'Uy uchun', price: 399000, colors: ['#b9a27c', '#495d4d'], image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=800&q=82', tag: 'Sokin mexanizm' },
    { id: 11, name: 'Weekend sayohat ryukzagi', category: 'Aksessuar', price: 749000, badge: 'Bestseller', colors: ['#828a79', '#b48261'], image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=82', tag: 'Qayta ishlangan mato' },
    { id: 12, name: 'Aura mini bluetooth kolonka', category: 'Texnologiya', price: 569000, colors: ['#a7a999', '#333936'], image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=82', tag: 'Boy va tiniq ovoz' }
];
const categories = ['Barchasi', 'Uy uchun', 'Texnologiya', 'Aksessuar', 'Parvarish'];
const money = amount => new Intl.NumberFormat('uz-UZ').format(amount) + ' so‘m';
let activeCategory = 'Barchasi';
let searchTerm = '';
let favorites = new Set();
let cart = JSON.parse(localStorage.getItem('nova-cart') || '{}');
const grid = document.getElementById('productGrid');
const categoryList = document.getElementById('categoryList');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const toastEl = document.getElementById('toast');
let toastTimer;

function renderCategories() { categoryList.innerHTML = categories.map(category => `<button class="category-chip ${activeCategory === category ? 'active' : ''}" data-category="${category}">${category}</button>`).join(''); }
function renderProducts() {
    let list = products.filter(product => (activeCategory === 'Barchasi' || product.category === activeCategory) && (`${product.name} ${product.category} ${product.tag}`.toLowerCase().includes(searchTerm.toLowerCase())));
    if (sortSelect.value === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sortSelect.value === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sortSelect.value === 'newest') list.sort((a, b) => Number(b.badge === 'Yangi') - Number(a.badge === 'Yangi'));
    document.getElementById('resultsCount').textContent = `${list.length} ta mahsulot`;
    document.getElementById('emptyState').hidden = list.length > 0;
    grid.innerHTML = list.map(p => `<article class="product-card"><div class="product-image-wrap"><img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-label">${p.badge || p.tag}</span><button class="product-favorite ${favorites.has(p.id) ? 'active' : ''}" data-favorite="${p.id}" aria-label="${favorites.has(p.id) ? 'Saralanganlardan olib tashlash' : 'Saralanganlarga qo‘shish'}">${favorites.has(p.id) ? '♥' : '♡'}</button><button class="quick-add" data-add="${p.id}">Savatga qo‘shish <span>＋</span></button></div><div class="product-info"><div class="product-meta"><span>${p.category.toUpperCase()}</span><span class="color-dots">${p.colors.map(color => `<i class="color-dot" style="background:${color}"></i>`).join('')}</span></div><h3 class="product-title">${p.name}</h3><div class="product-price">${money(p.price)} ${p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span>` : ''}</div></div></article>`).join('');
}
function persist() { localStorage.setItem('nova-cart', JSON.stringify(cart)); renderCart(); }
function addToCart(id) { cart[id] = (cart[id] || 0) + 1; persist(); showToast(`${products.find(p => p.id === id).name} savatga qo‘shildi`); }
function cartEntries() { return Object.entries(cart).filter(([, quantity]) => quantity > 0).map(([id, quantity]) => ({ product: products.find(p => p.id === Number(id)), quantity })).filter(entry => entry.product); }
function renderCart() {
    const entries = cartEntries(), count = entries.reduce((sum, item) => sum + item.quantity, 0), subtotal = entries.reduce((sum, item) => sum + item.product.price * item.quantity, 0), delivery = subtotal === 0 ? 0 : (subtotal >= 300000 ? 0 : 25000);
    document.getElementById('cartCount').textContent = count; document.getElementById('drawerCount').textContent = `(${count})`;
    document.getElementById('cartItems').innerHTML = entries.map(({ product: p, quantity }) => `<div class="cart-item"><img src="${p.image}" alt=""><div><div class="cart-item-name">${p.name}</div><div class="cart-item-category">${p.category}</div><div class="cart-item-price">${money(p.price)}</div><div class="quantity-control"><button data-quantity="${p.id}" data-change="-1" aria-label="Kamaytirish">−</button><span>${quantity}</span><button data-quantity="${p.id}" data-change="1" aria-label="Ko‘paytirish">＋</button></div></div><button class="remove-item" data-remove="${p.id}">O‘chirish</button></div>`).join('');
    document.getElementById('cartEmpty').hidden = count > 0; document.getElementById('cartSummary').hidden = count === 0;
    document.getElementById('subtotal').textContent = money(subtotal); document.getElementById('delivery').textContent = delivery === 0 ? 'Bepul' : money(delivery); document.getElementById('total').textContent = money(subtotal + delivery); document.getElementById('checkoutTotal').textContent = money(subtotal + delivery);
}
function openCart() { cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden', 'false'); overlay.classList.add('visible'); document.body.style.overflow = 'hidden'; }
function closeCart() { cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden', 'true'); overlay.classList.remove('visible'); document.body.style.overflow = ''; }
function showToast(message) { toastEl.textContent = message; toastEl.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2300); }
renderCategories(); renderProducts(); renderCart();
categoryList.addEventListener('click', event => { const button = event.target.closest('[data-category]'); if (button) { activeCategory = button.dataset.category; renderCategories(); renderProducts(); } });
grid.addEventListener('click', event => { const add = event.target.closest('[data-add]'), favorite = event.target.closest('[data-favorite]'); if (add) addToCart(Number(add.dataset.add)); if (favorite) { const id = Number(favorite.dataset.favorite); favorites.has(id) ? favorites.delete(id) : favorites.add(id); renderProducts(); } });
searchInput.addEventListener('input', () => { searchTerm = searchInput.value; renderProducts(); });
sortSelect.addEventListener('change', renderProducts);
document.getElementById('resetFilters').addEventListener('click', () => { activeCategory = 'Barchasi'; searchTerm = ''; searchInput.value = ''; renderCategories(); renderProducts(); });
document.getElementById('openCart').addEventListener('click', openCart); document.getElementById('closeCart').addEventListener('click', closeCart); document.getElementById('continueShopping').addEventListener('click', closeCart); overlay.addEventListener('click', closeCart);
document.getElementById('cartItems').addEventListener('click', event => { const quantityButton = event.target.closest('[data-quantity]'), removeButton = event.target.closest('[data-remove]'); if (quantityButton) { const id = quantityButton.dataset.quantity; cart[id] = (cart[id] || 0) + Number(quantityButton.dataset.change); if (cart[id] <= 0) delete cart[id]; persist(); } if (removeButton) { delete cart[removeButton.dataset.remove]; persist(); } });
document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); searchInput.focus(); } if (event.key === 'Escape') { closeCart(); document.querySelector('.site-header').classList.remove('search-open'); } });
document.getElementById('mobileSearch').addEventListener('click', () => { document.querySelector('.site-header').classList.add('search-open'); searchInput.focus(); });
const checkoutDialog = document.getElementById('checkoutDialog');
document.getElementById('checkoutButton').addEventListener('click', () => checkoutDialog.showModal());
document.getElementById('closeCheckout').addEventListener('click', () => checkoutDialog.close());
checkoutDialog.addEventListener('click', event => { if (event.target === checkoutDialog) checkoutDialog.close(); });
document.getElementById('checkoutForm').addEventListener('submit', event => { event.preventDefault(); const formData = new FormData(event.currentTarget); const orderId = 'NV-' + Math.random().toString(36).slice(2, 8).toUpperCase(); checkoutDialog.close(); closeCart(); cart = {}; persist(); event.currentTarget.reset(); showToast(`Rahmat, ${formData.get('name')}! Buyurtma ${orderId} qabul qilindi.`); });
document.getElementById('newsletterForm').addEventListener('submit', event => { event.preventDefault(); event.currentTarget.reset(); showToast('Rahmat! Yangiliklarimizga muvaffaqiyatli obuna bo‘ldingiz.'); });
