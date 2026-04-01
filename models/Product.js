const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    brand: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    frameType: { type: String, default: 'Full Rim' },
    lensType: { type: String, default: 'Single Vision' },
    gender: { type: String, default: 'Unisex' },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
