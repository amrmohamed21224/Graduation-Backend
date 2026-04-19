const express = require('express');
const authRoutes = require('../modules/auth/routes/auth.routes');
const documentRoutes = require('../modules/documents/routes/document.routes');
const notificationRoutes = require('../modules/notifications/routes/notification.routes');
const userRoutes = require('../modules/users/routes/user.routes');
const contactRoutes = require('../modules/contact/routes/contact.routes');

const router = express.Router();

// Mount feature-specific routes modularly
router.use('/auth', authRoutes);
router.use('/documents', documentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/users', userRoutes);
router.use('/contact', contactRoutes);

module.exports = router;
