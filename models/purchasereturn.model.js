const mongoose = require("mongoose");


const itemSchema = new mongoose.Schema({
  itemId: String,
  itemName: String,
  description: String,
  hsn: String,
  qun: String,
  selectedUnit: String,
  unit: Array,
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

const purchaseReturnSchema = new mongoose.Schema({
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
  purchaseReturnNumber: String,
  returnDate: Date,
  items: [itemSchema],
  discountType: String,
  discountAmount: String,
  discountPercentage: String,
  additionalCharge: [additionalChargeSchema],
  paymentStatus: Boolean,
  paymentType: String,
  paymentAccount: String,
  paymentAmount: Number,
  finalAmount: Number,
  note: String,
  terms: String,
  isDel: {
    type: Boolean,
    default: false
  },
  isTrash: {
    type: Boolean,
    default: false
  },
  autoRoundOff: {
    type: Boolean,
    default: false
  },
  roundOffAmount: Number,
  roundOffType: {
    type: String,
    enum: ['0', '1'] // 1 =`add` | 0 =`reduce`
  }
}, { timestamps: true });

module.exports = mongoose.model("purchasereturn", purchaseReturnSchema);
