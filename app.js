// For an easier require method
require('app-module-path').addPath(`${__dirname}/src`);
const express = require('express');
const path = require('path');
const morgan = require('morgan');
// Models
const app = express();
const cors = require('cors');
const config = require('./config/index.js');
const db = require('./server/models');
const route = require('./src/routes/routes');
const winston = require('./src/services/winston');
const logger = new winston('Server logs');
const {resProcessor, reqProcessor} = require('./src/middleware/processor');

// Parse the payload and add to request.body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined', { stream: logger.stream }));
app.use(resProcessor);
app.use(reqProcessor);
app.use(cors());
app.get('/', async function(req, res) {
    let u = require('./server/models').User;
    u = await u.create({email: 'a@sdf.fd', password: 'girdsfdfl'});
    console.log(u);
    res.send('App works!!');

});
// All route should be added to the index.js file inside the route folder
app.use('/api/v1', route);
app.use((err, req, res, next)=> {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    logger.error(`${err.status || 500} - ${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(err.status || 500);
    res.processError(err.status || 500, err);
});

process.on('unhandledRejection', (error, p) => {
    logger.error('unhandledRejection', {error});
});

process.on('uncaughtException', function(error) {
    logger.error('uncaughtException', {error});
});

app.listen(config.port);

console.log(`Listening @ port ${config.port}`);
