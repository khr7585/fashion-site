function goto_login() {
  window.location.href = "./login-page/index.html";
}
function back_to_shop() {
  window.history.back();
}

function openSearch(e) {
  if (e) e.preventDefault();
  document.getElementById("overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeSearch() {
  document.getElementById("overlay").classList.remove("open");
  document.body.style.overflow = "";
}
document.getElementById("closeSearch").addEventListener("click", closeSearch);
document.getElementById("backdrop").addEventListener("click", closeSearch);

const navbar = document.querySelector(".navbar");
function handleNavbar() {
  if (window.scrollY === 0) {
    navbar.classList.remove("scrolled");
  } else {
    navbar.classList.add("scrolled");
  }
}
window.addEventListener("scroll", handleNavbar);
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
  handleNavbar();
});
const products = [
  {
    id: 1,
    name: "Midnight Chrono Watch",
    price: "$249.99",
    oldPrice: "$299.99",
    image: "./images/watch1.jpg",
    badge: "New",
    badgeClass: "new",
  },
  {
    id: 2,
    name: "StreetCore Joggers",
    price: "$399.99",
    image: "./images/pant1.jpg",
    badge: "Popular",
    badgeClass: "yellow",
  },
  {
    id: 3,
    name: "AeroFlex Graphic T-shirt",
    price: "$49.99",
    image: "./images/tshirt1.webp",
    badge: "Sale",
    badgeClass: "sale",
  },
  {
    id: 4,
    name: "Running Shoes",
    price: "$129.99",
    image: "./images/shoe1.jpg",
    outOfStock: true,
  },
  {
    id: 5,
    name: "NovaFit Slim Bottoms",
    price: "$249.99",
    oldPrice: "$299.99",
    image: "./images/pant2.webp",
    badge: "New",
    badgeClass: "new",
  },
  {
    id: 6,
    name: "NeoPrint Casual Tee",
    price: "$399.99",
    image: "./images/thsirt2.jpeg",
    badge: "Popular",
    badgeClass: "yellow",
  },
  {
    id: 7,
    name: "EliteForm Trousers",
    price: "$49.99",
    image: "./images/pant3.webp",
    badge: "Sale",
    badgeClass: "sale",
  },
  {
    id: 8,
    name: "Classic Edge Shirt",
    price: "$199.99",
    image: "./images/shirt1.jpg",
    badge: "Trending",
    badgeClass: "new",
  },
  {
    id: 9,
    name: "StreetFly Kicks",
    price: "$249.99",
    oldPrice: "$299.99",
    image: "./images/shoe2.jpg",
    badge: "New",
    badgeClass: "new",
  },
  {
    id: 10,
    name: "MetroCheck Shirt",
    price: "$399.99",
    image: "./images/shirt2.jpg",
    badge: "Popular",
    badgeClass: "yellow",
  },
  {
    id: 11,
    name: "TitanEdge Chronograph",
    price: "$49.99",
    image: "./images/watch2.jpg",
    badge: "Sale",
    badgeClass: "sale",
  },
  {
    id: 12,
    name: "VibeCore Casual Shirt",
    price: "$129.99",
    image: "./images/shirt3.jpeg",
    outOfStock: true,
  },
];

const productGrid = document.getElementById("productGrid");

products.forEach((product) => {
  const card = document.createElement("div");

  card.className = product.outOfStock ? "card out" : "card";

  card.innerHTML = `
    ${
      product.badge
        ? `<span class="badge ${product.badgeClass}">
            ${product.badge}
          </span>`
        : ""
    }

    <button class="wishlist"
      onclick="this.classList.toggle('active')">
      <svg viewBox="0 0 24 24" stroke-width="1.8">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </button>

    <img
      src="${product.image}"
      alt="${product.name}"
      onclick="openProduct(${product.id})"
      style="cursor:pointer"
      >

    <div class="info">
      <h3>${product.name}</h3>

      <p class="price">
        ${product.price}
        ${product.oldPrice ? `<span>${product.oldPrice}</span>` : ""}
      </p>

      <button
  class="card-btn ${product.outOfStock ? "out-of-stock" : ""}"
  onclick="addToCart(${product.id})"
  ${product.outOfStock ? "disabled" : ""}
>
  ${product.outOfStock ? "Out of Stock" : "Add to Cart"}
</button>
    </div>
  `;

  productGrid.appendChild(card);
});
function openProduct(id) {
  window.location.href = `./product-page/product.html?id=${id}`;
}

// const firebaseConfig = {
//   apiKey: "AIzaSyAv5wV8B3oW_yBtaOjCUbb83QWGQFPDXAE",
//   authDomain: "fashion-site-c7a4d.firebaseapp.com",
//   projectId: "fashion-site-c7a4d",
//   storageBucket: "fashion-site-c7a4d.firebasestorage.app",
//   messagingSenderId: "862721379399",
//   appId: "1:862721379399:web:3ec81f51565e1cc6197562",
//   measurementId: "G-QZBJX9YVYB"
// };







let checkoutData = { address: null, cart: [] }; // populate cart from your existing cart state

document.getElementById('proceedToCheckoutBtn').addEventListener('click', () => {
  closeCart();
  checkoutData.cart = cart;
  document.getElementById('checkoutModal').style.display = 'flex';
  showStep('address');
});

document.getElementById('closeCheckout').addEventListener('click', () => {
  document.getElementById('checkoutModal').style.display = 'none';
});

function showStep(step) {
  document.querySelectorAll('.checkout-step').forEach(el => el.style.display = 'none');
  document.getElementById(`step-${step}`).style.display = 'block';
  const labels = { address: 'Shipping Address', summary: 'Order Summary', payment: 'Payment' };
  document.getElementById('checkoutStepLabel').textContent = labels[step];
}

document.getElementById('addressForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  checkoutData.address = Object.fromEntries(form.entries());
  renderSummary();
  showStep('summary');
});

document.getElementById('backToAddress').addEventListener('click', () => showStep('address'));

function renderSummary() {
  const container = document.getElementById('summaryItems');
  container.innerHTML = '';
  let subtotal = 0;
  checkoutData.cart.forEach(item => {
    const price = parseFloat(item.price.replace('$', ''));
    subtotal += price * item.quantity;
    container.innerHTML += `
      <div class="summary-row">
        <span>${item.name} x${item.quantity}</span>
        <span>$${(price * item.quantity).toFixed(2)}</span>
      </div>`;
  });
  document.getElementById('summarySubtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('summaryTotal').textContent = `$${subtotal.toFixed(2)}`;
  checkoutData.total = subtotal;
}

document.getElementById('proceedToPayment').addEventListener('click', () => showStep('payment'));

document.getElementById('payNowBtn').addEventListener('click', async () => {
  try {
    const res = await fetch('http://localhost:3000/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: checkoutData.total, currency: 'INR' })
    });
    if (!res.ok) throw new Error('Order creation failed');
    const order = await res.json();
    // ... rest stays the same
  } catch (err) {
    console.error('Payment error:', err);
    alert('Something went wrong. Please try again.');
  }
});


// document.getElementById('payNowBtn').addEventListener('click', async () => {
//   try{

//   }
//   // 1. Ask your backend to create a Razorpay order
//   const res = await fetch('http://localhost:3000/api/create-order', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ amount: checkoutData.total, currency: 'INR' })
//   });
//   const order = await res.json();

  // 2. Open Razorpay checkout
  const rzp = new Razorpay({
    amount: order.amount,
    currency: order.currency,
    name: 'KHR',
    description: 'Order Payment',
    order_id: order.id,
    handler: async function (response) {
      // 3. Verify payment on your backend
      const verifyRes = await fetch('https://localhost:3000/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...response,
          address: checkoutData.address,
          cart: checkoutData.cart
        })
      });
      const result = await verifyRes.json();
      if (result.success) {
        document.getElementById('checkoutModal').style.display = 'none';
        alert('Order placed successfully!');
      }
    },
    prefill: {
      name: checkoutData.address.fullName,
      contact: checkoutData.address.phone
    },
    theme: { color: '#000000' }
  });
  rzp.open();
// });