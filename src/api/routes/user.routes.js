const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminOnly = require('../middlewares/adminOnly.middleware');

router.get('/profile', authMiddleware, userController.getProfile);
router.post('/invite', authMiddleware, adminOnly, userController.createInvite);
router.get('/staff', authMiddleware, userController.getAllStaff );
router.get('/:id',authMiddleware, adminOnly, userController.getUserById);
router.put('/:id',authMiddleware, adminOnly, userController.updateUser);
router.delete('/:id',authMiddleware, adminOnly, userController.deleteUser);
router.put('/:id/permissions',authMiddleware, adminOnly, userController.updatePermissions);
module.exports = router;
