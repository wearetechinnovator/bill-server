const { default: mongoose } = require("mongoose");
const { getId } = require("../helper/getIdFromToken");
const darModel = require("../models/dar.model");
const darHistoryModel = require("../models/darHistory.model");
const userModel = require("../models/user.model");



// Daily report and daily report history method write here
class DarController {
    static async createDar(req, res) {
        const {
            // Dar Fields
            token, name, email, phone, designation, companyName,
            leadSource, city, industry, productInterested, priority, competitor,

            // Dar history fields;
            activityType, feedback, status, followUp, followDate
        } = req.body;


        if ([token, name, phone].some((f) => !f || f === "")) {
            return res.status(500).json({ err: 'required fields are empty' });
        }

        try {
            const getInfo = await getId(token);
            const getUserData = await userModel.findOne({ _id: getInfo._id });

            if (!getUserData) {
                return res.status(404).json({ err: "user not found" })
            }


            const darInsert = await darModel.create({
                userId: getUserData._id, companyId: getUserData.activeCompany,
                name, email, phone, designation, companyName,
                leadSource, city, industry, productInterested, priority, competitor,

                activityType, feedback, status, followUp, followUpDate: followDate
            })

            if (!darInsert) {
                return res.status(500).json({ err: 'Activity report not created' });
            }

            // Insert history;
            const historyInsert = await darHistoryModel.create({
                userId: getUserData._id, companyId: getUserData.activeCompany,
                darId: darInsert._id, activityType, feedback, status, followUp,
                followUpDate: followDate
            })

            if (!historyInsert) {
                await darModel.deleteOne({ _id: darInsert._id });
                return res.status(500).json({ err: 'Activity report not created' });
            }


            return res.status(201).json({
                data: darInsert,
                msg: "Activity report create successfully"
            });

        } catch (err) {
            console.log(err)
            return res.status(500).json({ 'err': 'Something went wrong' });
        }

    }

    static async getSingleDarWithHistory(req, res) {
        const { token, darId } = req.body;

        if ([token, darId].some((f) => !f || f === "")) {
            return res.status(500).json({ err: 'required fields are empty' });
        }

        try {
            const getInfo = await getId(token);
            const getUserData = await userModel.findOne({ _id: getInfo._id });

            if (!getUserData) {
                return res.status(404).json({ err: "User not found" })
            }

            const darData = await darModel.findOne({ _id: darId }).populate("userId");
            const historyData = await darHistoryModel.find({ darId }).sort({ _id: -1 });

            if (!darData) {
                return res.status(500).json({ err: "No Data found." });
            }

            return res.status(200).json({
                dar: darData,
                history: historyData
            });

        } catch (err) {
            console.log(err);
            return res.status(500).json({ 'err': 'Something went wrong' });
        }
    }

    static async getAllDar(req, res) {
        const {
            token, phone, status, doneBy,
            startDate, endDate, companyName,
            registerStartDate, registerEndDate
        } = req.body;
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);


        if (!token) {
            return res.status(500).json({ err: 'required fields are empty' });
        }

        try {
            const getInfo = await getId(token);
            const getUserData = await userModel.findOne({ _id: getInfo._id });
            const role = getUserData.role;

            if (!getUserData) {
                return res.status(404).json({ err: "User not found" })
            }


            const query = {
                ...(role === 'sales' && { userId: getUserData._id }),
                companyId: getUserData.activeCompany,
            };


            
            if (status)
                query.status = status;

            if (doneBy)
                query.userId = new mongoose.Types.ObjectId(doneBy);

            if (phone)
                query.phone = phone;

            if (startDate && endDate) {
                query.followUpDate = {
                    $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
                    $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
                };
            }

            if (registerStartDate && registerEndDate) {
                query.createdAt = {
                    $gte: new Date(new Date(registerStartDate).setHours(0, 0, 0, 0)),
                    $lte: new Date(new Date(registerEndDate).setHours(23, 59, 59, 999))
                };
            }


            const data = await darModel.find(query)
                .sort({ _id: -1 })
                .populate('userId');

            const totalData = await darModel.countDocuments(query);

            return res.status(200).json({ data, totalData });

        } catch (err) {
            return res.status(500).json({ 'err': 'Something went wrong' });
        }
    }

    static async addDarHistory(req, res) {
        const { token, darId, activityType, feedback, status, followUp, followDate } = req.body;

        if (!token || !darId) {
            return res.status(500).json({ err: 'required fields are empty' });
        }

        try {
            const getInfo = await getId(token);
            const getUserData = await userModel.findOne({ _id: getInfo._id });

            if (!getUserData) {
                return res.status(404).json({ err: "User not found" })
            }

            // Insert History;
            const historyInsert = await darHistoryModel.create({
                userId: getUserData._id, companyId: getUserData.activeCompany,
                darId, activityType, feedback, status, followUp, followUpDate: followDate
            })


            if (!historyInsert) {
                return res.status(500).json({ err: 'Activity report not created' });
            }

            // Add latest history in Dar;
            const latestHistoryInsert = await darModel.updateOne({ _id: darId }, {
                $set: {
                    activityType, feedback, status, followUp, followUpDate: followDate
                }
            });

            if (latestHistoryInsert.modifiedCount === 0) {
                await darHistoryModel.deleteOne({ _id: historyInsert._id });

                return res.status(500).json({ err: 'Activity report not created' });
            }

            return res.status(201).json({
                data: historyInsert,
                msg: "Activity report create successfully"
            });

        } catch (err) {
            console.log(err)
            return res.status(500).json({ 'err': 'Something went wrong' });
        }
    }

    static async getFollowUpNotification(req, res) {
        const { token } = req.body;

        if (!token) {
            return res.status(500).json({ err: 'required fields are empty' });
        }

        try {
            const getInfo = await getId(token);
            const getUserData = await userModel.findOne({ _id: getInfo._id });
            const role = getUserData.role;

            if (!getUserData) {
                return res.status(404).json({ err: "User not found" })
            }

            const data = await darModel.find({
                ...(role === 'sales' && { userId: getUserData._id }),
                companyId: getUserData.activeCompany,
                followUp: 'yes',
                followUpDate: {
                    $lte: new Date()
                },
            })

            return res.status(200).json({ data });

        } catch (err) {
            return res.status(500).json({ 'err': 'Something went wrong' });
        }
    }

}

module.exports = DarController;
