const express = require('express');
const notificationController = require('../controllers/notification.controller');
const validate = require('../../../middlewares/validate.middleware');
const {
  getNotificationsValidator,
  markAsReadValidator,
} = require('../validators/notification.validator');
const { protect } = require('../../../middlewares/auth.middleware');

const router = express.Router();

// Enforce authentication on all notification routes
router.use(protect);

router
  .route('/')
  .get(validate(getNotificationsValidator), notificationController.getUserNotifications);

router
  .route('/:id/read')
  .patch(validate(markAsReadValidator), notificationController.markAsRead);

module.exports = router;
