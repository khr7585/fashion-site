require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/product");

const products = [
  {
    name: "Midnight Chrono Watch",
    price: 249.99,
    description: "A sleek chronograph watch with a midnight-blue dial.",
    details: [
      "Stainless steel case",
      "Water resistant",
      "Premium leather strap",
      "Quartz movement",
    ],
    category: "Watches",
    images: ["./images/watch1.png"],
    stock: 5,
    discount: 17,
  },
  {
    name: "StreetCore Joggers",
    price: 399.99,
    description: "Comfortable everyday joggers with a tapered fit.",
    details: [
      "Cotton blend",
      "Slim fit",
      "Elastic waistband",
      "Machine washable",
    ],
    category: "Pants",
    images: ["./images/pant1.jpg"],
    stock: 12,
  },
  {
    name: "AeroFlex Graphic T-shirt",
    price: 49.99,
    description: "Relaxed-fit oversized tee with graphic print.",
    details: [
      "100% combed cotton",
      "Oversized fit",
      "Graphic print",
      "Machine washable",
    ],
    category: "T-Shirts",
    images: ["./images/tshirt1.webp"],
    stock: 20,
    discount: 29,
  },
  {
    name: "Running Shoes",
    price: 129.99,
    description:
      "Lightweight performance running shoes designed for comfort and speed.",
    details: [
      "Breathable mesh upper",
      "Cushioned midsole",
      "Rubber outsole grip",
      "Ideal for daily running",
    ],
    category: "Shoes",
    images: ["./images/shoe1.jpg"],
    stock: 0,
  },
  {
    name: "NovaFit Slim Bottoms",
    price: 249.99,
    description: "Modern slim-fit bottoms with a clean athletic silhouette.",
    details: [
      "Stretch fabric construction",
      "Slim fit design",
      "Side cargo pockets",
      "Machine washable",
    ],
    category: "Pants",
    images: ["./images/pant2.webp"],
    stock: 8,
    discount: 17,
  },
  {
    name: "NeoPrint Casual Tee",
    price: 399.99,
    description: "Casual graphic tee built for everyday comfort and style.",
    details: [
      "Premium cotton fabric",
      "Regular fit",
      "Front graphic print",
      "Soft breathable material",
    ],
    category: "T-Shirts",
    images: ["./images/thsirt2.jpeg"],
    stock: 15,
  },
  {
    name: "EliteForm Trousers",
    price: 49.99,
    description:
      "Elegant trousers suitable for both formal and casual occasions.",
    details: [
      "Tailored fit",
      "Wrinkle-resistant fabric",
      "Comfort waistband",
      "Easy maintenance",
    ],
    category: "Pants",
    images: ["./images/pant3.webp"],
    stock: 10,
  },
  {
    name: "Classic Edge Shirt",
    price: 199.99,
    description: "Classic check-pattern shirt with a modern fitted cut.",
    details: [
      "Premium cotton blend",
      "Button-down closure",
      "Slim-fit styling",
      "All-season wear",
    ],
    category: "Shirts",
    images: ["./images/shirt1.jpg"],
    stock: 7,
  },
  {
    name: "StreetFly Kicks",
    price: 249.99,
    description: "Street-inspired sneakers combining comfort and bold design.",
    details: [
      "Premium synthetic upper",
      "Padded ankle support",
      "Durable rubber sole",
      "Urban streetwear style",
    ],
    category: "Shoes",
    images: ["./images/shoe2.jpg"],
    stock: 6,
    discount: 17,
  },
  {
    name: "MetroCheck Shirt",
    price: 399.99,
    description:
      "Modern printed shirt perfect for vacations and casual outings.",
    details: [
      "Lightweight fabric",
      "Short sleeve design",
      "Relaxed fit",
      "Breathable material",
    ],
    category: "Shirts",
    images: ["./images/shirt2.jpg"],
    stock: 9,
  },
  {
    name: "TitanEdge Chronograph",
    price: 49.99,
    description: "Stylish chronograph watch with a premium metallic finish.",
    details: [
      "Chronograph functionality",
      "Stainless steel bracelet",
      "Scratch-resistant glass",
      "Water resistant",
    ],
    category: "Watches",
    images: ["./images/watch2.jpg"],
    stock: 4,
  },
  {
    name: "VibeCore Casual Shirt",
    price: 129.99,
    description: "Comfortable casual shirt designed for everyday wear.",
    details: [
      "Soft cotton fabric",
      "Relaxed fit",
      "Button front closure",
      "Easy-care material",
    ],
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
