import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";

dotenv.config({ path: new URL("../.env", import.meta.url).pathname });

const normalizeSizeEntry = (s, fallback) => {
  if (s == null) return null;
  if (typeof s === "string" || typeof s === "number") {
    return { size: String(s), stock: Number(fallback || 0) };
  }
  if (s.size !== undefined) {
    return { size: String(s.size), stock: Number(s.stock ?? fallback ?? 0) };
  }
  // malformed object like { '0': '8', stock: 0 }
  const vals = Object.values(s);
  let sizeVal = null;
  for (const v of vals) {
    if (typeof v === "number" || (typeof v === "string" && /^\d+(?:\.\d+)?$/.test(v))) {
      sizeVal = v;
      break;
    }
  }
  const stockVal = s.stock ?? s.count ?? fallback ?? 0;
  return { size: sizeVal != null ? String(sizeVal) : "", stock: Number(stockVal) };
};

const main = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not set in server/.env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const products = await Product.find({});
  let modified = 0;

  for (const p of products) {
    const fallback = p.countInStock ?? 0;
    const rawSizes = Array.isArray(p.sizes) ? p.sizes : [];
    const normSizes = rawSizes.map((s) => normalizeSizeEntry(s, fallback)).filter(Boolean);

    // If sizes exist but all stock are 0 and fallback > 0, assign fallback to first size
    const totalSizeStock = normSizes.reduce((sum, s) => sum + (s.stock || 0), 0);
    if (normSizes.length > 0 && totalSizeStock === 0 && fallback > 0) {
      normSizes[0].stock = fallback;
    }

    // If no sizes and fallback > 0, create a default size entry so frontend can pick up availability
    if (normSizes.length === 0 && fallback > 0) {
      normSizes.push({ size: "Default", stock: fallback });
    }

    // Normalize images
    let images = [];
    if (Array.isArray(p.images) && p.images.length > 0) {
      images = p.images;
    } else if (p.image) {
      images = [p.image];
    }

    let changed = false;
    if (JSON.stringify(p.sizes) !== JSON.stringify(normSizes)) {
      p.sizes = normSizes;
      changed = true;
    }
    if (JSON.stringify(p.images) !== JSON.stringify(images)) {
      p.images = images;
      changed = true;
    }

    if (changed) {
      await p.save();
      modified++;
      console.log(`Updated product ${p._id}`);
    }
  }

  console.log(`Normalization complete. Modified ${modified} product(s).`);
  await mongoose.disconnect();
  process.exit(0);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
