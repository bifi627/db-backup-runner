import { CronJob } from "cron";

import { backup } from "./backup";
import { ENV } from "./env";

const task = async () => {
    try {
        await backup();
    } catch (error) {
        console.error("Error while running backup: ", error)
    }
}

if (ENV.BACKUP_CRON_SCHEDULE !== "*") {
    const job = new CronJob(ENV.BACKUP_CRON_SCHEDULE, async () => {
        await task();
    });

    job.start();
    console.log("Backup cron scheduled...")
}
else {
    (async () => await task())();
}

