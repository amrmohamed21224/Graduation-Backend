const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../../../middlewares/validate.middleware');
const { registerValidator, loginValidator } = require('../validators/auth.validator');

const router = express.Router();

// Define routes using clean separation. Notice how controller knows nothing about validation definitions
router.post('/register', validate(registerValidator), authController.register);
router.post('/login', validate(loginValidator), authController.login);

module.exports = router;
