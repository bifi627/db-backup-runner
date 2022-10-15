import { exec } from "child_process";
import { cert, getApp, initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { ENV } from "./env";

initializeApp({
    credential: cert(JSON.parse(ENV.FIREBASE_ACCESS_JSON)),
    storageBucket: 'peperino-app.appspot.com'
});

const clean = async (path: string) => {
    await new Promise<void>((resolve, reject) => {
        exec(`rm ${path}`, (error, stdout, stderr) => {
            if (stderr) {
                console.error(stderr);
            }

            if (stdout) {
                console.log(stdout);
            }

            if (error) {
                reject({ error: JSON.stringify(error), stderr });
                return;
            }

            resolve();
        });
    });
}

const uploadToStorage = async (filePath: string) => {
    const destFileName = `database/backups/${new Date().toISOString().slice(0, 13).replace(/-/g, "")}.tar.gz`
    const bucket = getStorage(getApp()).bucket(getApp().options.storageBucket);
    await bucket.upload(filePath, { destination: destFileName });
};

const dumpToFile = async (path: string) => {
    console.log("Dumping DB to file...");

    await new Promise<void>((resolve, reject) => {
        exec(
            `pg_dump ${ENV.BACKUP_DATABASE_URL} -F t | gzip > ${path}`,
            (error, stdout, stderr) => {
                if (stderr) {
                    console.error(stderr);
                }

                if (stdout) {
                    console.log(stdout);
                }

                if (error) {
                    reject({ error: JSON.stringify(error), stderr });
                    return;
                }

                resolve();
            }
        );
    });

    console.log("DB dumped to file...");
}

export const backup = async () => {
    console.log("Initiating DB backup...");

    const filename = `backup.tar.gz`;
    const filepath = `/tmp/${filename}`;

    await dumpToFile(filepath);
    await uploadToStorage(filepath);
    await clean(filepath);

    console.log("DB backup complete...");
}