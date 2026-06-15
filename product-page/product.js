function goBack() {
  window.history.back();
}

//   function setImage(thumb, src) {
//     document.getElementById('mainImage').src = src;
//     document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
//     thumb.classList.add('active');
//   }

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

const products = [
  {
    id: 1,
    name: "Midnight Chrono Watch",
    price: "$249.99",
    oldPrice: "$299.99",
    image: "../images/watch1.jpg",
    badge: "NEW",
    badgeClass: "new",
    description: "Premium chronograph watch with luxury styling.",
    details: [
      "Stainless steel case",
      "Water resistant",
      "Premium leather strap",
      "Quartz movement",
    ],
  },

  {
    id: 2,
    name: "StreetCore Joggers",
    price: "$399.99",
    image: "../images/pant1.jpg",
    badge: "POPULAR",
    badgeClass: "popular",
    description: "Comfortable joggers for everyday streetwear.",
    details: [
      "Cotton blend",
      "Slim fit",
      "Elastic waistband",
      "Machine washable",
    ],
  },

  {
    id: 3,
    name: "AeroFlex Graphic T-shirt",
    price: "$49.99",
    oldPrice: "$69.99",
    image: "../images/tshirt1.webp",
    badge: "SALE",
    badgeClass: "sale",
    description: "Relaxed-fit oversized tee with graphic print.",
    details: [
      "100% combed cotton",
      "Oversized fit",
      "Graphic print",
      "Machine washable",
    ],
  },
  {
    id: 4,
    name: "Running Shoes",
    price: "$129.99",
    image: "../images/shoe1.jpg",
    badge: "OUT OF STOCK",
    badgeClass: "sale",
    description:
      "Lightweight performance running shoes designed for comfort and speed.",
    details: [
      "Breathable mesh upper",
      "Cushioned midsole",
      "Rubber outsole grip",
      "Ideal for daily running",
    ],
  },

  {
    id: 5,
    name: "NovaFit Slim Bottoms",
    price: "$249.99",
    oldPrice: "$299.99",
    image: "../images/pant2.webp",
    badge: "NEW",
    badgeClass: "new",
    description: "Modern slim-fit bottoms with a clean athletic silhouette.",
    details: [
      "Stretch fabric construction",
      "Slim fit design",
      "Side cargo pockets",
      "Machine washable",
    ],
  },

  {
    id: 6,
    name: "NeoPrint Casual Tee",
    price: "$399.99",
    image: "../images/thsirt2.jpeg",
    badge: "POPULAR",
    badgeClass: "popular",
    description: "Casual graphic tee built for everyday comfort and style.",
    details: [
      "Premium cotton fabric",
      "Regular fit",
      "Front graphic print",
      "Soft breathable material",
    ],
  },

  {
    id: 7,
    name: "EliteForm Trousers",
    price: "$49.99",
    image: "../images/pant3.webp",
    badge: "SALE",
    badgeClass: "sale",
    description:
      "Elegant trousers suitable for both formal and casual occasions.",
    details: [
      "Tailored fit",
      "Wrinkle-resistant fabric",
      "Comfort waistband",
      "Easy maintenance",
    ],
  },

  {
    id: 8,
    name: "Classic Edge Shirt",
    price: "$199.99",
    image: "../images/shirt1.jpg",
    badge: "TRENDING",
    badgeClass: "trending",
    description: "Classic check-pattern shirt with a modern fitted cut.",
    details: [
      "Premium cotton blend",
      "Button-down closure",
      "Slim-fit styling",
      "All-season wear",
    ],
  },

  {
    id: 9,
    name: "StreetFly Kicks",
    price: "$249.99",
    oldPrice: "$299.99",
    image: "../images/shoe2.jpg",
    badge: "NEW",
    badgeClass: "new",
    description: "Street-inspired sneakers combining comfort and bold design.",
    details: [
      "Premium synthetic upper",
      "Padded ankle support",
      "Durable rubber sole",
      "Urban streetwear style",
    ],
  },

  {
    id: 10,
    name: "MetroCheck Shirt",
    price: "$399.99",
    image: "../images/shirt2.jpg",
    badge: "POPULAR",
    badgeClass: "popular",
    description:
      "Modern printed shirt perfect for vacations and casual outings.",
    details: [
      "Lightweight fabric",
      "Short sleeve design",
      "Relaxed fit",
      "Breathable material",
    ],
  },

  {
    id: 11,
    name: "TitanEdge Chronograph",
    price: "$49.99",
    image: "../images/watch2.jpg",
    badge: "SALE",
    badgeClass: "sale",
    description: "Stylish chronograph watch with a premium metallic finish.",
    details: [
      "Chronograph functionality",
      "Stainless steel bracelet",
      "Scratch-resistant glass",
      "Water resistant",
    ],
  },

  {
    id: 12,
    name: "VibeCore Casual Shirt",
    price: "$129.99",
    image: "../images/shirt3.jpeg",
    badge: "OUT OF STOCK",
    badgeClass: "sale",
    description: "Comfortable casual shirt designed for everyday wear.",
    details: [
      "Soft cotton fabric",
      "Relaxed fit",
      "Button front closure",
      "Easy-care material",
    ],
  },
];

const params = new URLSearchParams(window.location.search);

const productId = Number(params.get("id"));

const product = products.find((p) => p.id === productId);

if (product) {
  document.getElementById("mainImage").src = product.image;

  document.getElementById("mainImage").alt = product.name;

  document.getElementById("productTitle").textContent = product.name;

  document.getElementById("price").textContent = product.price;

  document.getElementById("description").textContent = product.description;

  const badge = document.getElementById("badge");

  badge.textContent = product.badge;
  badge.className = `badge ${product.badgeClass}`;

  const oldPrice = document.getElementById("oldPrice");

  if (product.oldPrice) {
    oldPrice.textContent = product.oldPrice;
  } else {
    oldPrice.style.display = "none";
  }

  const detailsList = document.getElementById("detailsList");

  detailsList.innerHTML = "";

  product.details.forEach((item) => {
    detailsList.innerHTML += `
      <li>${item}</li>
    `;
  });
}
