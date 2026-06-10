const mongoose = require("mongoose");


const itemSchema = new mongoose.Schema({
  itemId: String,
  itemName: String,
  description: String,
  hsn: String,
  qun: String,
  selectedUnit: String,
  unit: Array,
  price: Number,
  discountPerAmount: Number,
  discountPerPercentage: String,
  tax: String,
  taxAmount: Number,
  amount: Number,
}, { _id: false });

const poClientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    requiredd: true,
    index: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    requiredd: true
  },
  party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'party',
    requiredd: true
  },
  poNumber: String,
  poDate: Date,
  driveLink: String,
  items: {
    type: [itemSchema],
  },
  isDel: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

module.exports = mongoose.model("po_client", poClientSchema);
