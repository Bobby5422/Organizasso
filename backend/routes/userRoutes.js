const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/pending', userCtrl.getPendingUsers);
router.get('/', userCtrl.getAllUsers);
router.get('/:id', userCtrl.getProfile);
router.put('/:id/validate', userCtrl.validateUser);
router.put('/:id/role', userCtrl.setUserRole);


module.exports = router;
