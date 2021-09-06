const app = require('../app.js');
const request = require('supertest')(app);

describe('User API', () => {
    it('should create a new user', async done => {
        const res = await request
            .post('/api/v1/auth/register')
            .send({
                firstName: 'Bob',
                lastName: 'Doe',
                email: 'bob@doe.com',
                password: '12345678Ae@',
                phoneNumber: '+578912345678'
            });
        expect(res.status).toEqual(201);
        expect(res.body).toHaveProperty('detail');
        done();
    });
    // it('should update a user', async () => {
    //     const res = await request(app)
    //         .put('/api/users/3')
    //         .send({
    //             firstName: 'Bob',
    //             lastName: 'Smith',
    //             email: 'bob@doe.com',
    //             password: 'abc123'
    //         });
    //     expect(res.statusCode).toEqual(200);
    //     expect(res.body).toHaveProperty('user');
    // }),
    // it('should delete a user', async () => {
    //     const res = await request(app)
    //         .del('/api/users/3');
    //     expect(res.statusCode).toEqual(204);
    // });
    // it('should show all users', async () => {
    //     const res = await request(app).get('/api/users');
    //     expect(res.statusCode).toEqual(200);
    //     expect(res.body).toHaveProperty('users');
    // }),
    // it('should show a user', async () => {
    //     const res = await request(app).get('/api/users/3');
    //     expect(res.statusCode).toEqual(200);
    //     expect(res.body).toHaveProperty('user');
    // });
});