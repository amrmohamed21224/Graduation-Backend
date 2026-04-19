const { body } = require('express-validator');

const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format'),
  body()
    .custom((value) => {
      const allowed = ['name', 'email'];
      const keys = Object.keys(value);
      if (keys.length === 0) {
        throw new Error('At least one field (name or email) is required');
      }
      return true;
    }),
];

const changePasswordValidator = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long'),
];

const deleteAccountValidator = [
  body('password')
    .notEmpty().withMessage('Password is required to confirm account deletion'),
];

module.exports = {
  updateProfileValidator,
  changePasswordValidator,
  deleteAccountValidator,
};
