const express = require('express');
const apiRouter = express();
const users  = require('./users');
const loans  = require('./loans');
// const wallets  = require('./wallets');
// const activityLogs  = require('./activity-logs');

apiRouter.use('/', users);
// apiRouter.use('/wallets', wallets);
// apiRouter.use('/activityLogs', activityLogs);







module.exports = apiRouter;