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

let cart = [];

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
  openCart();
}

function changeQuantity(productId, delta) {
  const item = cart.find((item) => item.id == productId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart = cart.filter((item) => item.id != productId);
  }

  updateCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id != productId);
  updateCart();
}

function parsePrice(priceStr) {
  return parseFloat(String(priceStr).replace(/[^0-9.]/g, ""));
}

function updateCart() {
  const cartBody = document.getElementById("cartBody");
  const cartCount = document.getElementById("cartCount");
  const cartSubtotal = document.getElementById("cartSubtotal");

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <p>Your cart is empty.</p>
      <p>Add some items to get started.</p>
    `;
    cartCount.textContent = "0";
    cartSubtotal.textContent = "$0.00";
    return;
  }

  let total = 0;
  let count = 0;

  cartBody.innerHTML = "";

  cart.forEach((item) => {
    const price = parsePrice(item.price);
    total += price * item.quantity;
    count += item.quantity;

    cartBody.innerHTML += `
      <div class="cart-item">
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