const mongoose = require("mongoose");

const attendanceSettingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    attendanceReminder: {
        type: Boolean,
        default: false
    },
    reminderTime: String,
    defaultPresent: {
        type: Boolean,
        default: false
    },
    workingHourFrom: String,
    workingHourTo: String,
    weeklyOffDays: [String],
}, { timestamps: true });


const attendanceSettingModel = new mongoose.model("attendancesetting", attendanceSettingSchema);
module.exports = attendanceSettingModel;
