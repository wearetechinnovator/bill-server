const mongoose = require("mongoose");


// Daily Activity Report (DAR) (in UI name > Cold Calling Tracking);
// ----------------------------------------------------------------
const darSchema = new mongoose.Schema({
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
  name: String,
  email: String,
  phone: Number,
  designation: String,
  companyName: String,
  leadSource: String,
  city: String,
  industry: String,
  productInterested: String,
  priority: String,
  competitor: String
}, {timestamps: true});

const darModel = new mongoose.model("dar", darSchema);
module.exports = darModel;