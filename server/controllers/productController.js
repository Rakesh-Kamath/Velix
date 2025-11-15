import Product from "../models/Product.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      size,
      sort,
      limit,
    } = req.query;

    // Build filter object
    const filter = {};

    // Keyword search (name or description)
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Brand filter
    if (brand) {
      filter.brand = { $regex: brand, $options: "i" };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Size availability filter
    if (size) {
      filter["sizes.size"] = Number(size);
      filter["sizes.stock"] = { $gt: 0 };
    }

    // Build sort object
    let sortOption = {};
    switch (sort) {
      case "price-low":
        sortOption = { price: 1 };
        break;
      case "price-high":
        sortOption = { price: -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "popularity":
        sortOption = { rating: -1, numReviews: -1 };
        break;
      case "name-asc":
        sortOption = { name: 1 };
        break;
      case "name-desc":
        sortOption = { name: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Execute query
    let query = Product.find(filter).sort(sortOption);
    if (limit) {
      query = query.limit(Number(limit));
    }

    const products = await query;

    // Filter by size availability if size is specified
    let filteredProducts = products;
    if (size) {
      filteredProducts = products.filter((product) => {
        const sizeObj = product.sizes.find(
          (s) => s.size === Number(size) && s.stock > 0
        );
        return sizeObj !== undefined;
      });
    }

    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get search suggestions/autocomplete
// @route   GET /api/products/search/suggestions
// @access  Public
export const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
      ],
    })
      .select("name brand")
      .limit(10);

    const suggestions = [
      ...new Set([
        ...products.map((p) => p.name),
        ...products.map((p) => p.brand),
      ]),
    ].slice(0, 10);

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get unique brands
// @route   GET /api/products/brands
// @access  Public
export const getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct("brand");
    res.json(brands.sort());
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

