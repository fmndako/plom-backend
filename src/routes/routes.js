const express = require('express');
const apiRouter = express();
const auth = require('./auth');
const users = require('./users/index');
const loans = require('./users/loans');
const utils = require('./support');
const admin = require('./admin');
const noauth = require('./noauth');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAdmin = require('../middleware/isAdmin');





apiRouter.use('/auth', auth);
apiRouter.use('/users', isAuthenticated, users);
apiRouter.use('/loans', isAuthenticated, loans);
apiRouter.use('/support', isAuthenticated, utils);
apiRouter.use('/admin', isAdmin, admin);
apiRouter.use('/noauth',  noauth);



module.exports = apiRouter;