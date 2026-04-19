const cron = require('node-cron');
const expiryCheckerService = require('../services/expiry-checker.service');
const logger = require('../../../utils/logger');

// Initialize CRON job.
// '0 0 * * *' = Executes precisely at 00:00 (Midnight) every single day.
const initJobs = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      await expiryCheckerService.runDailyExpiryChecks();
    } catch (error) {
      logger.error('[CRON Error] Expiry Checker Job failed catastrophically:', { error: error.message, stack: error.stack });
    }
  }, {
    scheduled: true,
    timezone: "Africa/Cairo" // ضمان التنفيذ حسب توقيت مصر مهما كان موقع سيرفر Render
  });

  logger.info('[Scheduler] Daily Expiry background job initialized.');
};

module.exports = { initJobs };
