const mongoose = require("mongoose");

const backupFileSchema = new mongoose.Schema({
    fileName: String
},{timestamps: true});

const backupFileModel = new mongoose.model("backup_files", backupFileSchema);

module.exports = backupFileModel;