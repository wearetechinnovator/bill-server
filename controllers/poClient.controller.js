const { getId } = require("../helper/getIdFromToken");
const companyModel = require("../models/company.model");
const poClientModel = require("../models/poClient.model");
const userModel = require("../models/user.model");
const partyModel = require("../models/party.model");


class PoClientController {
    static async add(req, res) {
        const {
            token, party, poNumber, driveLink, poDate, items,
        } = req.body;

        if ([token, party, poNumber, poDate, items, driveLink].some(field => !field || field === '')) {
            return res.status(400).json({ err: 'fill the blank' });
        }

        try {
            const getInfo = await getId(token);
            const getUserData = await userModel.findOne({ _id: getInfo._id });

            const isExist = await poClientModel.findOne({
                companyId: getUserData.activeCompany, poNumber: poNumber,
                isDel: false
            });
            if (isExist) {
                return res.status(500).json({ err: 'PO already exist' })
            }

            const insert = await poClientModel.create({
                userId: getUserData._id, companyId: getUserData.activeCompany,
                party, poNumber, driveLink, poDate, items,
            });

            if (!insert) {
                return res.status(500).json({ err: 'PO creation failed' });
            }

            return res.status(200).json(insert);

        } catch (err) {
            console.log(err);
            return res.status(500).json({ err: 'Something went wrong' });
        }
    }

    static async update(req, res) {
        const {
            token, party, poNumber, driveLink, poDate, items, id
        } = req.body;

        if ([token, party, poNumber, poDate, items, driveLink].some(field => !field || field === '')) {
            return res.status(400).json({ err: 'fill the blank' });
        }

        try {
            const getInfo = await getId(token);
            const getUserData = await userModel.findOne({ _id: getInfo._id });
            if (!getUserData) {
                return res.status(500).json({ err: 'PO already exist' })
            }

            const updatePO = await poClientModel.updateOne({ _id: id }, {
                $set: {
                    party, poNumber, driveLink, poDate, items
                }
            })

            if (updatePO.modifiedCount === 0) {
                return res.status(500).json({ err: 'PO updation failed' });
            }

            return res.status(200).json({ msg: 'PO Update successfully' });

        } catch (err) {
            console.log(err);
            return res.status(500).json({ err: 'Something went wrong' });
        }
    }

    static async get(req, res) {
        const { token, id, all, startDate, endDate, billNo, partyName } = req.body;
        const { page, limit } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        if (!token) {
            return res.status(500).json({ 'err': 'Invalid user', get: false });
        }

        try {
            const getInfo = await getId(token);
            const getUser = await userModel.findOne({ _id: getInfo._id });
            const role = getUser.role;

            const totalData = await poClientModel.countDocuments({
                ...(role === 'sales' && { userId: getUser._id }),
                companyId: getUser.activeCompany,
                isDel: false
            });
            let getData;
            let filter = {};


            if (startDate && endDate) {
                filter.poDate = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
            if (billNo) {
                filter.poNumber = billNo
            }
            if (partyName) {
                const parties = await partyModel.find({
                    name: new RegExp(`${partyName}`, "i")
                }).select("_id");

                const partyIds = parties.map(p => p._id);
                filter.party = { $in: partyIds };
            }

            if (id) {
                getData = await poClientModel.findOne({
                    companyId: getUser.activeCompany,
                    _id: id,
                    isDel: false
                }).populate("party");
            }
            else if (all) {
                getData = await poClientModel.find({
                    ...(role === 'sales' && { userId: getUser._id }),
                    companyId: getUser.activeCompany,
                    isDel: false,
                    ...filter
                }).skip(skip).limit(limit).sort({ _id: -1 }).populate('party');
            }
            else {
                getData = await poClientModel.find({
                    companyId: getUser.activeCompany,
                    ...(role === 'sales' && { userId: getUser._id }),
                    isDel: false,
                    ...filter
                }).skip(skip).limit(limit).sort({ _id: -1 }).populate('party');
            }


            if (!getData) {
                return res.status(500).json({ 'err': 'No quotation availble', get: false });
            }

            return res.status(200).json({ data: getData, totalData: totalData });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ 'err': 'Something went wrong', get: false });
        }
    }

    static async remove(req, res) {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ err: "No valid IDs provided", remove: false });
        }

        try {
            const removeParty = await poClientModel.updateMany(
                { _id: { $in: ids } },
                { $set: { isDel: true } }
            );

            if (removeParty.matchedCount === 0) {
                return res.status(404).json({ err: "No matching parties found", remove: false });
            }

            return res.status(200).json({
                msg: "Quotation deleted successfully",
                modifiedCount: removeParty.modifiedCount,
            });

        } catch (error) {
            return res.status(500).json({ err: "Something went wrong", remove: false });
        }
    }

    // =========[Used when Sales invoice create]=======
    // ================================================
    static async updateItemCount(poId, itemsArr) {
        if ([poId, itemsArr].some((f) => !f || f === "")) {
            throw new Error('PO id, ItemId, qty required');
            return;
        }

        if (itemsArr.length < 1) {
            throw new Error('There are not items for create.');
            return;
        }

        const poData = await poClientModel.findOne({ _id: poId });
        if (!poData) {
            throw new Error("Client PO not found");
            return;
        }

        itemsArr.forEach((i, _) => {
            const item = poData.items.find((p) => p.itemId.toString() === i.itemId.toString());
            if (item) {
                item.invoice_qun += Number(i.qun);
                item.qun -= Number(i.qun);
            }
        })


        const updatePO = await poClientModel.updateOne({ _id: poId }, {
            $set: {
                items: poData.items
            }
        })

        if (updatePO.modifiedCount === 0) {
            return false;
        }

        return true;
    }
}


module.exports = PoClientController