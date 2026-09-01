const { verifiToken } = require('../controllers/auth.controller');
const { addUser, login, getUser, getAllUser, updatepass, forgot, verifyOtp,
  changePassword, protectChangePassword, sendBill,
  getUserById,
  updateUserById,
  backupData,
  getBackupFiles,
  downloadBackupFile, 
  restoreBackupFile} = require('../controllers/user.controller');
const fileUploader = require("../helper/fileUploader")
const router = require('express').Router();



router
  .route("/create")
  // .post(fileUploader([{name: 'profile'}]), addUser);
  .post(addUser);

router
  .route("/get-user")
  .post(getUser);

router
  .route("/get-user-by-id")
  .post(getUserById);

router
  .route("/update-user")
  .post(updateUserById);

router
  .route("/get-all")
  .post(getAllUser);

router
  .route("/login")
  .post(login);

// Change password when user login
router
  .route("/change-pass")
  .post(updatepass);

router
  .route("/check-token")
  .post(verifiToken);

router
  .route("/forgot")
  .post(forgot);

router
  .route("/verify-otp")
  .post(verifyOtp);

// when user forgot password
router
  .route("/reset-pass")
  .post(changePassword);

router
  .route("/protect-change-pass")
  .post(protectChangePassword)

router
  .route("/send-bill")
  .post(sendBill);

router
  .route("/backup-data")
  .post(backupData);

router
  .route("/get-backup-files")
  .post(getBackupFiles);

router
  .route("/download-backup-files")
  .post(downloadBackupFile);

router
  .route("/restore-backup-files")
  .post(restoreBackupFile);



module.exports = router;
