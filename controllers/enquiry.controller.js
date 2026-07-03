const enquiryModel = require("../models/enquiry.model");
const userModel = require("../models/user.model");
const { getId } = require("../helper/getIdFromToken");
const { default: mongoose } = require("mongoose");


class EnquiryController {
    static async getEnquiryNo(req, res) {
        const { token } = req.body;

        if (!token) {
            return res.json({ err: 'require fields are empty' });
        }

        try {
            const getInfo = await getId(token);
            const getUserData = await userModel.findOne({ _id: getInfo._id });

            if (!getUserData) {
                return res.status(404).json({ err: "user not found" })
            }

            const count = await enquiryModel.findOne({
                companyId: getUserData.activeCompany,
                isDel: false
            }).sort({ createdAt: -1 });


            const n = count?.enqNo.split("-")[1];
            const nextNo = (Number(n) || 0) + 1;
            return res.status(200).json({ count: `ENQ-${nextNo}` });
        } catch (err) {
            return res.status(500).json({ 'err': 'Something went wrong' });
        }

    }

    static async addEnquiry(req, res) {
        const { token, party, items, deliveryDate, contactPerson, enqNo, message,
            enquirySource, enquiryStatus, compititor, followUp, followUpDate, orderProbality,
            expectedOrderDate,dateReceived, industry
        } = req.body;

        if ([party, items, enqNo]
            .some((field) => !field || field === "")) {
            return res.json({ err: 'require fields are empty', create: false });
        }

        try {
            const getInfo = await getId(token);
            const getUserData = await userModel.findOne({ _id: getInfo._id });

            if (!getUserData) {
                return res.status(404).json({ err: "user not found" })
            }


            // Check existance
            const isExist = await enquiryModel.findOne({ enqNo });
            if (isExist) {
                return res.status(404).json({ err: "This enquiry already exist" })
            }

            const insert = await enquiryModel.create({
                userId: getUserData._id, companyId: getUserData.activeCompany,
                party, items, deliveryDate, contactPerson, enqNo, message,
                enquirySource, enquiryStatus, compititor, followUp, followUpDate, orderProbality,
                expectedOrderDate, dateReceived, industry
            })

            if (!insert) {
                return res.status(500).json({ err: "Enquiry insertion failed" });
            }

            return res.status(201).json({
                data: insert,
                msg: "Enquiry add successfully"
            })


        } catch (err) {
            console.log(err);
            return res.status(500).json({ 'err': 'Something went wrong' });
        }
    }

    static async updateEnquiry(req, res) {
        const { token, id, party, items, deliveryDate, contactPerson, enqNo, message,
            enquirySource, enquiryStatus, compititor, followUp, followUpDate, orderProbality,
            expectedOrderDate, dateReceived, industry
        } = req.body;

        if ([token, party, items, contactPerson, enqNo, id]
            .some((field) => !field || field === "")) {
            return res.json({ err: 'require fields are empty' });
        }

        try {
            const getInfo = await getId(token);
            const getUserData = await userModel.findOne({ _id: getInfo._id });

            if (!getUserData) {
                return res.status(404).json({ err: "user not found" })
            }


            const update = await enquiryModel.updateOne({ _id: id }, {
                $set: {
                    party, items, deliveryDate, contactPerson,
                    enqNo, message, enquirySource, enquiryStatus, compititor, followUp, followUpDate,
                    orderProbality, expectedOrderDate, dateReceived, industry
                }
            })

            if (update.modifiedCount === 0) {
                return res.status(500).json({ err: "Enquiry not update" });
            }

            return res.status(200).json({ msg: "Enquiry update successfully" })

        } catch (err) {
            console.log(err);
            return res.status(500).json({ 'err': 'Something went wrong', create: false });
        }
    }

    static async deleteEnquiry(req, res) {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ err: "No valid IDs provided", remove: false });
        }

        try {
            const removeData = await enquiryModel.updateMany({ _id: { $in: ids } }, {
                $set: { isDel: true }
            });

            if (removeData.matchedCount === 0) {
                return res.status(404).json({ err: "No matching category found", remove: false });
            }

            return res.status(200).json({
                msg: "Enquries successfully delete",
                modifiedCount: removeData.modifiedCount,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ err: "Something went wrong", remove: false });
        }
    }

    static async getSingleEnquiry(req, res) {
        const { token, id } = req.body;

        if ([token, id].some((field) => !field || field === "")) {
            return res.json({ err: 'require fields are empty' });
        }

        try {
            const getInfo = await getId(token);
            const getUserData = await userModel.findOne({ _id: getInfo._id });

            if (!getUserData) {
                return res.status(404).json({ err: "user not found" });
            }

            const enquiry = await enquiryModel.findOne({
                _id: id,
                companyId: getUserData.activeCompany,
                isDel: false
            }).populate("party").populate('contactPerson').populate('items.item');

            if (!enquiry) {
                return res.status(404).json({ err: "Eqnuiry not found" });
            }

            return res.status(200).json({ data: enquiry });

        } catch (err) {
            console.log(err);
            return res.status(500).json({ err: 'Something went wrong' });
        }
    }

    static async getAllEnquiry(req, res) {
        const { token, id, all, searchText } = req.body;
        const { page, limit } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        if (!token) {
            return res.status(500).json({ 'err': 'Invalid user', get: false });
        }

        try {
            const getInfo = await getId(token);
            const getUser = await userModel.findOne({ _id: getInfo._id });
            const role = getUser.role;

            const totalData = await enquiryModel.countDocuments({
                ...(role === 'sales' && { userId: getUser._id }),
                companyId: getUser.activeCompany,
                isDel: false
            });

            let getData;
            let filter = {};
            if (searchText) {
                filter.accountName = { $regex: searchText.trim(), $options: "i" }
            }


            if (id) {
                getData = await enquiryModel.findOne({
                    ...(role === 'sales' && { userId: getUser._id }),
                    companyId: getUser.activeCompany,
                    _id: id,
                    isDel: false
                }).populate("party").populate('contactPerson').populate('items.item');
            }
            else if (all) {
                getData = await enquiryModel.find({
                    ...(role === 'sales' && { userId: getUser._id }),
                    companyId: getUser.activeCompany,
                    isDel: false
                }).populate("party").populate('contactPerson').populate('items.item')
            }
            else {
                getData = await enquiryModel.find({
                    ...(role === 'sales' && { userId: getUser._id }),
                    companyId: getUser.activeCompany,
                    isDel: false,
                    ...filter
                }).skip(skip).limit(limit).sort({ _id: -1 })
                    .populate("party").populate('contactPerson').populate('items.item');
            }

            if (!getData) {
                return res.status(500).json({ 'err': 'No Account availble', get: false });
            }

            return res.status(200).json({ data: getData, totalData: totalData });

        } catch (error) {
            return res.status(500).json({ 'err': 'Something went wrong', get: false });
        }
    }

}

module.exports = EnquiryController;