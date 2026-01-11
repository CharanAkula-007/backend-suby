const Vendor = require("../models/Vendor");
const Firm = require("../models/Firm");
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

const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body;
    const vendorId = req.vendorId; // Assuming req.vendor is set by verifyToken middleware
    //console.log('Vendor ID:', vendorId);
    const image = req.file ? req.file.path : null; // Assuming you're using multer for file uploads
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found in db" });
    }

    console.log("Vendor found:", vendor);
    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id,
    });

    console.log("Firm data:", firm);
    // Save the firm to the database
    const savedFirm = await firm.save();
    const firmId = savedFirm._id;
    console.log("Firm saved:", savedFirm);
    vendor.firm.push(savedFirm);
    await vendor.save();

    res.status(201).json({ message: "Firm added successfully", firmId });
    console.log("Firm added successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = { addFirm, upload }; // 'image' is the field name in the form data
