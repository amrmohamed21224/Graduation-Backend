const documentService = require('../services/document.service');
const catchAsync = require('../../../utils/catchAsync');
const ApiResponse = require('../../../utils/apiResponse');

class DocumentController {
  
  addDocument = catchAsync(async (req, res, next) => {
    // If a document image was uploaded, store its accessible URL in req.body.fileUrl
    if (req.file) {
      req.body.fileUrl = `/uploads/${req.file.filename}`;
    }

    // req.user is dynamically populated by the protect middleware
    const document = await documentService.addDocument(req.user.id, req.body);
    
    ApiResponse.success(res, 201, 'Document created successfully', { document });
  });

  updateDocument = catchAsync(async (req, res, next) => {
    // Update image path if a new image was uploaded during edit
    if (req.file) {
      req.body.fileUrl = `/uploads/${req.file.filename}`;
    }

    const document = await documentService.updateDocument(
      req.user.id, 
      req.params.id, 
      req.body
    );
    
    ApiResponse.success(res, 200, 'Document updated successfully', { document });
  });

  deleteDocument = catchAsync(async (req, res, next) => {
    await documentService.deleteDocument(req.user.id, req.params.id);
    
    ApiResponse.success(res, 200, 'Document deleted successfully', null);
  });

  getUserDocuments = catchAsync(async (req, res, next) => {
    const result = await documentService.getUserDocuments(req.user.id, req.query);
    
    ApiResponse.success(res, 200, 'Documents retrieved successfully', {
      results: result.documents.length,
      ...result
    });
  });

}

module.exports = new DocumentController();
