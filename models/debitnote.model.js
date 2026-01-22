const mongoose = require("mongoose");


const itemSchema = new mongoose.Schema({
  itemId: String,
  itemName: String,
  description: String,
  hsn: String,
  qun: String,
  selectedUnit: String,
  unit: {
    type: Array
  },
  price: String,
  discountPerAmount: String,
  discountPerPercentage: String,
  tax: String,
  taxAmount: String,
  amount: String,
}, { _id: false });

const additionalChargeSchema = new mongoose.Schema({
  particular: String,
  amount: String
}, { _id: false });

const debitNoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },
  party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'party',
    required: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
  },
  debitNoteNumber: String,
  debitNoteDate: Date,
  purchaseInvoice: String,
  items: [itemSchema],
  discountType: String,
  discountAmount: String,
  discountPercentage: String,
  additionalCharge: [additionalChargeSchema],
  note: String,
  terms: String,
  isDel: {
    type: Boolean,
    default: false
  },
  isTrash: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("debitnote", debitNoteSchema);
