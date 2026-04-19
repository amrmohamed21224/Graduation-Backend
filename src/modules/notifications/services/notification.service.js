const Notification = require('../models/notification.model');
const AppError = require('../../../utils/appError');
const logger = require('../../../utils/logger');

class NotificationService {
  /**
   * Generates a new notification, ensuring we don't spam the user with exact duplicates.
   * Duplicate check: Same documentId, same message/type within the last 24 hours.
   */
  async createNotification(userId, documentId, message, type = 'in_app') {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // 1. Check if a similar notification was already sent today
    const duplicate = await Notification.findOne({
      userId,
      documentId,
      type,
      message,
      sentAt: { $gte: yesterday }
    });

    if (duplicate) {
      // Return gracefully; it's practically safe to ignore duplicate generation.
      logger.info(`[Notification Service] Duplicate skipped for Document ${documentId}`);
      return null;
    }

    // 2. Create and return the notification record
    const notification = await Notification.create({
      userId,
      documentId,
      message,
      type,
    });

    // TODO: In a real system, you'd integrate an external Provider (e.g., SendGrid/Twilio) here.
    // await EmailProvider.send(...);

    return notification;
  }

  /**
   * Retrieves all notifications for a specific user
   * pagination and unread filters can be applied
   */
  async getUserNotifications(userId, query) {
    const filter = { userId };
    
    // Optional filter for unread only
    if (query.unreadOnly === 'true') {
      filter.isRead = false;
    }

    // Pagination
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ sentAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('documentId', 'title expiryDate status'),
      Notification.countDocuments(filter),
      Notification.countDocuments({ userId, isRead: false })
    ]);

    return {
      notifications,
      total,
      page,
      limit,
      unreadCount
    };
  }

  /**
   * Marks a specific notification as read
   */
  async markAsRead(userId, notificationId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true, runValidators: true }
    );

    if (!notification) {
      throw new AppError('Notification not found or you do not have permission to mark it as read', 404);
    }

    return notification;
  }
}

module.exports = new NotificationService();
