class ApiResponse {
  /**
   * Send a success response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   * @param {Object} [data={}] - Response data payload
   */
  static success(res, statusCode, message, data = {}) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  /**
   * Send an error response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Object} [error={}] - Additional error details
   */
  static error(res, statusCode, message, error = {}) {
    return res.status(statusCode).json({
      success: false,
      message,
      error
    });
  }
}

module.exports = ApiResponse;
