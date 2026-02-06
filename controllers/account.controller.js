const accountModel = require("../models/account.model");
const userModel = require("../models/user.model");
const { getId } = require("../helper/getIdFromToken");
const paymentOutModel = require("../models/paymentout.model");
const paymentInModel = require("../models/paymentin.model");
const transactionModel = require("../models/transaction.model");


const add = async (req, res) => {
	const {
		token, accountName, accountHolderName, openingBalance, asOfDate, isBankDetails,
		accountNumber, ifscCode, branchName, upiId, update, id
	} = req.body;


	if (!isBankDetails && !accountName) {
		return res.status(500).json({
			err: "require fields are empty", create: false
		});

	}
	else if (isBankDetails) {
		if ([accountName, accountHolderName, accountNumber, ifscCode, branchName].some((field) => !field || field === "")) {
			return res.status(500).json({
				err: "require fields are empty", create: false
			});
		}
	}


	try {
		const getInfo = await getId(token);
		const getUserData = await userModel.findOne({ _id: getInfo._id });


		const isExist = await accountModel.findOne({
			userId: getUserData._id, companyId: getUserData.activeCompany,
			accountName, isDel: false
		});

		if (isExist && !update) {
			return res.status(500).json({
				err: "Account alredy exist", create: false
			});
		}


		//====================[UPDATE CODE]====================
		if (update && id) {
			const update = await accountModel.updateOne({ _id: id }, {
				$set: {
					accountName, accountHolderName, openingBalance, asOfDate, isBankDetails,
					accountNumber, ifscCode, branchName, upiId
				}
			})

			if (update.modifiedCount === 0) {
				return res.status(500).json({ err: 'Account update failed', update: false })
			}

			return res.status(200).json(update)

		} // Update close here;

		const insert = await accountModel.create({
			userId: getUserData._id, companyId: getUserData.activeCompany,
			accountName, accountHolderName, openingBalance, asOfDate, isBankDetails,
			accountNumber, ifscCode, branchName, upiId
		});

		if (!insert) {
			return res.status(500).json({ err: "Account creation failed", create: false });
		}

		return res.status(200).json(insert);

	} catch (error) {
		return res.status(500).json({ err: "Something went wrong", create: false });
	}

}


// get Controller
const get = async (req, res) => {
	const { token, trash, id, all } = req.body;
	const { page, limit } = req.query;
	const skip = (parseInt(page) - 1) * parseInt(limit);

	if (!token) {
		return res.status(500).json({ 'err': 'Invalid user', get: false });
	}

	try {
		const getInfo = await getId(token);
		const getUser = await userModel.findOne({ _id: getInfo._id });

		const totalData = await accountModel.countDocuments({
			companyId: getUser.activeCompany,
			isDel: false
		});

		let getData;
		if (id) {
			getData = await accountModel.findOne({
				companyId: getUser.activeCompany,
				_id: id,
				isDel: false
			})
		}
		else if (trash) {
			getData = await accountModel.find({
				companyId: getUser.activeCompany,
				isDel: false
			}).skip(skip).limit(limit);
		}
		else if (all) {
			getData = await accountModel.find({
				companyId: getUser.activeCompany,
				isDel: false
			})
		}
		else {
			getData = await accountModel.find({
				companyId: getUser.activeCompany,
				isDel: false
			}).skip(skip).limit(limit).sort({_id: -1})
		}

		if (!getData) {
			return res.status(500).json({ 'err': 'No Account availble', get: false });
		}

		return res.status(200).json({ data: getData, totalData: totalData });


	} catch (error) {
		console.log(error)
		return res.status(500).json({ 'err': 'Something went wrong', get: false });
	}
}

// Delete controller
const remove = async (req, res) => {
	const { ids, trash } = req.body;

	if (!ids || !Array.isArray(ids) || ids.length === 0) {
		return res.status(400).json({ err: "No valid IDs provided", remove: false });
	}

	try {
		let updateQuery;
		if (trash) {
			updateQuery = { $set: { isTrash: true } };
		} else {
			updateQuery = { $set: { isDel: true } };
		}

		const removeData = await accountModel.updateMany(
			{ _id: { $in: ids } },
			updateQuery
		);

		if (removeData.matchedCount === 0) {
			return res.status(404).json({ err: "No matching category found", remove: false });
		}

		return res.status(200).json({
			msg: trash
				? "Account successfully trash"
				: "Account successfully delete",
			modifiedCount: removeData.modifiedCount,
		});

	} catch (error) {
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
		const restoreData = await accountModel.updateMany({ _id: { $in: ids } }, {
			$set: {
				isTrash: false
			}
		})

		if (restoreData.matchedCount === 0) {
			return res.status(404).json({ err: "No account restore", restore: false });
		}

		return res.status(200).json({ msg: 'Restore successfully', restore: true })


	} catch (error) {
		return res.status(500).json({ err: "Something went wrong", restore: false });
	}
}

module.exports = { add, get, remove, restore };
