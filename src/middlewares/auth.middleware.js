const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../modules/users/models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Checking for token in headers
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Expected format -> Bearer <token>
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please provide a token.', 401)
    );
  }

  // 2) Verify token validity
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (error) {
    // This strictly catches token tampering or expiry
    return next(new AppError('Session expired or Invalid token. Log in again.', 401));
  }

  // 3) Check if user hasn't been deleted from DB between token issuance and now
  const currentUser = await User.findById(decoded.id);
  
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this session token no longer exists.',
        401
      )
    );
  }

  // PASS 4) GRANT ACCESS to the protected route mapping the valid user DB result
  req.user = currentUser;
  next();
});

/**
 * Role-based access control middleware.
 * Usage: router.use(protect, restrictTo('admin'))
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'user')
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
