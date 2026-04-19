/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Document lifecycle and management API
 * 
 * /documents:
 *   post:
 *     summary: Create a newly tracked document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - documentId
 *               - issueDate
 *               - expiryDate
 *             properties:
 *               title:
 *                 type: string
 *                 example: US Passport
 *               documentId:
 *                 type: string
 *                 example: "PASS-00123"
 *               issueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2020-05-15T00:00:00.000Z"
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2030-05-15T00:00:00.000Z"
 *     responses:
 *       201:
 *         description: Document created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation payload error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   get:
 *     summary: Retrieve your tracked documents
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Pagination parameter
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page limit
 *         example: 10
 *     responses:
 *       200:
 *         description: A paginated list of documents
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 * 
 * /documents/{id}:
 *   patch:
 *     summary: Update an existing document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 60d0fe4f5311236168a109cb
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: US Passport Renewed
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Document updated securely
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 * 
 *   delete:
 *     summary: Delete an existing document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Return null data confirming the deletion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
