'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const loan = require('./loan');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
let config = require(__dirname + '/../config/config.js')[env];
const db = {};
const log = process.env.LOG_SQL_CONSOLE === 'true';

config.logging = log;
let sequelize;
if (config.url) {
    sequelize = new Sequelize(config.url, config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
// async function  dropData(){
//   await sequelize.sync({ force: true });
// }

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.attributes = {};
db.attributes.user = ['id', 'firstName', 'lastName', 'email', 'middleName', 'password', 'phoneNumber', 'isActive', 'type', 'numbers', 'verifiedNumbers', 'verifiedEmails','emails'];
db.attributes.userShort = ['id', 'firstName', 'email', 'phoneNumber', 'lastName', 'numbers', 'emails'];
module.exports = db;
