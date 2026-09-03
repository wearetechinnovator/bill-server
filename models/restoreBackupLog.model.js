const mongoose = require('mongoose');


const restoreBackupLog = new mongoose.Schema({
    restoreBy: String,
    fileName: String
}, {timestamps: true})

const restoreBackupLogModel = new mongoose.model("restore_backup_log", restoreBackupLog);

module.exports = restoreBackupLogModel;