const express = require('express')
const upload = require('helper/multer')
const authenticate = require('./../helper/auth')

// eslint-disable-next-line no-undef
const router = express.Router()
const usersController = require('./../controllers/users')

router.get('/paystack/callback', usersController.confirmPayment)

router.use(authenticate.authenticate)

router.get('/', usersController.getUser)

router.post('/save_in_wallet', usersController.saveWallet)

router.get('/wallet_details/', usersController.getWalletDetails)

router.get('/paystack/pay', usersController.beginPayment)

router.put('/update/', usersController.updateProfile)

router.post('/loan', usersController.loanRequest)

router.get('/getLoanRequest', usersController.getLoanRequest)

router.put('/picture/', upload.upload, usersController.addProfilePicture)

module.exports = router
