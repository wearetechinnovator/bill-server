const mongoose = require("mongoose");

const roleUser = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    name: String,
    phone: Number,
    email: String,
    password: String,
    profile: String,
    isDisable: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });


module.exports = mongoose.model("role_user", roleUser);