const User = require('../models/user.model');
const Document = require('../../documents/models/document.model');
const Notification = require('../../notifications/models/notification.model');
const AppError = require('../../../utils/appError');

class UserService {
  /**
   * Retrieve the authenticated user's profile by their ID.
   */
  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  /**
   * Update user profile (name, email only — not password or role)
   */
  async updateProfile(userId, updateData) {
    // Prevent role/password escalation through this endpoint
    const allowedFields = ['name', 'email'];
    const filtered = {};
    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key)) {
        filtered[key] = updateData[key];
      }
    });

    if (Object.keys(filtered).length === 0) {
      throw new AppError('No valid fields to update. You can update: name, email', 400);
    }

    // Check email uniqueness if changing email
    if (filtered.email) {
      const existing = await User.findOne({ email: filtered.email, _id: { $ne: userId } });
      if (existing) {
        throw new AppError('This email is already in use by another account', 400);
      }
    }

    const user = await User.findByIdAndUpdate(userId, filtered, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  /**
   * Change password — requires current password verification
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new AppError('Current password is incorrect', 401);
    }

    // Set new password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    return user;
  }

  /**
   * Delete user account + all associated documents and notifications
   */
  async deleteAccount(userId, password) {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify password before deletion for security
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Password is incorrect. Account deletion requires password confirmation.', 401);
    }

    // Cascade delete: remove all user's documents and notifications
    await Promise.all([
      Document.deleteMany({ userId }),
      Notification.deleteMany({ userId }),
      User.findByIdAndDelete(userId),
    ]);

    return null;
  }
}

module.exports = new UserService();
