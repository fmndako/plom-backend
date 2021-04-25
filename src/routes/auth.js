const AuthController = require('../controllers/auth');
const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');

const router = express.Router();

router.post('/register', AuthController.signup.bind(AuthController));
router.post('/login', AuthController.login);
router.post('/logout', isAuthenticated, AuthController.logout);
// router.post('/requestVerification/:userId', AuthController.requestEmailVerificationDirect);
router.post('/requestVerification', isAuthenticated, AuthController.requestEmailVerificationLink);
// router.post('/verifyEmail', AuthController.verifyEmail);
router.post('/:verifyEmail/:userId/:otp', AuthController.verifyEmailLink);
router.post('/changePassword', isAuthenticated, AuthController.changePassword);
router.post('/requestPasswordReset', AuthController.requestPasswordReset);
// router.post('/resetPassword', AuthController.resetPassword);
router.post('/setPassword', AuthController.setPassword);



module.exports = router;
