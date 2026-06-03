const { getId } = require("../helper/getIdFromToken");
const salesModel = require("../models/salesinvoice.model");
const paymentInModel = require('../models/paymentin.model');
const paymentOutModel = require('../models/paymentout.model');
const transanctionModel = require("../models/transaction.model");
const userModel = require("../models/user.model");




class Report {
    static async dayBook(req, res) {
        const { startDate, endDate } = req.body();

        const getInfo = await getId(token);
        const getUser = await userModel.findOne({ _id: getInfo._id });
        if (!getUser) {
            return res.status(500).json({ err: "Invalid user" });
        }

        try {
            // For income;
            const payIn = await paymentInModel.find({
                companyId: getUser.activeCompany,
                isDel: false,
                paymentInDate: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            });

            // For Expenses;
            const payOut = await paymentOutModel.find({
                companyId: getUser.activeCompany,
                isDel: false,
                paymentOutDate: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            });

            const expensesTransation = await transanctionModel.find({
                companyId: getUser.activeCompany,
                isDel: false,
                transactionDate: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            });


        } catch (err) {
            console.log(err);
            return res.status(500).json({ err: "Something went wrong" }); c
        }

    }
}


module.exports = Report;