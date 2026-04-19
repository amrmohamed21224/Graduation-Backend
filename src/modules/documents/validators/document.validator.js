const { body, param, query } = require('express-validator');

const createDocumentValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('documentId')
    .trim()
    .notEmpty().withMessage('Document ID is required'),
  body('issueDate')
    .notEmpty().withMessage('Issue date is required')
    .isISO8601().withMessage('Issue date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Issue date cannot be in the future');
      }
      return true;
    }),
  body('expiryDate')
    .notEmpty().withMessage('Expiry date is required')
    .isISO8601().withMessage('Expiry date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.issueDate)) {
        throw new Error('Expiry date must be after the issue date');
      }
      return true;
    })
];

const updateDocumentValidator = [
  param('id')
    .isMongoId().withMessage('Invalid document ID format'),
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('documentId')
    .optional()
    .trim()
    .notEmpty().withMessage('Document ID cannot be empty'),
  body('issueDate')
    .optional()
    .isISO8601().withMessage('Issue date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Issue date cannot be in the future');
      }
      return true;
    }),
  body('expiryDate')
    .optional()
    .isISO8601().withMessage('Expiry date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (req.body.issueDate && new Date(value) <= new Date(req.body.issueDate)) {
        throw new Error('Expiry date must be after the issue date');
      }
      return true;
    }),
  body()
    .custom((value) => {
      if (Object.keys(value).length === 0) {
        throw new Error('At least one field must be provided for an update');
      }
      return true;
    })
];

const getDocumentsValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isString().withMessage('Sort must be a string')
];

const deleteDocumentValidator = [
  param('id')
    .isMongoId().withMessage('Invalid document ID format')
];

module.exports = {
  createDocumentValidator,
  updateDocumentValidator,
  getDocumentsValidator,
  deleteDocumentValidator
};
