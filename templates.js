const fs = require('fs');

let signup = fs.readFileSync(__dirname + '/views/signup.html', 'utf8');
let password = fs.readFileSync(__dirname + '/views/password.html', 'utf8');
let transaction = fs.readFileSync(__dirname + '/views/transaction.html', 'utf8');

const templates = {
    signup,
    password,
    transaction
};
module.exports = templates;
