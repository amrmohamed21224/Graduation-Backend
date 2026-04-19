const authService = require('../src/modules/auth/services/auth.service');
const User = require('../src/modules/users/models/user.model');
const AppError = require('../src/utils/appError');
const jwt = require('jsonwebtoken');

// Mock external dependencies
jest.mock('../src/modules/users/models/user.model');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1d';
  });

  describe('register', () => {
    const mockUserData = {
      name: 'John Doe',
      email: 'test@example.com',
      password: 'password123'
    };

    it('should throw an error if the user already exists', async () => {
      // Setup the mock to return an existing user
      User.findOne.mockResolvedValue({ _id: 'duplicate_id' });

      await expect(authService.register(mockUserData)).rejects.toThrow(AppError);
      await expect(authService.register(mockUserData)).rejects.toThrow('Email already in use');
      expect(User.findOne).toHaveBeenCalledWith({ email: mockUserData.email });
    });

    it('should successfully create a new user and return a token', async () => {
      // User doesn't exist
      User.findOne.mockResolvedValue(null);
      
      const mockCreatedUser = {
        _id: 'new_id',
        name: mockUserData.name,
        email: mockUserData.email,
        createdAt: new Date(),
        // Mock toObject to support toJSON internal mechanisms if needed
        toObject: function() { return this; }
      };

      User.create.mockResolvedValue(mockCreatedUser);
      jwt.sign.mockReturnValue('mock-jwt-token');

      const result = await authService.register(mockUserData);

      expect(User.create).toHaveBeenCalledWith(mockUserData);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'new_id' },
        'test-secret',
        { expiresIn: '1d' }
      );
      expect(result).toHaveProperty('token', 'mock-jwt-token');
      expect(result.user).toHaveProperty('email', mockUserData.email);
    });
  });

  describe('login', () => {
    it('should throw an error on invalid credentials', async () => {
      // Mock findOne chain: findOne().select()
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null) // No user found
      });

      await expect(authService.login('wrong@test.com', 'wrong')).rejects.toThrow('Invalid email or password');
    });

    it('should successfully login user and return a token', async () => {
      const mockUser = {
        _id: 'user_123',
        name: 'Login User',
        email: 'login@test.com',
        comparePassword: jest.fn().mockResolvedValue(true) // Simulating correct password
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      jwt.sign.mockReturnValue('login-token');

      const result = await authService.login('login@test.com', 'correctpass');

      expect(mockUser.comparePassword).toHaveBeenCalledWith('correctpass');
      expect(result).toHaveProperty('token', 'login-token');
      expect(result.user.id).toBe('user_123');
    });
  });
});
