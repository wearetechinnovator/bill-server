const { getId } = require('../helper/getIdFromToken');
const partyModel = require('../models/party.model');
const PartyLog = require('../models/partylog.model');
const salesinvoiceModel = require('../models/salesinvoice.model');
const purchaseInvoiceModel = require('../models/purchaseInvoice.model');
const userModel = require('../models/user.model');
const { default: mongoose } = require('mongoose');



const CUSTOMER = 'customer';
const SUPPLIER = 'supplier';
const BOTHPARTY = 'both';
// Add controller;
const add = async (req, res) => {
	const { token, name, type, contactNumber, billingAddress, shippingAddress, email,
		pan, gst, openingBalance, details, update, id, creditPeriod, creditLimit, dob, partyCategory
	} = req.body;

	if ([token, name, type, contactNumber, billingAddress]
		.some((field) => !field || field === "")) {
		return res.json({ err: 'require fields are empty', create: false });
	}

	try {
		const getInfo = await getId(token);
		const getUserData = await userModel.findOne({ _id: getInfo._id });

		const isPartyExist = await partyModel.findOne({
			userId: getInfo._id, companyId: getUserData.activeCompany, name, isDel: false
		});
		if (isPartyExist && !update) {
			return res.status(500).json({ err: 'Party alredy exist', create: false, isDel: false })
		}

		// update code.....
		if (update && id) {
			const update = await partyModel.updateOne({ _id: id }, {
				$set: {
					name, type, contactNumber, billingAddress, email,
					pan, gst, openingBalance, details,
					shippingAddress, pan, gst, openingBalance, details, partyCategory: partyCategory || null,
					shippingAddress, creditPeriod, creditLimit, dob

				}
			})

			if (!update) {
				return res.status(500).json({ err: 'Party update failed', update: false })
			}

			return res.status(200).json(update)

		} // Update close here;

		const insert = await partyModel.create({
			userId: getUserData._id, companyId: getUserData.activeCompany,
			name, type, contactNumber, billingAddress, email,
			pan, gst, openingBalance, details,
			shippingAddress, pan, gst, openingBalance, details, partyCategory: partyCategory || null,
			shippingAddress, creditPeriod, creditLimit, dob
		});

		if (!insert) {
			return res.status(500).json({ err: 'Party creation failed', create: false })
		}

		return res.status(200).json(insert);

	} catch (error) {
		console.log(error)
		return res.status(500).json({ 'err': 'Something went wrong', create: false });
	}

}


// Get Controller;
const get = async (req, res) => {
	const {
		token, id, all,
		search,
		searchText,
		partyType
	} = req.body;
	const { page, limit } = req.query;
	const skip = (parseInt(page) - 1) * parseInt(limit);

	if (!token) {
		return res.status(500).json({ 'err': 'Invalid user', get: false });
	}

	try {
		const getInfo = await getId(token);
		const getUser = await userModel.findOne({ _id: getInfo._id });
		const totalData = await partyModel.countDocuments({
			companyId: getUser.activeCompany,
			isDel: false
		});


		let getData;
		let filter = {};
		if (!search && searchText) {
			filter.name = { $regex: searchText.trim(), $options: "i" }
			filter.$or = [
				{ name: { $regex: searchText.trim(), $options: "i" } },
				{ contactNumber: { $regex: searchText.trim(), $options: "i" } }
			]
		}


		if (id) {
			getData = await partyModel.findOne({
				companyId: getUser.activeCompany,
				_id: id,
				isDel: false
			}).populate("partyCategory")
		}
		else if (all) {
			getData = await partyModel.find({
				companyId: getUser.activeCompany,
				isDel: false
			}).skip(skip).limit(limit).sort({ _id: -1 });
		}
		else if (search) {
			if (searchText.trim() !== "") {
				getData = await partyModel.find({
					name: { $regex: searchText.trim(), $options: "i" },
					companyId: getUser.activeCompany,
					isDel: false,
				}).sort({ _id: -1 }).select("_id name");

			}
		}
		else {
			getData = await partyModel.find({
				companyId: getUser.activeCompany,
				isDel: false,
				...filter
			}).skip(skip).limit(limit).sort({ _id: -1 });
		}

		if (!getData) {
			return res.status(500).json({ 'err': 'No party availble', get: false });
		}

		return res.status(200).json({ data: getData, totalData: totalData });

	} catch (error) {
		return res.status(500).json({ 'err': 'Something went wrong', get: false });
	}

}


// Delete controller
const remove = async (req, res) => {
	const { ids } = req.body;

	if (!ids || !Array.isArray(ids) || ids.length === 0) {
		return res.status(400).json({ err: "No valid IDs provided", remove: false });
	}

	try {
		const removeParty = await partyModel.updateMany(
			{ _id: { $in: ids } },
			{ $set: { isDel: true } }
		);

		if (removeParty.matchedCount === 0) {
			return res.status(404).json({ err: "No matching parties found", remove: false });
		}

		return res.status(200).json({
			msg: "Parties deleted successfully",
			modifiedCount: removeParty.modifiedCount,
		});

	} catch (error) {
		console.log(error);
		return res.status(500).json({ err: "Something went wrong", remove: false });
	}
};


// Resoter from trash
const restore = async (req, res) => {
	const { ids } = req.body;

	if (ids.length === 0) {
		return res.status(500).json({ err: 'require fields are empty', restore: false });
	}

	try {
		const restoreData = await partyModel.updateMany({ _id: { $in: ids } }, {
			$set: {
				isTrash: false
			}
		})

		if (restoreData.matchedCount === 0) {
			return res.status(404).json({ err: "No tax restore", restore: false });
		}

		return res.status(200).json({ msg: 'Restore successfully', restore: true })


	} catch (error) {
		return res.status(500).json({ err: "Something went wrong", restore: false });
	}
}


const getLog = async (req, res) => {
	const { token, partyId } = req.body;
	const { page, limit } = req.query;
	const skip = (parseInt(page) - 1) * parseInt(limit);

	if (!token || !partyId) {
		return res.status(500).json({ err: "invalid user", get: false })
	}

	try {
		const getInfo = await getId(token);
		const getUser = await userModel.findOne({ _id: getInfo._id });
		const totalData = await PartyLog.countDocuments({
			companyId: getUser.activeCompany
		});


		const getLogs = await PartyLog.find({
			partyId, companyId: getUser.activeCompany,
			userId: getInfo._id
		}).populate('invoiceId').populate("partyId").skip(skip).limit(limit);


		if (!getLogs) {
			return res.status(500).json({ err: "No logs found", get: false });
		}

		return res.status(200).json({ data: getLogs, totalData });


	} catch (error) {
		console.log(error)
		return res.status(500).json({ err: "Something went wrong", get: false });
	}


}


// Get party's Balance;
const getPartyBalance = async (req, res) => {
	const { token } = req.body;

	if (!token) {
		return res.status(500).json({ 'err': 'Invalid user', get: false });
	}

	try {
		const getInfo = await getId(token);
		const getUser = await userModel.findOne({ _id: getInfo._id });

		// Get All party
		const allParty = await partyModel.find({
			userId: getInfo._id,
			companyId: getUser.activeCompany,
			isDel: "0",
		})

		let data = [];
		for (let party of allParty) {
			// Get All Sales;
			const sales = await salesinvoiceModel.find({
				userId: getInfo._id,
				companyId: getUser.activeCompany,
				party: party._id,
				isDel: '0',
			})

			// Get All Purchase;
			const purchase = await purchaseInvoiceModel.find({
				userId: getInfo._id,
				companyId: getUser.activeCompany,
				party: party._id,
				isDel: '0',
			})
			const totalSalesAmount = sales?.reduce((acc, i) => acc += i.finalAmount, 0);
			const totalPurchaseAmount = purchase?.reduce((acc, i) => acc += i.finalAmount, 0);

			if (party.type === CUSTOMER) {
				data.push({
					partyId: party._id, balance: (totalSalesAmount).toFixed(2), type: party.type
				});
			}
			else if (party.type === SUPPLIER) {
				data.push({
					partyId: party._id, balance: (totalPurchaseAmount).toFixed(2), type: party.type
				});
			}
			else if (party.type === BOTHPARTY) {
				data.push({
					partyId: party._id, balance: (totalPurchaseAmount + totalSalesAmount).toFixed(2),
					type: party.type
				});
			}
		}

		return res.status(200).json({ data });

	} catch (error) {
		return res.status(500).json({ 'err': 'Something went wrong' });
	}
}



module.exports = {
	add, get,
	remove,
	restore,
	getLog,
	getPartyBalance
}
