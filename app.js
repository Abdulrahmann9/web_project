// Mock product database 
// TODO: Replace with fetch() call to Node/Express backend later
const products = [
    { id: 1, name: "Oversized Heavyweight Tee", price: 450, image: "tee.jpg" },
    { id: 2, name: "Compression Shorts", price: 300, image: "shorts.jpg" },
    { id: 3, name: "Pump Cover Hoodie", price: 850, image: "hoodie.jpg" },
    { id: 4, name: "Lifting Straps", price: 150, image: "straps.jpg" }
];

// Initialize cart from local storage or empty array
let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const totalPriceEl = document.getElementById('totalPrice');

// Render products to the page
function loadProducts() {
    productGrid.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'ProductCard';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
            <h3>${product.name}</h3>
            <p>₺${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productGrid.appendChild(card);
    });
}

// Add item to cart
function addToCart(productId) {
    console.log("Adding product:", productId); // left in for debugging
    const product = products.find(p => p.id === productId);
    
    // check if it's already in the cart
    const existingItem = cart.find(item => item.id === productId);
    if(existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
}

// Save to local storage
function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cart));
}

// Update cart modal and count
function updateCartUI() {
    cartCount.innerText = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <span>${item.name} (x${item.quantity})</span>
                    <span>₺${item.price * item.quantity}</span>
                    <button onclick="removeFromCart(${index})" style="color:red; border:none; background:none; cursor:pointer;">X</button>
                </div>
            `;
        });
    }

    totalPriceEl.innerText = total.toFixed(2);
}

// Remove item
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

// Modal Toggle Logic
cartBtn.addEventListener('click', () => {
    cartModal.classList.remove('modal-hidden');
});

closeCart.addEventListener('click', () => {
    cartModal.classList.add('modal-hidden');
});

// Close modal if user clicks outside of it
window.onclick = function(event) {
    if (event.target === cartModal) {
        cartModal.classList.add('modal-hidden');
    }
}

// Init app
loadProducts();
updateCartUI();
