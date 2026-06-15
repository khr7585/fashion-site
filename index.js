function goto_login() {
  window.location.href = "./login-page/index.html";
}
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

const btn = document.getElementById("checkout");
btn.addEventListener("mouseover", function () {
  btn.disabled = true;
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

      <button class="card-btn ${product.outOfStock ? "out-of-stock" : ""}">
        ${product.outOfStock ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  `;

  productGrid.appendChild(card);
});

// function openProduct(id) {
//   window.location.href = `product.html?id=${id}`;
// }

// const firebaseConfig = {
//   apiKey: "AIzaSyAv5wV8B3oW_yBtaOjCUbb83QWGQFPDXAE",
//   authDomain: "fashion-site-c7a4d.firebaseapp.com",
//   projectId: "fashion-site-c7a4d",
//   storageBucket: "fashion-site-c7a4d.firebasestorage.app",
//   messagingSenderId: "862721379399",
//   appId: "1:862721379399:web:3ec81f51565e1cc6197562",
//   measurementId: "G-QZBJX9YVYB"
// };
