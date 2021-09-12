const app = require('../app.js');
const request = require('supertest')(app);
const db = require('../server/models');
const url = '/api/v1/auth/';

const base = {
    'Authorization': '', 
    'Content-Type': 'application/json'
};
const user = {
    email: 'loanuser@gmail.com', 
    password: 'loanuser!2A', 
    phoneNumber: '+32323456789',
    firstName: 'Loan',
    lastName: 'User',
};


const register = async () => {
    await request
        .post(url + 'register')
        .send(user);  
    user.registered = true;  
};

const login = async () => {
    if(!user.registered) await register();
    const res = await request
        .post(url + 'login')
        .send({username: user.email, password: user.password});
    base.Authorization = `Bearer ${res.body.token}`;
    user.id = res.body.user.id;
};

const activate = async () => {
    if (!user.id) await login();
    const token = await db.Token.findOne(
        {
            where: {
                userId: user.id, 
                type: 'email', 
                value: user.email
            }
        });
    await request
        .get(url + `verify-email/${user.id}/${token.token}`);
    return true;
};

const getUserDetails = async () => {
    await activate();
    return {user, base};
};

module.exports = {
    getUserDetails,
}