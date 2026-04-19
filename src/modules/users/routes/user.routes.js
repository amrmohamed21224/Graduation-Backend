const express = require('express');
const userController = require('../controllers/user.controller');
const validate = require('../../../middlewares/validate.middleware');
const {
  updateProfileValidator,
  changePasswordValidator,
  deleteAccountValidator,
} = require('../validators/user.validator');
const { protect } = require('../../../middlewares/auth.middleware');

const router = express.Router();

// Enforce authentication on ALL user routes
router.use(protect);

// GET    /users/me              — Get my profile
router.get('/me', userController.getMe);

// PATCH  /users/me              — Update my profile (name, email)
router.patch('/me', validate(updateProfileValidator), userController.updateMe);

// PATCH  /users/me/password     — Change my password
router.patch('/me/password', validate(changePasswordValidator), userController.changePassword);

// DELETE /users/me              — Delete my account (requires password confirmation)
router.delete('/me', validate(deleteAccountValidator), userController.deleteMe);

module.exports = router;
