const mongoose = require("mongoose");


// Daily Activity Report History (DAR);
const darHistorySchema = new mongoose.Schema({
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
    darId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dar'
    },
    activityType: {
        type: String,
        enum: ['call', 'message', 'email', 'whatsapp']
    },
    feedback: String,
    status: {
        type: String,
        enum: ['warm', 'hot', 'cold', 'dead']
    },
    followUp: {
        type: String,
        enum: ['yes', 'no'],
        default: 'no'
    },
    followUpDate: Date
}, { timestamps: true });

const darHistoryModel = new mongoose.model("dar_history", darHistorySchema);
module.exports = darHistoryModel;