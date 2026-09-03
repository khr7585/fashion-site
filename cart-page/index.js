function openCart(e) {
  if (e) e.preventDefault();
  document.getElementById("cartOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  document.getElementById("cartOverlay").classList.remove("open");
  document.body.style.overflow = "";
}
document.getElementById("cartCloseBtn").addEventListener("click", closeCart);
document.getElementById("cartContinueBtn").addEventListener("click", closeCart);
document.getElementById("cartBackdrop").addEventListener("click", closeCart);
const CART_STORAGE_KEY = "khrCart";
const CART_API_URL = `${API_URL}/api/cart`;
function saveCartLocal() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function loadCartLocal() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    return [];
  }
}
async function saveCart() {
  if (isLoggedIn) {
    try {
      await fetch(CART_API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cart }),
      });
    } catch (err) {
      console.error("Save cart to server failed:", err.message);
    }
  } else {
    saveCartLocal();
  }
}
async function loadCart() {
  if (isLoggedIn) {
    try {
      const res = await fetch(CART_API_URL, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        return data.cart || [];
      }
    } catch (err) {
      console.error("Load cart from server failed:", err.message);
    }
    return [];
  }
  return loadCartLocal();
}
let cart = [];

function addToCart(productId) {
  if (!isLoggedIn) {
    showToast("Please log in to add items to your cart.");
    // setTimeout (()=>{
    // window.location.href = "./login-page/index.html";
    // },1200);
    return;
  }
  const product = products.find((item) => item.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart(productId);
  openCart();
}

function changeQuantity(productId, delta) {
  const item = cart.find((item) => item.id == productId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart = cart.filter((item) => item.id != productId);
  }

  updateCart(productId);
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id != productId);
  updateCart();
}

function parsePrice(priceStr) {
  return parseFloat(String(priceStr).replace(/[^0-9.]/g, ""));
}

function updateCart(changedId = null) {
  const cartBody = document.getElementById("cartBody");
  const cartCount = document.getElementById("cartCount");
  const cartSubtotal = document.getElementById("cartSubtotal");
  const checkoutbtn = document.getElementById("proceedToCheckoutBtn");
  const navbadge = document.getElementById("navCartBadge");

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <p>Your cart is empty.</p>
      <p>Add some items to get started.</p>
    `;
    cartCount.textContent = "0";
    cartSubtotal.textContent = "$0.00";
    checkoutbtn.disabled = true;
    navbadge.textContent = "0";
    navbadge.classList.add("hidden");
    saveCart();
    return;
  }
  cartBody.classList.remove("is-empty");
  checkoutbtn.disabled = false;

  let total = 0;
  let count = 0;

  cartBody.innerHTML = "";

  cart.forEach((item) => {
    const price = parsePrice(item.price);
    total += price * item.quantity;
    count += item.quantity;

    cartBody.innerHTML += `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" width="70">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>${item.price}</p>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" data-action="decrease" data-id="${item.id}">−</button>
          <input class="qty-input" type="text" value="${item.quantity}" data-id="${item.id}" readonly>
          <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
        </div>
        <button class="remove-btn" data-action="remove" data-id="${item.id}">&times;</button>
      </div>
      <hr>
    `;
  });

  cartCount.textContent = count;
  cartSubtotal.textContent = "$" + total.toFixed(2);
  navbadge.textContent = count;
  navbadge.classList.remove("hidden");
  if (changedId != null) {
    const row = cartBody.querySelector(`.cart-item[data-id="${changedId}"]`);
    if (row) {
      row.classList.add("qty-flash");
      setTimeout(() => row.classList.remove("qty-flash"), 400);
    }
  }
  saveCart();
}

document.getElementById("cartBody").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const id = btn.dataset.id;
  const action = btn.dataset.action;

  if (action === "increase") changeQuantity(id, 1);
  if (action === "decrease") changeQuantity(id, -1);
  if (action === "remove") removeFromCart(id);
});
async function initCart() {
  cart = await loadCart();
  updateCart();
}
