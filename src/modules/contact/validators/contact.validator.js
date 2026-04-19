const { body, param } = require('express-validator');

const submitContactValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('phone')
    .optional()
    .trim(),
  body('address')
    .optional()
    .trim(),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters'),
];

const markResolvedValidator = [
  param('id')
    .isMongoId().withMessage('Invalid message ID format'),
];

module.exports = {
  submitContactValidator,
  markResolvedValidator,
};
