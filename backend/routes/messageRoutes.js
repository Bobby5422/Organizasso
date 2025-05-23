const express = require('express');
const router = express.Router();
const msgCtrl = require('../controllers/messageController');

router.post('/', msgCtrl.createMessage);
router.delete('/:id', msgCtrl.deleteMessage);
router.get('/', msgCtrl.getMessages);
router.post('/search', msgCtrl.searchMessages);

module.exports = router;
