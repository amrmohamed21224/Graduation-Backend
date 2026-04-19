const Document = require('../models/document.model');
const AppError = require('../../../utils/appError');
const { DOCUMENT_STATUS } = require('../../../constants/status');

class DocumentService {
  /**
   * Automatically calculates the status of a document based on its expiry date.
   * Logic:
   * - If expiryDate is in the past: EXPIRED
   * - If expiryDate is within the next 30 days: ABOUT_TO_EXPIRE
   * - Otherwise: VALID
   */
  calculateStatus(expiryDate) {
    const now = new Date();
    const expiry = new Date(expiryDate);
    
    // Check if expired
    if (expiry < now) {
      return DOCUMENT_STATUS.EXPIRED;
    }
    
    // Check if within 30 days
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    if (expiry <= thirtyDaysFromNow) {
      return DOCUMENT_STATUS.ABOUT_TO_EXPIRE;
    }

    return DOCUMENT_STATUS.VALID;
  }

  async addDocument(userId, documentData) {
    // Check if user already added this specific document ID
    const existingDoc = await Document.findOne({ userId, documentId: documentData.documentId });
    if (existingDoc) {
      throw new AppError('You have already added a document with this ID', 400);
    }

    // Determine initial status
    const status = this.calculateStatus(documentData.expiryDate);

    // Create document
    const document = await Document.create({
      ...documentData,
      userId,
      status
    });

    return document;
  }

  async updateDocument(userId, docId, updateData) {
    // First, find the document ensures it belongs to the user
    const document = await Document.findOne({ _id: docId, userId });

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    // Validate dates if they are being updated
    const finalIssueDate = updateData.issueDate ? new Date(updateData.issueDate) : document.issueDate;
    const finalExpiryDate = updateData.expiryDate ? new Date(updateData.expiryDate) : document.expiryDate;

    if (finalIssueDate >= finalExpiryDate) {
      throw new AppError('Expiry date must be after the issue date', 400);
    }

    // Recalculate status if expiryDate might have changed
    if (updateData.expiryDate) {
      updateData.status = this.calculateStatus(updateData.expiryDate);
    }

    // Prevent bypassing documentId uniqueness constraint (if they change documentId to one they already own)
    if (updateData.documentId && updateData.documentId !== document.documentId) {
       const existingDoc = await Document.findOne({ userId, documentId: updateData.documentId });
       if (existingDoc) {
          throw new AppError('You already have another document with this ID', 400);
       }
    }

    // Apply updates
    Object.assign(document, updateData);
    await document.save(); // Using save() triggers Mongoose validation hooks

    return document;
  }

  async deleteDocument(userId, docId) {
    const document = await Document.findOneAndDelete({ _id: docId, userId });

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    return null;
  }

  async getUserDocuments(userId, queryParams) {
    // Build specific query filters for features like pagination mapping or status filtering
    const { status, search, page = 1, limit = 10 } = queryParams;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const matchQuery = { userId };
    if (status) matchQuery.status = status;

    // Search by document title (case-insensitive partial match)
    if (search) {
      matchQuery.title = { $regex: search, $options: 'i' };
    }

    const [documents, total] = await Promise.all([
      Document.find(matchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Document.countDocuments(matchQuery)
    ]);

    return {
      documents,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    };
  }
}

module.exports = new DocumentService();
