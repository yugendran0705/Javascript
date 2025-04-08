const products = [];

let isLoading = false;
let page = 1;

const query = `
            query ($page: Int, $perPage: Int) {
                Page(page: $page, perPage: $perPage) {
                    media(type: MANGA, sort: POPULARITY_DESC) {
                        id
                        title {
                            romaji
                            english
                        }
                        description
                        bannerImage 
                        coverImage{large}
                        genres
                        averageScore
                    }
                }
            }
        `;


let cart = JSON.parse(localStorage.getItem('cart')) || [];


const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('categoryFilter');
const pages = document.querySelectorAll('.page');
const loadingDiv = document.getElementById('loading');
const cartCount = document.getElementById('cartCount');


const routes = {
    'shop': 'shop',
    'cart': 'cart'
};

async function navigate() {
    const hash = window.location.hash.slice(1) || 'shop';
    const pageId = routes[hash] || 'shop';

    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === pageId) {
            page.classList.add('active');
        }
    });

    if (pageId === 'shop') {
        displayProducts(searchInput.value, categoryFilter.value);
    } else if (pageId === 'cart') {
        updateCart();
    }

    document.title = `Poster Store - ${pageId.charAt(0).toUpperCase() + pageId.slice(1)}`;
}

window.addEventListener('hashchange', navigate);
if (!window.location.hash) {
    window.location.hash = '#shop';
}

async function fetchProducts(filter = '', category = '') {
    if (isLoading) return;
    isLoading = true;
    loadingDiv.style.display = 'block';

    const variables = {
        page: page,
        perPage: 50
    };

    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });

        const data = await response.json();
        //dconsole.log(data);
        const mangaData = data.data.Page.media;

        products.push(...mangaData.map(manga => ({
            id: manga.id,
            name: manga.title.romaji || manga.title.english,
            description: manga.description.substring(0, 150)+"..." || 'No description available',
            image: manga.coverImage.large || manga.bannerImage,
            category: manga.genres[0] || 'Unknown',
            price: (Math.random() * 20 + 5).toFixed(2)
        })));
        page++;
    } catch (error) {
        console.error('Error fetching manga:', error);
    } finally {
        isLoading = false;
        loadingDiv.style.display = 'none';
    }
}

function displayProducts(filter = '', category = '') {
    productGrid.innerHTML = '';
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(filter.toLowerCase()) &&
        (category === '' || product.category === category)
    );
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p>No products found.</p>';
        return;
    }
    filteredProducts.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-item';
        const isInCart = cart.some(item => item.id === product.id);
        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='placeholder.jpg'">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>$${product.price}</p>
            <button class="${isInCart ? 'in-cart' : ''}" 
                    onclick="addToCart(${product.id})" 
                    ${isInCart ? 'disabled' : ''}>
                ${isInCart ? 'In Cart' : 'Add to Cart'}
            </button>
        `;
        productGrid.appendChild(div);
    });
}


function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
    localStorage.setItem('cart', JSON.stringify(cart));
    displayProducts(searchInput.value, categoryFilter.value);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    localStorage.setItem('cart', JSON.stringify(cart));
    if (window.location.hash === '#shop') {
        displayProducts(searchInput.value, categoryFilter.value);
    }
}

function updateQuantity(productId, quantity) {
    const cartItem = cart.find(item => item.id === productId);
    const newQuantity = parseInt(quantity);
    if (newQuantity <= 0) {
        removeFromCart(productId);
    } else {
        cartItem.quantity = newQuantity;
        updateCart();
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    if (window.location.hash === '#shop') {
        displayProducts(searchInput.value, categoryFilter.value);
    }
}

function updateCart() {
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='placeholder.jpg'">
            <div>${item.name}</div>
            <input type="number" min="0" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)">
            <div>$${(item.price * item.quantity).toFixed(2)}</div>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItems.appendChild(div);
    });
    
    if (cart.length > 0) {
        const purchaseBtn = document.createElement('button');
        purchaseBtn.className = 'purchase-btn';
        purchaseBtn.textContent = 'Purchase';
        purchaseBtn.onclick = purchaseCart;
        cartItems.appendChild(purchaseBtn);
    }
    
    calculateTotal();
    updateCartCount();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = `(${totalItems})`;
}

function purchaseCart() {
    if (confirm('Are you sure you want to complete your purchase?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        alert('Purchase completed! Thank you for shopping with us.');
    }
}


function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxRate = 0.1; // 10% tax
    const tax = subtotal * taxRate;
    const discount = subtotal > 100 ? subtotal * 0.1 : 0; // 10% discount over $100
    const total = subtotal + tax - discount;

    cartTotal.innerHTML = `
        Subtotal: $${subtotal.toFixed(2)}<br>
        Tax (10%): $${tax.toFixed(2)}<br>
        Discount: $${discount.toFixed(2)}<br>
        Total: $${total.toFixed(2)}
    `;
}


function handleFilters() {
    if (window.location.hash === '#shop') {
        displayProducts(searchInput.value, categoryFilter.value);
    }
}

async function handleScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const bottomPosition = document.documentElement.offsetHeight - 100;

    if (scrollPosition >= bottomPosition && !isLoading) {
        await fetchProducts();
        displayProducts();
    }
}


function handleImageError(img) {
    img.src = 'placeholder.jpg';
    console.error(`Failed to load image: ${img.alt}`);
}

async function init() {
    await fetchProducts();
    displayProducts();
    navigate();
}

window.addEventListener('scroll', handleScroll);
searchInput.addEventListener('input', handleFilters);
categoryFilter.addEventListener('change', handleFilters);

init().then(() => updateCartCount());