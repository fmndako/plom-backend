const express = require('express')
const Auth = require('./auth')
const Users = require('./users')
const Admin = require('./admin/user')
const Loan = require('./admin/loan')
const Contribution = require('./contribution')

const router = express.Router()
// All your parent route link should be in this file
// Create your route file in the routes folder and link your file here
/**
 * e.g const userRoute = require('./userRoute');
 *     router.use("/user", userRoute)
 */

router.use('/api/v1/', Auth)
router.use('/api/v1/user/', Users)
router.use('/api/v1/user/', Contribution)
router.use('/api/v1/admin/', Admin)
router.use('/api/v1/loan/', Loan)

router.use('*', (req, res) => {
  res.send('Page not found')
})

module.exports = router
