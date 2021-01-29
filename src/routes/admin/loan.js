const express = require('express')

const router = express.Router()
const getLoanRequest = require('./../../controllers/admin/loan')

router.get('/getall', getLoanRequest.getLoans)

module.exports = router
