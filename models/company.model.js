const mongoose = require("mongoose");


const companySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  name: {
    type: String, 
    required: true,
  },
  phone: String,
  email: String,
  gst: String,
  pan: String,
  invoiceLogo: String,
  signature: String,
  address: String,
  country: String,
  state: String,
  city: String,
  pin: String,
  poInitial: String,
  purchaseInvoiceInitial: String,
  purchaseInvoiceNextCount: String,
  invoiceInitial: String,
  proformaInitial: String,
  poNextCount: String,
  invoiceNextCount: String,
  proformaNextCount: String,
  quotationInitial: String,
  creditNoteInitial: String,
  deliverChalanInitial: String,
  salesReturnInitial: String,
  quotationCount: String,
  creditNoteCount: String,
  salesReturnCount: String,
  deliveryChalanCount: String,
  salesReminder: String,
  purchaseReminder: String,
  logoFileName: String,
  signatureFileName: String,

}, {timestamps: true});

module.exports = mongoose.model("Company", companySchema);