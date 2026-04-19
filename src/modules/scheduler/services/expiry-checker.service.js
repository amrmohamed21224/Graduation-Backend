const Document = require('../../documents/models/document.model');
const notificationService = require('../../notifications/services/notification.service');
const emailService = require('../../notifications/services/email.service');
const logger = require('../../../utils/logger');

class ExpiryCheckerService {
  /**
   * Scans all documents and generates notifications and emails if they expire soon or are expired.
   * This is intended to be run daily by the node-cron scheduler.
   */
  async runDailyExpiryChecks() {
    logger.info('[ExpiryChecker] Starting daily document expiry checks...');
    
    try {
      // Find all documents and populate the user details to get their email and name
      const documents = await Document.find({}).populate('userId', 'name email');
      const today = new Date();
      let alertCount = 0;

      for (const doc of documents) {
        if (!doc.userId) continue; // Skip if user account was deleted but document remained

        const expiryDate = new Date(doc.expiryDate);
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days remaining

        let message = null;
        let shouldAlert = false;

        // Condition rules for warning: 30 days, 15 days, 7 days, 1 day, or already expired
        if (diffDays <= 0) {
          message = `انتهت صلاحية وثيقتك (${doc.title})! الرجاء التجديد فوراً.`;
          shouldAlert = true;
        } else if (diffDays === 1 || diffDays === 7 || diffDays === 15 || diffDays === 30) {
          message = `وثيقتك (${doc.title}) ستنتهي خلال ${diffDays} أيام. التجديد مطلوب قريباً.`;
          shouldAlert = true;
        }

        if (shouldAlert && message) {
          // 1. Create In-App Notification (Database)
          const isCreated = await notificationService.createNotification(
            doc.userId._id, 
            doc._id, 
            message, 
            'in_app'
          );

          // 2. Send Email if the notification was actually newly generated (to avoid spamming duplicates)
          if (isCreated) {
            await emailService.sendExpiryAlert(
              doc.userId.email, 
              doc.userId.name, 
              doc.title, 
              diffDays
            );
            alertCount++;
          }
        }
      }

      logger.info(`[ExpiryChecker] Scan completed successfully. Generated ${alertCount} new alerts.`);
    } catch (error) {
      logger.error('[ExpiryChecker Error] Failed during document scanning:', error.message);
      throw error;
    }
  }
}

module.exports = new ExpiryCheckerService();
