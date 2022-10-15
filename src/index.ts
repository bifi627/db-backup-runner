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
        console.log("Next planned run...")
        console.log(job.nextDate().toHTTP());
    });

    job.start();
    console.log("Backup cron scheduled...")
    console.log("Next planned run...")
    console.log(job.nextDate().toHTTP());
}
else {
    (async () => await task())();
}

