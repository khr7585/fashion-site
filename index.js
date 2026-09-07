// const API_URL = "http://localhost:3000";
// const API_URL = "https://fashion-site-0onq.onrender.com";
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://fashion-site-0onq.onrender.com";
function goto_login() {
  window.location.href = "./login-page/index.html";
}
function back_to_shop() {
  window.history.back();
}
// TOAST-alert message
function showToast(message, duration = 2500) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}
// TOAST END

//AUTH START
const AUTH_API_BASE = API_URL;
let isLoggedIn = false;
async function checkAuthState() {
  const loginBtn = document.querySelector(".login");
  try {
    const res = await fetch(`${AUTH_API_BASE}/api/auth/me`, {
      credentials: "include",
    });
    if (res.ok) {
      const { user } = await res.json();
      isLoggedIn = true;
      if (loginBtn) {
        loginBtn.textContent = "Logout";
        loginBtn.setAttribute("onclick", "logout()");
      }
    } else {
      isLoggedIn = false;
    }
  } catch (e) {
    isLoggedIn = false;
    console.error("Auth check failed:", e.message);
  } finally {
    document.querySelectorAll(".card-btn:not(.out-of-stock)").forEach((btn) => {
      btn.disabled = false;
    });
    initCart();
  }
}
async function logout() {
  try {
    await fetch(`${AUTH_API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (e) {
    console.error("Logout error:", e.message);
  } finally {
    // localStorage.removeItem("khrCart");
    window.location.reload();
  }
}
loadProducts().then(() => {
  checkAuthState();
});
// END AUTH

//NAVABAR START
const navbar = document.querySelector(".navbar");
function handleNavbar() {
  if (window.scrollY === 0) {
    navbar.classList.remove("scrolled");
  } else {
    navbar.classList.add("scrolled");
  }
}
window.addEventListener("scroll", handleNavbar);
window.addEventListener("load", handleNavbar);
//NAVBAR END

//HAMBURGER MENU START
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navRight = document.getElementById("navRight");
hamburgerBtn.addEventListener("click", () => {
  navRight.classList.toggle("open");
});
navRight.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("click", () => {
    navRight.classList.remove("open");
  });
});
//HAMBURGER MENU END

//PRODUCTS START
let products=[];

const productGrid = document.getElementById("productGrid");
async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/api/products`);
    const data = await res.json();

    products = data.products.map((p) => {
      const hasDiscount = p.discount > 0;
      const oldPrice = hasDiscount
        ? (p.price / (1 - p.discount / 100)).toFixed(2)
        : null;

      return {
        id: p._id,
        name: p.name,
        price: `₹${p.price.toFixed(2)}`,
        oldPrice: hasDiscount ? `₹${oldPrice}` : undefined,
        image: p.images[0],
        badge: hasDiscount ? "Sale" : undefined,
        badgeClass: hasDiscount ? "sale" : undefined,
        outOfStock: p.stock === 0,
        stock: p.stock,
        description: p.description,
        details: p.details,
      };
    });

    renderProducts();
  } catch (err) {
    console.error("Failed to load products:", err.message);
  }
}

function renderProducts() {
  productGrid.innerHTML = "";

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
        onclick="openProduct('${product.id}')"
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
    onclick="addToCart('${product.id}')"
    ${product.outOfStock ? "disabled" : ""}
  >
    ${product.outOfStock ? "Out of Stock" : "Add to Cart"}
  </button>
      </div>
    `;

    productGrid.appendChild(card);
  });

  document.querySelectorAll(".card-btn:not(.out-of-stock)").forEach((btn) => {
    btn.disabled = true;
  });

  renderChips();
}

function openProduct(id) {
  window.location.href = `./product-page/product.html?id=${id}`;
}
//PRODUCTS END

//SEARCH PART START
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
const CATEGORY_RULES = [
  { label: "Watches", test: (n) => /watch|chrono/i.test(n) },
  { label: "Shirts", test: (n) => /shirt/i.test(n) },
  { label: "T-Shirts", test: (n) => /t-?shirt|tee/i.test(n) },
  { label: "Pants", test: (n) => /jogger|trouser|pant|bottom/i.test(n) },
  { label: "Shoes", test: (n) => /shoe|kicks|sneaker/i.test(n) },
];

function getCategories(product) {
  return CATEGORY_RULES.filter((c) => c.test(product.name)).map((c) => c.label);
}

const searchInput = document.getElementById("searchInput");
const searchChips = document.getElementById("searchChips");
const searchResults = document.getElementById("searchResults");

let activeCategory = null;

function renderChips() {
  const present = new Set();
  products.forEach((p) => getCategories(p).forEach((c) => present.add(c)));

  searchChips.innerHTML = "";
  present.forEach((label) => {
    const chip = document.createElement("button");
    chip.className =
      "search-chip" + (activeCategory === label ? " active" : "");
    chip.textContent = label;
    chip.addEventListener("click", () => {
      activeCategory = activeCategory === label ? null : label;
      renderChips();
      runSearch();
    });
    searchChips.appendChild(chip);
  });
}

function highlightMatch(name, query) {
  if (!query) return name;
  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "ig",
  );
  return name.replace(regex, "<mark>$1</mark>");
}

function runSearch() {
  const query = searchInput.value.trim().toLowerCase();

  let matches = products.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(query);
    const categoryMatch = activeCategory
      ? getCategories(p).includes(activeCategory)
      : true;
    return nameMatch && categoryMatch;
  });

  searchResults.innerHTML = "";

  if (!query && !activeCategory) {
    return;
  }

  if (matches.length === 0) {
    searchResults.innerHTML = `<div class="search-empty">No products found${query ? ` for "${searchInput.value}"` : ""}.</div>`;
    return;
  }

  matches.forEach((p) => {
    const item = document.createElement("div");
    item.className = "search-result-item";
    item.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="search-result-info">
        <h4>${highlightMatch(p.name, query)}</h4>
        <p>${p.price}</p>
      </div>
    `;
    item.addEventListener("click", () => openProduct(p.id));
    searchResults.appendChild(item);
  });
}

searchInput.addEventListener("input", runSearch);
renderChips();

function openSearch(e) {
  if (e) e.preventDefault();

  const target = document.getElementById("our-products");
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  setTimeout(() => {
    document.getElementById("overlay").classList.add("open");
    document.body.style.overflow = "hidden";
  }, 400);
}
//SEARCH PART END

//RAZORPAY START
let checkoutData = { address: null, cart: [] }; // populate cart from your existing cart state

document
  .getElementById("proceedToCheckoutBtn")
  .addEventListener("click", () => {
    closeCart();
    checkoutData.cart = cart;
    document.getElementById("checkoutModal").style.display = "flex";
    showStep("address");
  });

document.getElementById("closeCheckout").addEventListener("click", () => {
  document.getElementById("checkoutModal").style.display = "none";
});

function showStep(step) {
  document
    .querySelectorAll(".checkout-step")
    .forEach((el) => (el.style.display = "none"));
  document.getElementById(`step-${step}`).style.display = "block";
  const labels = {
    address: "Shipping Address",
    summary: "Order Summary",
    payment: "Payment",
  };
  document.getElementById("checkoutStepLabel").textContent = labels[step];
}

document.getElementById("addressForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  checkoutData.address = Object.fromEntries(form.entries());
  renderSummary();
  showStep("summary");
});

document
  .getElementById("backToAddress")
  .addEventListener("click", () => showStep("address"));

function renderSummary() {
  const container = document.getElementById("summaryItems");
  container.innerHTML = "";
  let subtotal = 0;
  let stockIssue = false;
  checkoutData.cart.forEach((item) => {
    const price = parsePrice(item.price);
    subtotal += price * item.quantity;
    if (item.quantity > item.stock) {
      stockIssue = true;
    }
    container.innerHTML += `
      <div class="summary-row">
        <span>${item.name} x${item.quantity}</span>
        <span>$${(price * item.quantity).toFixed(2)}</span>
      </div>`;
  });
  document.getElementById("summarySubtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("summaryTotal").textContent = `$${subtotal.toFixed(2)}`;
  checkoutData.total = subtotal;
  const proceedbtn = document.getElementById("proceedToPayment");
  if (stockIssue) {
    proceedbtn.disabled = true;
    showToast("Some items exceed available stock. Please adjust your cart.");
  } else {
    proceedbtn.disabled = false;
  }
}

document
  .getElementById("proceedToPayment")
  .addEventListener("click", () => showStep("payment"));

document.getElementById("payNowBtn").addEventListener("click", async () => {
  let order = null;
  try {
    const res = await fetch(`${API_URL}/api/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ amount: checkoutData.total, currency: "INR", cart: checkoutData.cart }),
    });
    if (res.status === 401) {
      alert("Please log in to complete your purchase.");
      window.location.href = "./login-page/index.html";
      return;
    }
    if (res.status === 409) {
  const data = await res.json();
  showToast(data.error);
  return;
}
    if (!res.ok) throw new Error("Order creation failed");
    order = await res.json();
    console.log(order);
  } catch (err) {
    console.error("Payment error:", err);
    alert("Something went wrong. Please try again.");
  }

  const rzp = new Razorpay({
    key: "rzp_test_TAokbyzSsNmcaF",
    amount: order.amount,
    currency: order.currency,
    name: "KHR",
    description: "Order Payment",
    order_id: order.id,
    handler: async function (response) {
  const verifyRes = await fetch(`${API_URL}/api/verify-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      ...response,
      address: checkoutData.address,
      cart: checkoutData.cart,
    }),
  });
  const result = await verifyRes.json();
  if (result.success) {
    document.getElementById("checkoutModal").style.display = "none";
    cart = [];
    updateCart();
    showToast("Order placed successfully!");
  } else {
    showToast(result.message || "Payment verification failed.");
  }
},
    prefill: {
      name: checkoutData.address.fullName,
      contact: checkoutData.address.phone,
    },
    theme: { color: "#000000" },
  });
  rzp.open();
});
//RAZORPAY END

//CONTACT START
const contactDrawer = document.getElementById("contactDrawer");
const contactBackdrop = document.getElementById("contactBackdrop");

function openContactDrawer() {
  contactDrawer.classList.add("open");
  contactBackdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeContactDrawer() {
  contactDrawer.classList.remove("open");
  contactBackdrop.classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("contactTrigger")?.addEventListener("click", (e) => {
  e.preventDefault();
  openContactDrawer();
});

document
  .getElementById("closeContactDrawer")
  .addEventListener("click", closeContactDrawer);
contactBackdrop.addEventListener("click", closeContactDrawer);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeContactDrawer();
});

const CONTACT_API_URL = "https://fashion-site-0onq.onrender.com";

document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitBtn = document.getElementById("submitBtn");
  const status = document.getElementById("formStatus");

  const payload = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    reason: document.getElementById("reason").value,
    message: document.getElementById("message").value.trim(),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "SENDING...";
  status.textContent = "";
  status.className = "form-status";

  try {
    const res = await fetch(CONTACT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong");

    status.textContent = "Message sent — we'll get back to you soon.";
    status.classList.add("success");
    document.getElementById("contactForm").reset();
  } catch (err) {
    status.textContent = err.message || "Couldn't send message. Try again.";
    status.classList.add("error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "SEND MESSAGE";
  }
});
//CONTACT END