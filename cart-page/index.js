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
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  updateCart();
  openCart();
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
    const price = parseFloat(item.price.replace("$", ""));

    total += price * item.quantity;
    count += item.quantity;

    cartBody.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" width="70">

        <div>
          <h4>${item.name}</h4>
          <p>${item.price}</p>
          <p>Qty: ${item.quantity}</p>
        </div>
      </div>
      <hr>
    `;
  });

  cartCount.textContent = count;
  cartSubtotal.textContent = "$" + total.toFixed(2);
}
