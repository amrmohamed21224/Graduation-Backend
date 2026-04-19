const documentService = require('../src/modules/documents/services/document.service');
const Document = require('../src/modules/documents/models/document.model');
const AppError = require('../src/utils/appError');
const { DOCUMENT_STATUS } = require('../src/constants/status');

// Mock specific logic
jest.mock('../src/modules/documents/models/document.model');
// Not mocking AppError class globally, just letting it throw normal Errors.

describe('DocumentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateStatus', () => {
    it('should return EXPIRED if the expiryDate is in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      
      const status = documentService.calculateStatus(pastDate);
      expect(status).toBe(DOCUMENT_STATUS.EXPIRED);
    });

    it('should return ABOUT_TO_EXPIRE if the expiryDate is within 30 days', () => {
      const nearFutureDate = new Date();
      nearFutureDate.setDate(nearFutureDate.getDate() + 15);
      
      const status = documentService.calculateStatus(nearFutureDate);
      expect(status).toBe(DOCUMENT_STATUS.ABOUT_TO_EXPIRE);
    });

    it('should return VALID if the expiryDate is greater than 30 days', () => {
      const farFutureDate = new Date();
      farFutureDate.setDate(farFutureDate.getDate() + 90);
      
      const status = documentService.calculateStatus(farFutureDate);
      expect(status).toBe(DOCUMENT_STATUS.VALID);
    });
  });

  describe('addDocument', () => {
    const mockUserId = 'user_abc';
    const mockDocumentData = {
      title: 'Valid Document',
      documentId: 'DOC-999',
      issueDate: new Date().toISOString(),
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
    };

    it('should throw an error if tracking the same documentId twice', async () => {
      Document.findOne.mockResolvedValue({ _id: 'existing_doc' });

      await expect(documentService.addDocument(mockUserId, mockDocumentData)).rejects.toThrow(AppError);
      await expect(documentService.addDocument(mockUserId, mockDocumentData)).rejects.toThrow('already added');
    });

    it('should accurately calculate status and create the document', async () => {
      Document.findOne.mockResolvedValue(null);
      Document.create.mockImplementation((data) => Promise.resolve({ ...data, _id: 'new_doc_1' }));

      const result = await documentService.addDocument(mockUserId, mockDocumentData);

      expect(Document.create).toHaveBeenCalled();
      
      // Specifically assert that it correctly calculated VALID for 1 year in the future
      expect(result).toHaveProperty('status', DOCUMENT_STATUS.VALID);
      expect(result).toHaveProperty('userId', mockUserId);
    });
  });
});
