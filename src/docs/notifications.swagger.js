/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification endpoints for document expiry warnings
 * 
 * /notifications:
 *   get:
 *     summary: Retrieve notifications for the current user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: unreadOnly
 *         schema:
 *           type: boolean
 *         description: Filter strictly to unread notifications
 *         example: true
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
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 * 
 * /notifications/{id}/read:
 *   patch:
 *     summary: Mark a single notification as read securely
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 60d0fe4f5311236168a109cc
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
