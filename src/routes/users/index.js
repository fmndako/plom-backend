const express = require('express');
const apiRouter = express();
const users  = require('./users');
// const applications  = require('./applications');
// const wallets  = require('./wallets');
// const activityLogs  = require('./activity-logs');




apiRouter.use('/', users);
// apiRouter.use('/applications', applications);
// apiRouter.use('/wallets', wallets);
// apiRouter.use('/activityLogs', activityLogs);







module.exports = apiRouter;