const LoanService = require('../../services/loans'); 
const Op = require('../../../server/models').Sequelize.Op;
const db = require('../../../server/models');
const winston = require('../../services/winston');
const logger = new winston('Loan Management');
const { returnOnlyArrayProperties, sumArray } = require('../../../utilities/helpers');

class LoanController{
    async getLoan(req, res) {
        try {
            let loan = await db.Loan.findOne({where: {deleted:{[Op.ne]: true} , id: req.params.id}, 
                include: [
                    {model: db.Offset, as: 'offsets'}, 
                    {model: db.User, as: 'User', attributes: db.attributes.userShort}, 
                    {model: db.User, as: 'Lender', attributes: db.attributes.userShort}, 
                ],});
            if(!loan) throw Error();
            processLoan(loan, req.user.id);
            res.send(loan);
        }
        catch(error){
            res.processError(400, 'Error retrieving loan', error);
        }
    }
    async getLoans(req, res) {
        try {
            let {page, limit, offset, startDate, endDate, type,  } = req.processReq(req);
            let userConfig = await db.UserConfig.findOne({where: {userId: req.user.id}});
            let reminderDays = userConfig &&  userConfig.reminderDays ? userConfig.reminderDays : 7;
            let queryObj = { 
                'All Loans': {},
                'Lend': {type:'Lend'}, 
                'Borrow': { type:'Borrow'}, 
                'Due Soon': {dateToRepay: {[Op.lte]: new Date().addPeriod('Days', reminderDays).endOf('day'), [Op.gt]: new Date().endOf('day')} },
                'Due Today':  {dateToRepay: {[Op.gte]: new Date().startOf('day'), [Op.lte]: new Date().endOf('day')} },
                'Over Due': {dateToRepay: {[Op.lt]: new Date().startOf('day'),}}, 
                'Due Loans': {dateToRepay: {[Op.lt]: new Date().addPeriod('Days', reminderDays).endOf('day')}},
            };
            let query = {};
            if (req.query.type && queryObj[req.query.type]) query = queryObj[req.query.type];
            console.log(query);
            if (req.query.active === 'true'){
                query.cleared = {[Op.ne]: true};
            } else if (req.query.active === 'false'){
                query.cleared = true;
            }
            query.deleted = {[Op.ne]: true};
            query.userId = req.user.id;
            console.log(query);
            let loans = await db.Loan.findAndCountAll({where: query, 
                include: [
                    {model: db.Offset, as: 'offsets'}, 
                    {model: db.User, as: 'User', attributes: db.attributes.userShort}, 
                    {model: db.User, as: 'Lender', attributes: db.attributes.userShort}, 
                ],
                order:[['createdAt', 'DESC']]});
                
            for (let loan of loans.rows){
                processLoan(loan, null, reminderDays);
            }
            // loans.rows = loans.rows.splice(offset, limit);
            res.paginateRes(loans, page, limit );
        }
        catch (error) {
            res.processError(400, 'Error fetching user loans', error);
        }
    }
    async createLoan(req, res) {
        try {
            let body = returnOnlyArrayProperties(req.body, ['amount', 'type', 'notify', 'dateToRepay', 'dateTaken', 'repaymentOption','lender', 'remarks']);
            body.userId = req.user.id;
            if(!body.lender) return res.processError(400, 'Please enter lender/borrower details');
            let lender = await db.User.findByPk(body.lender, {attributes: db.attributes.user,});
            if(!lender) return res.processError(400, 'lender cannot be null');
            let loan = await db.Loan.create(body);
            logger.success('Create Loan', {objectId: loan.id, userId:req.user.id});
            loan.dataValues.Lender = lender;
            res.send(loan);//await db.Loan.findAll({where: {userId: req.user.id}}));
        } 
        catch(error){
            res.processError(400, 'Error creating loan', error);
        }
    }
    async deleteLoan(req, res) {
        try{
            let ids = req.params.id ? [req.params.id] : (req.query.ids? req.query.ids.split(','): []);
            if(!ids && !ids.length) return res.processError(400, 'Loan(s) cannot be null');
            let loans = await db.Loan.findAll({where: {deleted:{[Op.ne]: true} , id: {[Op.in]: ids}}});
            if(!loans.length) return res.processError(400, 'Loan(s) not found');
            loans.forEach(l => {
                if(req.user.id === l.userId) l.deleted = true;
                else l.lenderDeleted = true;
                l.save();
                logger.success('Delete Loan', { objectId: l.id, userId:req.user.id,});
            });
            return res.send({detail: 'Delete successful'});
        }
        catch(error){
            res.processError(400, 'Error deleting loan', error);
        }
    }
    async updateLoan(req, res) {
        try {
            let loan = await db.Loan.findOne({where: {deleted:{[Op.ne]: true} , id: req.params.id}});
            if (!loan) return res.processError(400, 'Loan not found');
            let body = returnOnlyArrayProperties(req.body, ['amount', 'type', 'notify', 'dateToRepay', 'dateTaken', 'repaymentOption','lender', 'remarks']);
            Object.keys(body).forEach(k => {
                loan[k] = body[k];
            });
            await loan.save();
            logger.success('Update loan', {userId: req.user.id, objectId: loan.id});
            res.send(loan);
        } catch (error) {
            res.processError(400, 'Error updating user loan', error);
        }
    }
    

    async clearLoan(req, res) {
        try {
            let body = returnOnlyArrayProperties(req.body, ['date']);
            await db.Loan.update(
                { dateCleared: body.date, cleared: true},
                { where: { id: req.params.id } }
            );
            logger.success('Loan Cleared', {objectId: req.params.id, userId:req.user.id,});
            res.send({detail: 'Loan cleared successfully'});
        }
        catch(error){
            res.processError(400, 'Error adding offset', error);
        }
    }

    async createOffset(req, res) {
        try {
            let body = returnOnlyArrayProperties(req.body, ['amount', 'remarks', 'date']);
            body.loanId = req.params.id;
            let offset = await db.Offset.create(body);
            logger.success('Added Offset', {objectId: req.params.id, userId:req.user.id,});
            res.send(offset);
        }
        catch(error){
            res.processError(400, 'Error adding offset', error);
        }
    }
    async deleteOffset(req, res) {
        try{
            let offset = await db.Offset.destroy({where: {id: req.params.offsetId}});
            if(!offset) return res.processError(400, 'Offset not found');
            logger.success('Delete Offset', {userId:req.user.id, objectId: req.params.id});
            return res.send({detail: 'offset deleted'});
        }
        catch(error){
            res.processError(400, 'Error deleting offset', error);
        }
    }
    async updateOffset(req, res) {
        try {
            let offset = await db.Offset.findOne({where: {id: req.params.offsetId}});
            if (!offset) return res.processError(400, 'Offset not found');
            let body = returnOnlyArrayProperties(req.body, ['amount', 'date', 'remarks']);
            Object.keys(body).forEach(k => {
                offset[k] = body[k];
            });
            await offset.save();
            logger.success('Update offset', {userId: req.user.id, objectId: req.params.id});
            res.send(offset);
        } catch (error) {
            res.processError(400, 'Error updating user offset', error);
        }
    }
    // async confirmKeys(req, res) {
    //     try {
    //         let loan = await db.loans.findByPk(req.params.id);
    //         if (!loan) return res.processError(404, 'Loan does not exist');
    //         if(loan.keysConfirmed) return res.processError(404, 'Loan keys already confirmed');
    //         let matched = encryptService.compareKeys(req.body.secretKey, loan.keys);
    //         if (!matched) return res.processError(400, 'Keys do not match');
    //         loan.keysConfirmed = true;
    //         loan.save();
    //         logger.success('Confirm loan keys', {userId: req.user.id, loanId: loan.id});
    //         return res.send(
    //             {detail: 'keys confirmed'});
    //     } catch (error) {
    //         res.processError(400, 'Error confirming loan key');
    //     }
    // }
    // async getLoanSubscriptions(req, res) {
    //     try {
    //         let loan = await LoanService.getLoan(req.params.id);
    //         if (!loan) return res.processError(404, 'loan does not exist');
    //         let subscriptions = await loan.getSubscriptions();
    //         return res.send(subscriptions);
    //     } catch (error) {
    //         res.processError(400, 'Error getting loan subscriptions');
    //     }
    // }
    // async resetSubscriptions(req, res) {
    //     try {
    //         let loan = await LoanService.getLoan(req.params.id);
    //         if (!loan) return res.processError(404, 'loan does not exist');
    //         await LoanService.resetSubscriptions(loan.id);
    //         logger.success('Reset Loan subscriptions', {userId: req.user.id, loanId: loan.id});
    //         return res.send({detail: 'Loan subscriptions reset successful'});
    //     } catch (error) {
    //         res.processError(400, 'Error resetting loan subscriptions');
    //     }
    // }
    // async subscribe(req, res) {
    //     try {
    //         let loan = await LoanService.getLoan(req.params.id);
    //         if (!loan) return res.processError(404, 'loan does not exist');
    //         let subscription = await SubscriptionService.getSubscription(req.body.subscriptionId);
    //         if (!subscription) throw new Error();
    //         let action;
    //         if (req.params.subscribe === 'subscribe'){
    //             loan = await LoanService.subscribe(loan.id, subscription.id);
    //             action= 'Subscribed to subscription: '; 
    //         } else {
    //             loan = await LoanService.unsubscribe(loan.id, subscription.id);
    //             action= 'Unsubscribed from subscription: '; 

    //         }
    //         if (!loan) throw Error();
    //         let subs = await loan.getSubscriptions();
    //         logger.success(action + subscription.name, {userId: req.user.id, loanId: loan.id});
    //         return res.send(subs);
    //     } catch (error) {
    //         res.processError(400, 'Loan subscription error');
    //     }
    // }
}
async function processLoan(loan, id, reminderDays){
    if(!reminderDays) {
        let userConfig = await db.UserConfig.findOne({where: {userId: id}});
        reminderDays = userConfig &&  userConfig.reminderDays ? userConfig.reminderDays : 7; 
    }
    let bal, status;
    if (!loan.cleared && loan.offsets && loan.offsets.length) bal = loan.amount - sumArray(loan.offsets, 'amount');
    if(loan.cleared) status = 'Cleared';
    else if (loan.dateToRepay <= new Date().addPeriod('Days', reminderDays).endOf('day') && loan.dateToRepay > new Date().endOf('day') ){
        status = 'Due Soon';
    } else if (loan.dateToRepay >= new Date().startOf('day') && loan.dateToRepay <= new Date().endOf('day')  ){
        status = 'Due Today';
    } else if (loan.dateToRepay < new Date().startOf('day')  ){
        status = 'Over Due';
    } else status = 'Active';
    loan.dataValues.status = status;
    loan.dataValues.bal = bal;
}

module.exports = new LoanController();
