const express = require('express')

const router = express.Router()
const contributionsController = require('./../controllers/contribution')

router.get('/getContribution/', contributionsController.getContribution)

router.post('/addContribution/', contributionsController.addContribution)

module.exports = router
