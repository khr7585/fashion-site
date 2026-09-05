const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://fashion-site-0onq.onrender.com";

function goBack() {
  window.history.back();
}

function setColor(swatch, name) {
  document
    .querySelectorAll(".swatch")
    .forEach((s) => s.classList.remove("active"));
  swatch.classList.add("active");
  document.getElementById("colorLabel").textContent = "Color: " + name;
}

function setSize(btn, size) {
  document
    .querySelectorAll(".size-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("sizeLabel").textContent = "Size: " + size;
}

function toggleWishlist() {
  const btn = document.getElementById("heartBtn");
  btn.classList.toggle("active");
  btn.innerHTML = btn.classList.contains("active") ? "&#9829;" : "&#9825;";
}

let qty = 1;
function changeQty(delta) {
  qty = Math.max(1, qty + delta);
  document.getElementById("qtyValue").textContent = qty;
}

function addToCart() {
  alert("Added " + qty + " item(s) to cart!");
}

async function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) return;

  try {
    const res = await fetch(`${API_URL}/api/products/${productId}`);
    const data = await res.json();

    if (!data.success || !data.product) return;

    const product = data.product;
    const hasDiscount = product.discount > 0;
    const oldPrice = hasDiscount
      ? (product.price / (1 - product.discount / 100)).toFixed(2)
      : null;

   document.getElementById("mainImage").src = product.images[0].replace("./images/", "../images/");
    document.getElementById("mainImage").alt = product.name;
    document.getElementById("productTitle").textContent = product.name;
    document.getElementById("price").textContent =
      `₹${product.price.toFixed(2)}`;
    document.getElementById("description").textContent = product.description;

    const badge = document.getElementById("badge");
    if (product.stock === 0) {
      badge.textContent = "OUT OF STOCK";
      badge.className = "badge sale";
    } else if (hasDiscount) {
      badge.textContent = "SALE";
      badge.className = "badge sale";
    } else {
      badge.style.display = "none";
    }

    const oldPriceEl = document.getElementById("oldPrice");
    if (hasDiscount) {
      oldPriceEl.textContent = `₹${oldPrice}`;
    } else {
      oldPriceEl.style.display = "none";
    }

    const detailsList = document.getElementById("detailsList");
    detailsList.innerHTML = "";
    (product.details || []).forEach((item) => {
      detailsList.innerHTML += `<li>${item}</li>`;
    });
  } catch (err) {
    console.error("Failed to load product:", err.message);
  }
}

loadProduct();
