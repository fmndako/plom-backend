const express = require('express')

const router = express.Router()
const authController = require('./../controllers/auth')
const resetController = require('./../controllers/auth')

router.post('/auth/register', authController.register)

router.post('/reset_password/reset', resetController.resetPassword)

router.put('/reset_password/new', resetController.newPassword)

router.post('/auth/login', authController.login)

module.exports = router
