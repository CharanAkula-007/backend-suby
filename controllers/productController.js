const Firm = require("../models/Firm");
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory where images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
  try {
    const { productName, price, category, description } = req.body;
    const firmId = req.params.firmId; // Assuming firmId is passed as a URL parameter
    console.log("Firm ID:", firmId);
    const image = req.file ? req.file.path : null; // Assuming you're using multer for file uploads

    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ message: "Firm not found" });
    }

    const product = new Product({
      productName,
      price,
      category,
      description,
      image,
      firm: firm._id,
    });
    console.log("Product data:", product);
    // Save the product to the database
    const savedProduct = await product.save();
    firm.products.push(savedProduct);
    await firm.save();

    res
      .status(201)
      .json({ message: "Product added successfully", product: savedProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getProductsByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId; // Assuming firmId is passed as a URL parameter
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ message: "Firm not found" });
    }
    const products = await Product.find({ firm: firmId });
    res.status(200).json(products);
    console.log("Products retrieved successfully for firm:", firm.firmName);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addProduct: [upload.single("image"), addProduct],
  getProductsByFirm,
};
