const app = require('../app.js');
const request = require('supertest')(app);
const db = require('../server/models');
const url = '/api/v1/loans';
const { getUserDetails }  = require('./login');
let user, base;

const loanUser1 = { 
    'firstName': 'first loan user',
    'lastName': 'flu', 
    'numbers' : ['+07066177665523'],
    'emails': ['quickinfong11@gmail.com']
};
const loanUser2 = { 
    'firstName': 'second loan user',
    'lastName': 'slu', 
    'numbers' : ['+07066177665523'],
    'emails': ['quickinfong11@gmail.com']
};
const loan = {
    'amount': 200000,
    'duration': {
        'number' : 5,
        'period': 'Month'
    },
    'dateTaken': '2 Jun 2021',
    'repaymentType': 'once',
    
    'remarks': 'No remarks ru',
    'notify': true,
    'type': 'Lend',
    'userNotification': {
        'number': 5,
        'type': 'days',
        'frequency': 'weekly' 
    }
};

describe('LOAN API', () => {
    it('should set up a user', async () => {
        let login =  await getUserDetails();
        user = login.user;
        base = login.base;
        console.log(user, base);
        expect(1).toEqual(1);
    });
    it('should create loan user', async () => {
        const res = await request
            .post(url + '/users')
            .send(loanUser1).set(base);
        expect(res.status).toEqual(201);
        expect(res.body).toHaveProperty('id');
        loanUser1.id = res.body.id;
        const users = await db.User.findAll({where: {creatorId: user.id, type: 'private' }});
        // loanUser1.id = users[0].id;
        expect(users.length).toEqual(1);
    });
    it('should not create loan user - same email or phone number', async () => {
        const res = await request
            .post(url + '/users')
            .send(loanUser1).set(base);
        expect(res.status).toEqual(400);
    });
    it('should not create loan - repayment type and options validation ', async () => {
        loan.lender = loanUser1.id;
        let res = await request
            .post(url)
            .send(loan).set(base);
        expect(res.status).toEqual(400);

        loan.dateToRepay = '30 Sept 2021';
        res = await request
            .post(url)
            .send(loan).set(base);
        expect(res.status).toEqual(200);

        loan.repaymentType = 'several';
        res = await request
            .post(url)
            .send(loan).set(base);
        expect(res.status).toEqual(400);

        loan.amount = 300000;
        loan.repaymentOptions = {
            'amount': 5000,
            'period': 'weekly',
            'custom': false,
            'list': []
        };
        res = await request
            .post(url)
            .send(loan).set(base);
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.lender).toEqual(loanUser1.id);
        const loans = await db.Loan.findAll({where: {userId: user.id}});
        expect(loans.length).toEqual(2);
    });

    it('should fetch all loans', async () => {
        const res = await request
            .get(url).set(base);
        expect(res.status).toEqual(200);
        const ppty = ['records', 'currentPage', 'totalPages', 'returnedCount', 'totalCounts'];
        expect(res.body).toHaveProperty('records');
        expect(res.body.returnedCount).toEqual(2);
        const loanProperties = ['amount', 'Lender', 'User'];
        loanProperties.forEach(p => expect(res.body.records[0]).toHaveProperty(p));
        // const userProperties = ['fullname', 'type'];
        // userProperties.forEach(p => expect(res.body.records[0].User).toHaveProperty(p));
        // userProperties.forEach(p => expect(res.body.records[0].Lender).toHaveProperty(p));
        // const users = await db.User.findAll({where: {creatorId: user.id, type: 'private' }});
        // expect(users.length).toEqual(1);
    });

    it('should search all  users excluding self ', async () => {
        let search = '23';
        let res = await request
            .get(`/api/v1/users/search?query=${search}`).set(base);
        expect(res.status).toEqual(200);
        user.id;
        expect(res.body).toHaveProperty('records');
        let count = res.body.returnedCount;
        // expect(res.body.returnedCount).toEqual(3);

        // all users excluding private and self
        res = await request
            .get(`/api/v1/users/search?query=${search}&request=true`).set(base);
        expect(res.status).toEqual(200);
        user.id;
        expect(res.body).toHaveProperty('records');
        expect(res.body.returnedCount).toEqual(count - 1);
    });

    it('should request for loan', async () => {
        
        let partner = await db.User.findOne({where: {email: 'fmndako@gmail.com'}});
        loan.lender = partner.id;
        let res = await request
            .post(url + '/request').set(base).send(loan);
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('detail');

        // fetch loan
        res = await request
            .get(url + '/request').set(base);
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('records');
        // expect(res.body.records[0].isRequested).toBe(true);
        // expect(res.body.returnedCount).toEqual(1);
    });

    it('should approve for loan', async () => {
        let partner = await db.User.findOne({where: {email: 'fmndako@gmail.com'}});
        loan.lender = partner.id;
        let res = await request
            .post(url + '/request').set(base).send(loan);
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('detail');

        // fetch loan
        res = await request
            .get(url + '/request').set(base);
        expect(res.status).toEqual(200);
        expect(res.body.isRequested).toBe(true);
        expect(res.body).toHaveProperty('records');
        expect(res.body.returnedCount).toEqual(1);
    });
}
);
