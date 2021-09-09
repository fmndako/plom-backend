const app = require('../app'); // Link to your server file
const supertest = require('supertest');
const request = supertest(app);

describe('App Endpoints', () => {
    it('should test that 1 + 1 === 2', () => {
        expect(2).toEqual(2);
    });
    it('gets the test endpoint', async done => {
        const response = await request.get('/');
        expect(response.statusCode).toEqual(200);
        done();
    });
});