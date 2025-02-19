import { CronJob } from 'cron';

import logger from '~/core/logger';
import { tokenService } from '~/services/db/token.service';

const cleanExpiredTokens = async () => {
  logger.info('[Cron Job] Cleaning expired refresh tokens...');

  const deletedCount = await tokenService.deleteExpiredTokens();

  logger.info(`[Cron Job] Deleted ${deletedCount} expired tokens.`);
};

const job = new CronJob('0 * * * *', cleanExpiredTokens, null, true, 'UTC');

export default job;
