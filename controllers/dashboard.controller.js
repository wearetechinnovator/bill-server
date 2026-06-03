const enquiryModel = require("../models/enquiry.model");
const salesInvoiceModel = require("../models/salesinvoice.model");
const quotationModel = require("../models/quotation.model");
const proformaModel = require("../models/proforma.model");
const { getId } = require("../helper/getIdFromToken");
const userModel = require("../models/user.model");
const { default: mongoose } = require("mongoose");



class DashboardController {
    static async noOfEnqAndTotalEnq(req, res) {
        const { token } = req.body;

        if (!token) {
            return res.status(500).json({ 'err': 'Invalid user' });
        }

        try {
            const getInfo = await getId(token);
            if (!getInfo) {
                return res.status(401).json({ err: 'invalid token' });
            }
            const getUser = await userModel.findOne({ _id: getInfo._id });
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);


            const totalNoOfQuotation = await enquiryModel.countDocuments({
                userId: getUser._id,
                companyId: new mongoose.Types.ObjectId(getUser.activeCompany),
                isDel: false
            })

            const todayNoOfQuotation = await enquiryModel.countDocuments({
                userId: getUser._id,
                companyId: new mongoose.Types.ObjectId(getUser.activeCompany),
                isDel: false,
                createdAt: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            })

            return res.status(200).json({
                total: totalNoOfQuotation,
                today: todayNoOfQuotation
            });
        } catch (error) {
            return res.status(500).json({ err: "Something went wrong" });
        }

    }

    static async noOfQutAndTotalQut(req, res) {
        const { token } = req.body;

        if (!token) {
            return res.status(500).json({ 'err': 'Invalid user' });
        }

        try {
            const getInfo = await getId(token);
            if (!getInfo) {
                return res.status(401).json({ err: 'invalid token' });
            }
            const getUser = await userModel.findOne({ _id: getInfo._id });
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);


            const totalNoOfQuotation = await quotationModel.countDocuments({
                userId: getUser._id,
                companyId: new mongoose.Types.ObjectId(getUser.activeCompany),
                isDel: false
            })

            const todayNoOfQuotation = await quotationModel.countDocuments({
                userId: getUser._id,
                companyId: new mongoose.Types.ObjectId(getUser.activeCompany),
                isDel: false,
                estimateDate: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            })

            return res.status(200).json({
                total: totalNoOfQuotation,
                today: todayNoOfQuotation
            });
        } catch (error) {
            return res.status(500).json({ err: "Something went wrong" });
        }

    }

    static async noOfSalesAndTotalSales(req, res) {
        const { token } = req.body;

        if (!token) {
            return res.status(500).json({ 'err': 'Invalid user' });
        }

        try {
            const getInfo = await getId(token);
            if (!getInfo) {
                return res.status(401).json({ err: 'invalid token' });
            }
            const getUser = await userModel.findOne({ _id: getInfo._id });
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);


            const totalNoOfSales = await salesInvoiceModel.countDocuments({
                userId: getUser._id,
                companyId: new mongoose.Types.ObjectId(getUser.activeCompany),
                isDel: false
            })

            const todayNoOfSales = await salesInvoiceModel.countDocuments({
                userId: getUser._id,
                companyId: new mongoose.Types.ObjectId(getUser.activeCompany),
                isDel: false,
                invoiceDate: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            })

            return res.status(200).json({
                total: totalNoOfSales,
                today: todayNoOfSales
            });
        } catch (error) {
            return res.status(500).json({ err: "Something went wrong" });
        }
    }

    static async noOfProformaAndTotalProforma(req, res) {
        const { token } = req.body;

        if (!token) {
            return res.status(500).json({ 'err': 'Invalid user' });
        }

        try {
            const getInfo = await getId(token);
            if (!getInfo) {
                return res.status(401).json({ err: 'invalid token' });
            }
            const getUser = await userModel.findOne({ _id: getInfo._id });
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);


            const totalNoOfProforma = await proformaModel.countDocuments({
                userId: getUser._id,
                companyId: new mongoose.Types.ObjectId(getUser.activeCompany),
                isDel: false
            })

            const todayNoOfProforma = await proformaModel.countDocuments({
                userId: getUser._id,
                companyId: new mongoose.Types.ObjectId(getUser.activeCompany),
                isDel: false,
                estimateDate: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            })

            return res.status(200).json({
                total: totalNoOfProforma,
                today: todayNoOfProforma
            });
        } catch (error) {
            return res.status(500).json({ err: "Something went wrong" });
        }
    }
}


module.exports = DashboardController;