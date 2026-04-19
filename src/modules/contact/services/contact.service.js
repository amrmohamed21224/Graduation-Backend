const Contact = require('../models/contact.model');
const logger = require('../../../utils/logger');

class ContactService {
  /**
   * Create a new contact/support request
   */
  async createMessage(data) {
    const contact = await Contact.create(data);
    logger.info(`[Contact] New message from ${data.email}`);
    return contact;
  }

  /**
   * Get all contact messages (admin only)
   */
  async getAllMessages(query) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (query.isResolved !== undefined) {
      filter.isResolved = query.isResolved === 'true';
    }

    const [messages, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(filter),
    ]);

    return { messages, total, page, limit };
  }

  /**
   * Mark a contact message as resolved (admin only)
   */
  async markResolved(messageId) {
    const contact = await Contact.findByIdAndUpdate(
      messageId,
      { isResolved: true },
      { new: true }
    );
    return contact;
  }
}

module.exports = new ContactService();
