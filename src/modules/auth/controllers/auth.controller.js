const authService = require('../services/auth.service');
const catchAsync = require('../../../utils/catchAsync');
const ApiResponse = require('../../../utils/apiResponse');

class AuthController {
  // catchAsync handles internally routing unhandled promise rejections to the error.middleware
  register = catchAsync(async (req, res, next) => {
    const result = await authService.register(req.body);
    
    ApiResponse.success(res, 201, 'User registered successfully', result);
  });

  login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    ApiResponse.success(res, 200, 'User logged in successfully', result);
  });
}

module.exports = new AuthController();
