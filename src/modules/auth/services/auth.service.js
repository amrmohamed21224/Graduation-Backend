const jwt = require('jsonwebtoken');
const User = require('../../users/models/user.model');
const AppError = require('../../../utils/appError');

class AuthService {
  async register(userData) {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }
    
    // 2. Create user
    const user = await User.create(userData);
    
    // 3. Return user data and token
    return this.generateAuthResponse(user);
  }

  async login(email, password) {
    // 1. Find user and explicitly select the password field (since select: false in Model)
    const user = await User.findOne({ email }).select('+password');
    
    // 2. Check if user exists & password matches
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    // 3. Remove password from the output via Mongoose toJSON and create token
    return this.generateAuthResponse(user);
  }

  generateAuthResponse(user) {
    // Generate JWT — include role in payload for role-based access
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }
}

module.exports = new AuthService();
