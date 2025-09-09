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

const salesInvoiceSchema = new mongoose.Schema({
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
  salesInvoiceNumber: {
    type: String,
    required: true
  },
  invoiceDate: {
    type: Date,
    required: true
  },
  DueDate: {
    type: Date,
  },
  items: {
    type: [itemSchema],
    required: true
  },
  discountType: {
    type: String,
  },
  discountAmount: {
    type: String,
  },
  discountPercentage: {
    type: String,
  },
  additionalCharge: {
    type: [additionalChargeSchema],
  },
  paymentStatus: {
    type: String,
    enumm: ['0', '1', '2'], // 0=notPaid | 1=paid | 2=partialPaid;
    default: '0'
  },
  dueAmount: {
    type: String
  },
  paymentAccount: {
    type: String
  },
  note: {
    type: String,
  },
  terms: {
    type: String,
  },
  isDel: {
    type: Boolean,
    default: false
  },
  isTrash: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("salesinvoice", salesInvoiceSchema);
