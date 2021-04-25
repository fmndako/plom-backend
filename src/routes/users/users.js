const UserController = require('../../controllers/users/users');
const express = require('express');

const router = express.Router();

router.get('/', UserController.getUser);

router.put('/', UserController.updateUser);
// router.put('/acceptTerms', UserController.acceptTerms);

module.exports = router;
