const staffPaymentModel = require("../models/staffPayment.model");
const { getId } = require('../helper/getIdFromToken');
const userModel = require('../models/user.model');
const transactionModel = require('../models/transaction.model');
const transactionCategoryModal = require('../models/transactionCategory.modal');


// CONSTANTS;
const STAFF_SALARY_TRANSACTION_CATEGORY = "Employee Salary & Advance";
const EXPENSE = "expense";
const LOAN = "loan";
const LOAN_RECEIVED = 'loan_received';

const add = async (req, res) => {
    const { token, staffId, paymentType, paymentDate, paymentAmount, paymentRemark,
        paymentMode, paymentAccount, update, id
    } = req.body;

    if ([token, staffId, paymentType, paymentDate, paymentMode, paymentAmount].some((field => !field || field === ""))) {
        return res.status(500).json({ err: 'required fields are empty' });
    }

    if (paymentMode !== "cash" && !paymentAccount) {
        return res.status(500).json({ err: 'Please provide payment account' });
    }


    try {
        const getInfo = await getId(token);
        const getUserData = await userModel.findOne({ _id: getInfo._id });

        // Update Section
        if (update && id) {
            const update = await staffPaymentModel.updateOne({ _id: id }, {
                $set: {
                    staffId, paymentType, paymentDate, paymentAmount,
                    paymentMode, paymentAccount, paymentRemark
                }
            })

            // ::Update Expenses::
            if (paymentType !== LOAN && paymentType !== LOAN_RECEIVED) {
                // Get Transactionid
                const staffPayment = await staffPaymentModel.findOne({ _id: id });

                // Update Transaction
                await transactionModel.updateOne({ _id: staffPayment.transactionId }, {
                    $set: {
                        transactionDate: paymentDate, paymentMode: paymentMode,
                        account: paymentAccount, amount: paymentAmount, note: paymentRemark,
                    }
                })
            }

            if (update.modifiedCount === 0) {
                return res.status(500).json({ err: 'Staff Payment update failed', update: false })
            }

            return res.status(200).json(update)

        } // Update close here;


        /**
         * 1. Check Transaction Category exist or not, if not create then first create category
         * 2. Then Create Expanses
         * 3. Transaction will be not create if payment type is `Loan` and `Loan Received`;
         */
        let getExpCategory;
        let addTransaction;
        if (paymentType !== LOAN && paymentType !== LOAN_RECEIVED) {

            getExpCategory = await transactionCategoryModal.findOne({
                userId: getUserData._id, companyId: getUserData.activeCompany,
                categoryName: STAFF_SALARY_TRANSACTION_CATEGORY
            })

            if (!getExpCategory) {
                getExpCategory = await transactionCategoryModal.create({
                    userId: getUserData._id, companyId: getUserData.activeCompany,
                    categoryName: STAFF_SALARY_TRANSACTION_CATEGORY
                })
            }

            // Get last record for transaction number;
            const transaction = await transactionModel.findOne({
                userId: getUserData._id, companyId: getUserData.activeCompany,
            }).sort({ _id: -1 });

            // Expanses Create
            addTransaction = await transactionModel.create({
                userId: getUserData._id, companyId: getUserData.activeCompany,
                transactionType: EXPENSE, transactionNumber: Number(transaction?.transactionNumber || 0) + 1,
                transactionDate: paymentDate, paymentMode: paymentMode,
                account: paymentAccount, amount: paymentAmount, note: paymentRemark,
                category: getExpCategory._id
            })
        }
        // ========================[Transaction Add close]=====================


        // Insert Staff Payment
        const insert = await staffPaymentModel.create({
            userId: getUserData._id, companyId: getUserData.activeCompany,
            staffId, paymentType, paymentDate, paymentAmount,
            paymentMode, paymentAccount, paymentRemark,
            transactionId: addTransaction?._id || ""
        });

        if (!insert) {
            if (paymentType !== LOAN && paymentType !== LOAN_RECEIVED)
                await transactionModel.deleteOne({ _id: addTransaction?._id });

            return res.status(500).json({ err: 'Staff Payment failed', create: false });
        }

        return res.status(200).json(insert);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 'err': 'Something went wrong', create: false });
    }

}


const get = async (req, res) => {
    const { token, id, startDate, endDate, paymentType, staffId } = req.body;

    if (!token) {
        return res.status(500).json({ 'err': 'Invalid user', get: false });
    }

    try {
        const getInfo = await getId(token);
        const getUser = await userModel.findOne({ _id: getInfo._id });

        let getData;
        let filter = {};
        if (startDate && endDate) {
            filter.paymentDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }
        if (paymentType) {
            if (paymentType !== LOAN)
                filter.paymentType = paymentType;
            else
                filter.$or = [
                    { paymentType: LOAN },
                    { paymentType: LOAN_RECEIVED }
                ];
        }



        if (id) {
            getData = await staffPaymentModel.findOne({
                companyId: getUser.activeCompany,
                _id: id,
                // staffId: staffId,
                isDel: false
            }).populate("staffId");
        }
        else {
            getData = await staffPaymentModel.find({
                companyId: getUser.activeCompany,
                staffId: staffId,
                ...filter,
                isDel: false,
            }).populate("staffId");
        }

        if (!getData) {
            return res.status(500).json({ 'err': 'No Payments availble', get: false });
        }

        return res.status(200).json({ data: getData });

    } catch (error) {
        return res.status(500).json({ 'err': 'Something went wrong', get: false });
    }

}


const remove = async (req, res) => {
    /**
     * Single Id asbe kintu agger theke copy korar jonno array hisabe kichu 
     * jaygay bebohar hoche r change korini
     */
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ err: "No valid IDs provided", remove: false });
    }

    try {
        const removeParty = await staffPaymentModel.updateMany(
            { _id: { $in: ids } },
            { $set: { isDel: true } }
        );

        // ::Remove Expenses::
        // Get Transactionid
        const staffPayment = await staffPaymentModel.findOne({ _id: ids[0] });

        // Update Transaction
        if (staffPayment.paymentType !== LOAN && staffPayment.paymentType !== LOAN_RECEIVED) {
            await transactionModel.updateOne({ _id: staffPayment.transactionId }, {
                $set: {
                    isDel: true
                }
            })
        }


        if (removeParty.matchedCount === 0) {
            return res.status(404).json({ err: "No matching staff payment found", remove: false });
        }

        return res.status(200).json({ msg: "Payment deleted successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ err: "Something went wrong", remove: false });
    }
};



module.exports = {
    add,
    get,
    remove
}
