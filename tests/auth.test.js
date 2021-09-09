const app = require('../app.js');
const request = require('supertest')(app);
const authURL = '/api/v1/auth/';
const userPassword = 'fwer23@kdsF';
const base = {'Authorization': '', 'Content-Type': 'application/json'};
const db = require('../server/models');
let user = {};
const loanUser = {
    email: 'loanuser@gmail.com', 
    password: 'loanuser!2A', 
    phoneNumber: '+32323456789',
    firstName: 'Loan',
    lastName: 'User',
};


describe('User API', () => {
    it('should sign up', async done => {
        const res = await request
            .post(authURL + 'register')
            .send({
                firstName: 'Bob',
                lastName: 'Doe',
                email: 'bob@doe.com',
                password: '12345678Ae@',
                phoneNumber: '+578912345678'
            });
        expect(res.status).toEqual(201);
        expect(res.body).toHaveProperty('detail');
        const resp = await request
            .post(authURL + 'register')
            .send(loanUser);
        expect(resp.status).toEqual(201);
        expect(resp.body).toHaveProperty('detail');
        const users = await db.User.findAll();
        expect(users.length).toEqual(3); // admin seeder, bob and loan user
        done();
    });

    it ('should not register with incomplete details', async () => {
        let user = {
            firstName: 'Bob',
            lastName: 'Doe',
            email: 'bob12@doe.com',
            password: '123456784Ae@',
            phoneNumber: '+578932345678'
        };
        for (let field in user){
            delete user[field];
            const res = await request
                .post(authURL + 'register')
                .send(user);
            expect(res.status).toEqual(400);
        }
    });

    it ('should not register with invalid details', async () => {
        let validUser = {
            firstName: 'Bob',
            lastName: 'Doe',
            email: 'validemail@doe.com',
            password: '123456784Ae@',
            phoneNumber: '+5456712345609'
        };
        let invalidDetails = {
            email: '345322',
            password: '23452445',
            phoneNumber: '34554534343'
        };
        for (let field in validUser){
            if (invalidDetails[field]) validUser[field] = invalidDetails[field];
            else continue;
            const res = await request
                .post(authURL + 'register')
                .send(validUser);
            expect(res.status).toEqual(400);
        }
    });

    it ('should not register with already existing details', async () => {
        let existingEmail = {
            firstName: 'Bob',
            lastName: 'Doe',
            email: 'bob@doe.com',
            password: '123456784Ae@',
            phoneNumber: '+12309857342'
        };
        let existingPhone = {
            firstName: 'Bob',
            lastName: 'Doe',
            email: 'nonexisting@doe.com',
            password: '123456784Ae@',
            phoneNumber: '+578912345678'
        };
        const res = await request
            .post(authURL + 'register')
            .send(existingEmail);
        expect(res.status).toEqual(400);
        const rep = await request
            .post(authURL + 'register')
            .send(existingPhone);
        expect(rep.status).toEqual(400);
    });

    it('should login', async () => {
        const res = await request
            .post(authURL + 'login')
            .send({
                username: 'bob@doe.com',
                password: '12345678Ae@',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('token');
        base.Authorization = `Bearer ${res.body.token}`;
        user = res.body.user;
    });
    it('should not have access until verified', async () => {
        const res = await request
            .post(authURL + 'requestVerification');
        expect(res.statusCode).toEqual(401);
        const obj = await db.User.findOne({where: {id: user.id}});
        expect(obj.isActive).toEqual(false);
    });

    it('should send otp', async () => {
        const token = await db.Token.findOne({where: {userId: user.id, type: 'email', value: user.email}});
        expect(token).toHaveProperty('token');
        user.emailOTP = token.token;
    });
    it('should resend email verification request', async () => {
        const res = await request
            .post(authURL + 'requestVerification' ).set(base);
        expect(res.statusCode).toEqual(200);
    });
    it('should send a different otp', async () => {
        const token = await db.Token.findOne({where: {userId: user.id, type: 'email', value: user.email}});
        expect(token).toHaveProperty('token');
        expect(user.emailOTP === token.token).toEqual(false);
        user.emailOTP = token.token;
    });

    it('should not verify wrong otp', async () => {
        const res = await request
            .get(authURL + `verify-email/${user.id}/23345343`);
        expect(res.statusCode).toEqual(404);
    });
    it('should verify otp', async () => {
        const res = await request
            .get(authURL + `verify-email/${user.id}/${user.emailOTP}`);
        expect(res.statusCode).toEqual(200);
        const obj = await db.User.findOne({where: {id: user.id}});
        expect(obj.isActive).toEqual(true);
    });
    it('should change password', async () => {
        const res = await request
            .post(authURL + 'changePassword')
            .send({
                newPassword: userPassword,
                oldPassword: '12345678Ae@',
            }).set(base);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('detail');
       
        let resp = await request
            .post(authURL + 'login')
            .send({
                username: user.email,
                password: '12345678Ae@',
            });
        expect(resp.statusCode).toEqual(400);
        // new password should work
        const respo = await request
            .post(authURL + 'login')
            .send({
                username: user.email,
                password: userPassword,
            });
        expect(respo.statusCode).toEqual(200);
    });
    it('should reset password', async () => {
        const res = await request
            .post(authURL + 'requestPasswordReset').send({email: user.email});
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('detail');
        const token = await db.Token.findOne({where: {userId: user.id, type: 'password-reset', value: user.email}});
        expect(token).toHaveProperty('token');
        user.emailOTP = token.token;

    });
    it('should set new password', async () => {
        const resp = await request
            .get(authURL + `passwordReset/${user.id}/${user.emailOTP}`);
        expect(resp.statusCode).toEqual(200);
        // const obj = await db.User.findByPk(user.id);
        const respo = await request
            .post(authURL + 'setPassword')
            .send({
                newPassword: '12345678Ae@',
                userId: user.id,
            });
        expect(respo.statusCode).toEqual(200);
        expect(respo.body).toHaveProperty('detail');

    });
    
    it('should not login with old password', async () => {
        let res = await request
            .post(authURL + 'login')
            .send({
                username: user.email,
                password: userPassword,
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');

    });
    it('should login with new password', async () => {
        const res = await request
            .post(authURL + 'login')
            .send({
                username: user.email,
                password: '12345678Ae@',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
