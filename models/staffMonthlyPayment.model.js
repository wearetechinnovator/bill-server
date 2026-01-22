const mongoose = require("mongoose");


const staffMonthlyPaymentSchema = new mongoose.Schema({
    staffId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff'
    },
    month: Number,
    year: Number,
    amount: Number,
    payAmount: Number,
    paymentStatus: {
        type: String,
        enum: ['0', '1', '2'], // 0=`Not pay` | 1=`Full paid` | 2=`Partial paid`
        index: true
    },
}, {timestamps: true})

const staffMonthlyPaymentModel = new mongoose.model("staff_monthly_payment", staffMonthlyPaymentSchema);
module.exports = staffMonthlyPaymentModel;
