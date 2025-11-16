import Product from "../models/Product.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const products = [
  {
    name: "Nike Air Max 90",
    description: "Classic running shoes with air cushioning technology for maximum comfort.",
    price: 120,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"],
    brand: "Nike",
    category: "running",
    sizes: [
      { size: 7, stock: 10 },
      { size: 8, stock: 15 },
      { size: 9, stock: 20 },
      { size: 10, stock: 12 },
      { size: 11, stock: 8 },
    ],
    color: "White/Black",
    rating: 4.5,
    numReviews: 120,
    countInStock: 65,
  },
  {
    name: "Adidas Ultraboost 22",
    description: "Premium running shoes with responsive cushioning and energy return.",
    price: 180,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
    images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500"],
    brand: "Adidas",
    category: "running",
    sizes: [
      { size: 7, stock: 8 },
      { size: 8, stock: 12 },
      { size: 9, stock: 18 },
      { size: 10, stock: 15 },
      { size: 11, stock: 10 },
    ],
    color: "Black/White",
    rating: 4.8,
    numReviews: 95,
    countInStock: 63,
  },
  {
    name: "Jordan 1 Retro High",
    description: "Iconic basketball sneakers with premium leather construction.",
    price: 170,
    image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500",
    images: ["https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500"],
    brand: "Nike",
    category: "basketball",
    sizes: [
      { size: 8, stock: 10 },
      { size: 9, stock: 15 },
      { size: 10, stock: 20 },
      { size: 11, stock: 12 },
      { size: 12, stock: 5 },
    ],
    color: "Bred",
    rating: 4.7,
    numReviews: 200,
    countInStock: 62,
  },
  {
    name: "Vans Old Skool",
    description: "Timeless skateboarding shoes with classic checkerboard design.",
    price: 65,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
    images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500"],
    brand: "Vans",
    category: "skateboarding",
    sizes: [
      { size: 7, stock: 20 },
      { size: 8, stock: 25 },
      { size: 9, stock: 30 },
      { size: 10, stock: 22 },
      { size: 11, stock: 15 },
    ],
    color: "Black/White",
    rating: 4.6,
    numReviews: 150,
    countInStock: 112,
  },
  {
    name: "New Balance 550",
    description: "Retro-inspired lifestyle sneakers with premium materials.",
    price: 110,
    image: "https://images.unsplash.com/photo-1605030753481-bb38b08c384a?w=500",
    images: ["https://images.unsplash.com/photo-1605030753481-bb38b08c384a?w=500"],
    brand: "New Balance",
    category: "lifestyle",
    sizes: [
      { size: 7, stock: 12 },
      { size: 8, stock: 18 },
      { size: 9, stock: 22 },
      { size: 10, stock: 20 },
      { size: 11, stock: 14 },
    ],
    color: "White/Grey",
    rating: 4.4,
    numReviews: 88,
    countInStock: 86,
  },
  {
    name: "Puma RS-X",
    description: "Futuristic design with advanced cushioning technology.",
    price: 100,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
    images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"],
    brand: "Puma",
    category: "lifestyle",
    sizes: [
      { size: 7, stock: 10 },
      { size: 8, stock: 15 },
      { size: 9, stock: 18 },
      { size: 10, stock: 16 },
      { size: 11, stock: 12 },
    ],
    color: "Multi-color",
    rating: 4.3,
    numReviews: 75,
    countInStock: 71,
  },
  {
    name: "Reebok Classic Leather",
    description: "Vintage-inspired sneakers with timeless style and comfort.",
    price: 75,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500",
    images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500"],
    brand: "Reebok",
    category: "lifestyle",
    sizes: [
      { size: 7, stock: 15 },
      { size: 8, stock: 20 },
      { size: 9, stock: 25 },
      { size: 10, stock: 22 },
      { size: 11, stock: 18 },
    ],
    color: "White",
    rating: 4.5,
    numReviews: 110,
    countInStock: 100,
  },
  {
    name: "Nike Metcon 8",
    description: "Training shoes designed for cross-training and weightlifting.",
    price: 130,
    image: "https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?w=500",
    images: ["https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?w=500"],
    brand: "Nike",
    category: "training",
    sizes: [
      { size: 8, stock: 10 },
      { size: 9, stock: 15 },
      { size: 10, stock: 18 },
      { size: 11, stock: 12 },
      { size: 12, stock: 8 },
    ],
    color: "Black/Red",
    rating: 4.6,
    numReviews: 92,
    countInStock: 63,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("✅ Products seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();

