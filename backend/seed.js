require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/product");

const products = [
  {
    name: "Midnight Chrono Watch",
    price: 249.99,
    description: "A sleek chronograph watch with a midnight-blue dial.",
    category: "Watches",
    images: ["./images/watch1.jpg"],
    stock: 5,
    discount: 17,
  },
  {
    name: "StreetCore Joggers",
    price: 399.99,
    description: "Comfortable everyday joggers with a tapered fit.",
    category: "Pants",
    images: ["./images/pant1.jpg"],
    stock: 12,
  },
  {
    name: "AeroFlex Graphic T-shirt",
    price: 49.99,
    description: "Lightweight graphic tee for everyday wear.",
    category: "T-Shirts",
    images: ["./images/tshirt1.webp"],
    stock: 20,
  },
  {
    name: "Running Shoes",
    price: 129.99,
    description: "Breathable running shoes built for daily training.",
    category: "Shoes",
    images: ["./images/shoe1.jpg"],
    stock: 0,
  },
  {
    name: "NovaFit Slim Bottoms",
    price: 249.99,
    description: "Slim-fit bottoms with a modern silhouette.",
    category: "Pants",
    images: ["./images/pant2.webp"],
    stock: 8,
    discount: 17,
  },
  {
    name: "NeoPrint Casual Tee",
    price: 399.99,
    description: "Casual printed tee for everyday styling.",
    category: "T-Shirts",
    images: ["./images/thsirt2.jpeg"],
    stock: 15,
  },
  {
    name: "EliteForm Trousers",
    price: 49.99,
    description: "Tailored trousers for a sharp, elevated look.",
    category: "Pants",
    images: ["./images/pant3.webp"],
    stock: 10,
  },
  {
    name: "Classic Edge Shirt",
    price: 199.99,
    description: "Timeless button-up shirt for versatile styling.",
    category: "Shirts",
    images: ["./images/shirt1.jpg"],
    stock: 7,
  },
  {
    name: "StreetFly Kicks",
    price: 249.99,
    description: "Street-style sneakers with bold detailing.",
    category: "Shoes",
    images: ["./images/shoe2.jpg"],
    stock: 6,
    discount: 17,
  },
  {
    name: "MetroCheck Shirt",
    price: 399.99,
    description: "Checked shirt with a modern metro-casual cut.",
    category: "Shirts",
    images: ["./images/shirt2.jpg"],
    stock: 9,
  },
  {
    name: "TitanEdge Chronograph",
    price: 49.99,
    description: "Bold chronograph watch with a titanium-inspired finish.",
    category: "Watches",
    images: ["./images/watch2.jpg"],
    stock: 4,
  },
  {
    name: "VibeCore Casual Shirt",
    price: 129.99,
    description: "Relaxed casual shirt for everyday comfort.",
    category: "Shirts",
    images: ["./images/shirt3.jpeg"],
    stock: 0,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    const created = await Product.insertMany(products);
    console.log(`✅ Seeded ${created.length} products`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seed();