const { getId } = require("../helper/getIdFromToken");
const salesModel = require("../models/salesinvoice.model");
const paymentInModel = require('../models/paymentin.model');
const paymentOutModel = require('../models/paymentout.model');
const transanctionModel = require("../models/transaction.model");
const userModel = require("../models/user.model");




class Report {
    static async dayBook(req, res) {
        const { startDate, endDate, token } = req.body;

        try {
            const getInfo = await getId(token);
            const getUser = await userModel.findOne({ _id: getInfo._id });

            if (!getUser) {
                return res.status(500).json({ err: "Invalid user" });
            }
            // For income;
            const payIn = await paymentInModel.find({
                companyId: getUser.activeCompany,
                isDel: false,
                paymentInDate: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }).populate("party");
            const incomeTransation = await transanctionModel.find({
                companyId: getUser.activeCompany,
                transactionType: 'income',
                isDel: false,
                transactionDate: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }).populate('category');


            // For Expenses;
            const payOut = await paymentOutModel.find({
                companyId: getUser.activeCompany,
                isDel: false,
                paymentOutDate: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }).populate("party");
            const expensesTransation = await transanctionModel.find({
                companyId: getUser.activeCompany,
                transactionType: 'expense',
                isDel: false,
                transactionDate: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }).populate('category');


            return res.status(200).json({
                income: { payIn, incomeTransation },
                expense: { payOut, expensesTransation }
            })

        } catch (err) {
            console.log(err);
            return res.status(500).json({ err: "Something went wrong" }); c
        }

    }
}


module.exports = Report;