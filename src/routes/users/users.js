const UserController = require('../../controllers/users/users');
// const SuggestionController = require('../../controller/users/suggestions');
const express = require('express');

const router = express.Router();

router.get('/', UserController.getUser);

// router.get('/suggestions', SuggestionController.getSuggestions);

router.put('/', UserController.updateUser);



// router.put('/acceptTerms', UserController.acceptTerms);


module.exports = router;
