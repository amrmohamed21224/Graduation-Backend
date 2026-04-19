const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Notification must belong to a user'],
      index: true, // To fetch a user's notifications quickly
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: [true, 'Notification must be related to a document'],
      index: true, // Useful for finding all notifications sent for a specific document
    },
    message: {
      type: String,
      required: [true, 'Notification must have a message'],
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: ['email', 'sms', 'in_app'],
        message: '{VALUE} is not a valid notification type',
      },
      required: [true, 'Notification type is required'],
    },
    sentAt: {
      type: Date,
      default: Date.now,
      index: true, // Useful for job pruning (e.g., delete notifications older than 6 months)
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Normally notifications might not strictly need 'updatedAt', but having timestamps is good practice
    timestamps: true,
  }
);

// Compound index to prevent sending duplicates for the same document on the same day if re-ran accidentally
// Note: This specific index assumes you only want one notification per document per type per day.
// For production, you could refine this or handle duplicate checking in the job logic.
// notificationSchema.index({ documentId: 1, type: 1, sentAt: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
