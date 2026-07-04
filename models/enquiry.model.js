const mongoose = require("mongoose");

const enquirySchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'party',
    required: true,
  },
  contactPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'party_contact',
    required: true,
  },
  items: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'item',
    }, qty: Number
  }],
  deliveryDate: Date,
  enqNo: String,
  message: String,
  enquirySource: String,
  enquiryStatus: {
    type: String,
    enum: ['open','close', 'followup','succeed'],
    default: 'open'
  },
  compititor: String,
  followUp: {
    type: String,
    enum: ['yes', 'no'],
    default: 'no'
  },
  followUpDate: Date,
  orderProbality: String,
  expectedOrderDate: Date,
  dateReceived: Date,
  industry: String,
  isDel: {
    type: Boolean,
    default: false,
  },
  isConverted: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model("enquiry", enquirySchema);