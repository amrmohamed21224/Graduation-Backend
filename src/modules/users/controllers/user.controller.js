const catchAsync = require('../../../utils/catchAsync');
const ApiResponse = require('../../../utils/apiResponse');
const userService = require('../services/user.service');

class UserController {
  getMe = catchAsync(async (req, res, next) => {
    const user = await userService.getProfile(req.user.id);
    ApiResponse.success(res, 200, 'User profile retrieved successfully', { user });
  });

  updateMe = catchAsync(async (req, res, next) => {
    const user = await userService.updateProfile(req.user.id, req.body);
    ApiResponse.success(res, 200, 'Profile updated successfully', { user });
  });

  changePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(req.user.id, currentPassword, newPassword);
    ApiResponse.success(res, 200, 'Password changed successfully');
  });

  deleteMe = catchAsync(async (req, res, next) => {
    const { password } = req.body;
    await userService.deleteAccount(req.user.id, password);
    ApiResponse.success(res, 200, 'Account deleted successfully');
  });
}

module.exports = new UserController();
