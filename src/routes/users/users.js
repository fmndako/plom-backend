const UserController = require('../../controllers/users/users');
const express = require('express');

const router = express.Router();

router.get('/details', UserController.getUser);

router.put('/', UserController.updateUser);



module.exports = router;
