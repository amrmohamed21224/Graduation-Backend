const express = require('express');
const contactController = require('../controllers/contact.controller');
const validate = require('../../../middlewares/validate.middleware');
const { submitContactValidator, markResolvedValidator } = require('../validators/contact.validator');
const { protect, restrictTo } = require('../../../middlewares/auth.middleware');

const router = express.Router();

// Public route — anyone can submit a contact form
router.post('/', validate(submitContactValidator), contactController.submit);

// Admin-only routes
router.use(protect, restrictTo('admin'));

router.get('/', contactController.getAll);
router.patch('/:id/resolve', validate(markResolvedValidator), contactController.markResolved);

module.exports = router;
