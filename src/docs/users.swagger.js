/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and management APIs
 * 
 * /users/me:
 *   get:
 *     summary: Retrieve authenticated user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *               example:
 *                 success: true
 *                 message: "User profile retrieved successfully"
 *                 data: 
 *                   user:
 *                     id: "60d0fe4f5311236168a109ca"
 *                     name: "John Doe"
 *                     email: "john@example.com"
 *       401:
 *         description: Unauthorized - Token completely missing or corrupt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
