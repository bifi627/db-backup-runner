import * as dotenv from 'dotenv';
dotenv.config();

import { env } from 'process';

export const ENV = {
    BACKUP_DATABASE_URL: env.BACKUP_DATABASE_URL ?? "",
    BACKUP_CRON_SCHEDULE: env.BACKUP_CRON_SCHEDULE ?? "",
    FIREBASE_ACCESS_JSON: env.FIREBASE_ACCESS_JSON ?? "",
};