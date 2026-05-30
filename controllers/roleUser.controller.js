const { getId } = require("../helper/getIdFromToken");
const roleUserModel = require("../models/roleUser.model");
const userModel = require("../models/user.model");


class RoleUserController {
    static async getAllUser(req, res) {
        const { token } = req.body;
        if (!token) {
            return res.status(500).json({ err: "token is rquired" });
        }

        try {
            const getInfo = await getId(token);
            const getUserData = await userModel.findOne({ _id: getInfo._id });

            const roleUser = await roleUserModel.find({
                userId: getUserData._id, companyId: getUserData.activeCompany
            })

            return res.status(200).json({ data: roleUser });

        } catch (err) {
            console.log(err);
            return res.status(500).json({ 'err': 'Something went wrong', create: false });
        }
    }

    static async updateRoleUser(req, res) {

    }

    static async disableUser(req, res) {
        const { token, id } = req.body;
        if (!token || !id) {
            return res.status(500).json({ err: "required fields are blank" });
        }

        try {
            const getInfo = await getId(token);
            const getUserData = await userModel.findOne({ _id: getInfo._id });

            const roleUser = await roleUserModel.findOne({
                _id: id,
                userId: getUserData._id, companyId: getUserData.activeCompany
            })

            if (!roleUser) return res.status(500).json({ err: "User not found." });


            const disable = await roleUserModel.updateOne({ _id: id }, {
                $set: {
                    isDisable: true
                }
            })

            if (disable.modifiedCount === 0) {
                return res.status(500).json({ err: "User not disabled" });
            }

            return res.status(200).json({ msg: "User disable successfully" });

        } catch (err) {
            console.log(error);
            return res.status(500).json({ 'err': 'Something went wrong' });
        }
    }

    static async changePassword(req, res) {


    }

}

module.exports = RoleUserController;