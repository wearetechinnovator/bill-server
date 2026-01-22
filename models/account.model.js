const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  title: String,
  holderName: String,
  accountNumber: String,
  ifscCode: String,
  bankName: String,
  openingBalance: Number,
  type: {
    type: String,
    enum: ['bank', 'cash', "cheque"],
    required: true,
  },
  details: String,
  isTrash: {
    type: Boolean,
    default: false,
  },
  isDel: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });


module.exports = mongoose.model("account", accountSchema);

