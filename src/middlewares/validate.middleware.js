const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validation chains
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }));
      
      return ApiResponse.error(res, 400, 'Validation failed', formattedErrors);
    }
    
    next();
  };
};

module.exports = validate;
