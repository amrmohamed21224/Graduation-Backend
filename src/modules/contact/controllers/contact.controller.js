const catchAsync = require('../../../utils/catchAsync');
const ApiResponse = require('../../../utils/apiResponse');
const contactService = require('../services/contact.service');

class ContactController {
  /**
   * Public — anyone can submit a contact form
   */
  submit = catchAsync(async (req, res, next) => {
    const contact = await contactService.createMessage(req.body);
    ApiResponse.success(res, 201, 'Message sent successfully. We will get back to you soon!', { contact });
  });

  /**
   * Admin only — view all support messages
   */
  getAll = catchAsync(async (req, res, next) => {
    const result = await contactService.getAllMessages(req.query);
    ApiResponse.success(res, 200, 'Contact messages retrieved', result);
  });

  /**
   * Admin only — mark a message as resolved
   */
  markResolved = catchAsync(async (req, res, next) => {
    const contact = await contactService.markResolved(req.params.id);
    ApiResponse.success(res, 200, 'Message marked as resolved', { contact });
  });
}

module.exports = new ContactController();
