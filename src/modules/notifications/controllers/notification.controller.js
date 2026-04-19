const catchAsync = require('../../../utils/catchAsync');
const ApiResponse = require('../../../utils/apiResponse');
const notificationService = require('../services/notification.service');

class NotificationController {
  
  getUserNotifications = catchAsync(async (req, res, next) => {
    const result = await notificationService.getUserNotifications(req.user.id, req.query);
    
    ApiResponse.success(res, 200, 'Notifications retrieved successfully', result);
  });

  markAsRead = catchAsync(async (req, res, next) => {
    const notification = await notificationService.markAsRead(req.user.id, req.params.id);
    
    ApiResponse.success(res, 200, 'Notification marked as read successfully', { notification });
  });

}

module.exports = new NotificationController();
