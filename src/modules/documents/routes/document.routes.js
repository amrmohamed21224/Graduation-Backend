const express = require('express');
const documentController = require('../controllers/document.controller');
const validate = require('../../../middlewares/validate.middleware');
const { 
  createDocumentValidator, 
  updateDocumentValidator,
  getDocumentsValidator,
  deleteDocumentValidator 
} = require('../validators/document.validator');
const { protect } = require('../../../middlewares/auth.middleware');

const upload = require('../../../middlewares/upload.middleware');

const router = express.Router();

// Enforce authentication on ALL document routes essentially locking this entire endpoint to logged-in users
router.use(protect);

router
  .route('/')
  .post(upload.single('documentImage'), validate(createDocumentValidator), documentController.addDocument)
  .get(validate(getDocumentsValidator), documentController.getUserDocuments);

router
  .route('/:id')
  .patch(upload.single('documentImage'), validate(updateDocumentValidator), documentController.updateDocument)
  .delete(validate(deleteDocumentValidator), documentController.deleteDocument);

module.exports = router;
