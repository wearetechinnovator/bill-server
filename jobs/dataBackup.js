const cron = require('node-cron');
const path = require('path');
const fs = require("fs");
const AdmZip = require("adm-zip");



module.exports = async function () {
    cron.schedule("0 3 * * *", async () => {
        const MONGO_URI = process.env.MONGO_URL_ONLY;
        const DB_NAME = process.env.DB_NAME;
        const backupsDir = path.join(__dirname, "..", "backups");

        try {
            fs.mkdirSync(backupsDir, { recursive: true });

            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const dumpDir = path.join(backupsDir, `dump-${timestamp}`);

            const fileName = `data-backup-${timestamp}.zip`
            const zipFile = path.join(backupsDir, fileName);

            fs.mkdirSync(dumpDir, { recursive: true });

            // Run mongodump and WAIT for it
            await new Promise((resolve, reject) => {
                execFile(
                    "mongodump",
                    [
                        `--uri=${MONGO_URI}`,
                        `--db=${DB_NAME}`,
                        `--out=${dumpDir}`,
                    ],
                    { maxBuffer: 1024 * 1024 * 1024 },
                    (error, stdout, stderr) => {
                        if (error) {
                            console.error("MongoDB backup failed:");
                            console.error(stderr);

                            return reject(error);
                        }

                        resolve();
                    }
                );
            });

            // Create ZIP and WAIT for it
            await new Promise((resolve, reject) => {
                try {
                    const zip = new AdmZip();
                    zip.addLocalFolder(dumpDir);
                    zip.writeZip(zipFile);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });

            // Remove temporary dump
            fs.rmSync(dumpDir, {
                recursive: true,
                force: true,
            });

            // Delete Last File
            const listOfZipFiles = fs.readdirSync(backupsDir);

            if (listOfZipFiles.length > 7) {
                const firstFile = listOfZipFiles[0];
                const fileFilePath = path.join(backupsDir, firstFile);

                fs.unlinkSync(fileFilePath);
            }

        } catch (err) {
            console.log("BACKUP CRON ERROR: ", err);
        }
    })
}