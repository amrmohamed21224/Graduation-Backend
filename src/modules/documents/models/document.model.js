const mongoose = require('mongoose');
const { DOCUMENT_STATUS } = require('../../../constants/status');

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A document must belong to a user'],
      // Redundant index removed: Compound index below implicitly covers standalone userId queries.
    },
    title: {
      type: String,
      required: [true, 'Document must have a title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    documentId: {
      type: String,
      required: [true, 'A physical or logical document ID is required'],
      trim: true,
      // unique: true, // Uncomment if document IDs are globally unique across the system
    },
    issueDate: {
      type: Date,
      required: [true, 'Document must have an issue date'],
      validate: {
        validator: function (val) {
          return val <= new Date(); // Issue date cannot be in the future
        },
        message: 'Issue date cannot be in the future',
      },
    },
    expiryDate: {
      type: Date,
      required: [true, 'Document must have an expiry date'],
      index: true, // Essential for cron jobs filtering documents by expiry date
    },
    status: {
      type: String,
      enum: {
        values: Object.values(DOCUMENT_STATUS),
        message: '{VALUE} is not a valid document status',
      },
      default: DOCUMENT_STATUS.VALID,
      index: true, // Useful for filtering documents by status (e.g. all expired)
    },
    fileUrl: {
      type: String,
      required: false,
      trim: true,
      // Store the relative path (e.g. /uploads/filename.png) or full cloud URL
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Compound index to ensure a user cannot add the exact same document ID twice
documentSchema.index({ userId: 1, documentId: 1 }, { unique: true });

// Pre-save middleware to validate dates
documentSchema.pre('save', function (next) {
  if (this.issueDate && this.expiryDate && this.issueDate >= this.expiryDate) {
    return next(new Error('Expiry date must be after the issue date'));
  }
  next();
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
