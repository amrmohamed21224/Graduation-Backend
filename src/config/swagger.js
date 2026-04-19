const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Grad Project API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Document Management System Backend',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Document: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '60d0fe4f5311236168a109cb' },
            title: { type: 'string', example: 'Passport' },
            documentId: { type: 'string', example: 'DOC-12345' },
            issueDate: { type: 'string', format: 'date-time' },
            expiryDate: { type: 'string', format: 'date-time' },
            status: { type: 'string', example: 'VALID' },
          }
        },
        Notification: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '60d0fe4f5311236168a109cc' },
            userId: { type: 'string' },
            documentId: { type: 'string' },
            message: { type: 'string', example: 'Your document expires soon' },
            type: { type: 'string', example: 'in_app' },
            isRead: { type: 'boolean', example: false },
            sentAt: { type: 'string', format: 'date-time' }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error occurred' },
            error: { type: 'object' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Paths to files containing OpenAPI definitions
  apis: ['./src/modules/**/*.routes.js', './src/docs/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const setupSwagger = (app) => {
  const logger = require('../utils/logger');
  // Setup Swagger UI route
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }'
  }));
  logger.info('[Swagger] API Documentation generated at /api-docs');
};

module.exports = setupSwagger;
