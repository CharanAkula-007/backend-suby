const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true,
  },
  category: {
    type: [
        {
            type: String,
            enum: ['Veg', 'Non-Veg', 'Vegan'],
            required: true
        }
    ]
  },
  image: {
    type: String,
  },
  bestSeller: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: true,
    
  },
  firm: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm',
    }
  ]

});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
