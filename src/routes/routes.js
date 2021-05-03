const express = require('express');
const apiRouter = express();
const auth = require('./auth');
const users = require('./users/index');
const loans = require('./users/loans');
const isAuthenticated = require('../middleware/isAuthenticated');




apiRouter.use('/auth', auth);
apiRouter.use('/users', isAuthenticated, users);
apiRouter.use('/loans', isAuthenticated, loans);
// // apiRouter.use('/admin', isAdmin, admin);/



module.exports = apiRouter;