const express = require('express')

const router = express.Router()
const checkAdmin = require('helper/checkAdmin')
const authenticate = require('helper/auth')
const adminController = require('controllers/admin/user')

router.use(authenticate.authenticate)
router.use(checkAdmin.checkIfAdmin)
router.get('/user/search/', adminController.getAllUsers)
module.exports = router