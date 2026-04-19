const { param, query } = require('express-validator');

const getNotificationsValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('unreadOnly')
    .optional()
    .isBoolean().withMessage('unreadOnly must be a boolean value'),
];

const markAsReadValidator = [
  param('id')
    .isMongoId().withMessage('Invalid notification ID format'),
];

module.exports = {
  getNotificationsValidator,
  markAsReadValidator,
};
