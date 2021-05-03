const LoanService = require('../../services/loans'); 
const Op = require('../../../server/models').Sequelize.Op;
const db = require('../../../server/models');
const winston = require('../../services/winston');
const logger = new winston('Loan Management');
const { returnOnlyArrayProperties} = require('../../../utilities/helpers');

class LoanController{
    async getLoan(req, res) {
        try {
            let loan = await db.Loan.findOne({where: {deleted:{[Op.ne]: true} , id: req.params.id}, include: {model: db.Offset, as: 'offsets'}});
            if(!loan) throw Error();
            res.send(loan);
        }
        catch(error){
            res.processError(400, 'Error retrieving loan', error);
        }
    }
    async getLoans(req, res) {
        try {
            let {page, limit, offset, startDate, endDate, query, type,  } = req.processReq(req);
            let loans = await db.Loan.findAndCountAll({where: {deleted:{[Op.ne]: true}, userId: req.user.id}, 
                include: [
                    {model: db.Offset, as: 'offsets'}, 
                    {model: db.User, as: 'User', attributes: db.attributes.userShort}, 
                    {model: db.User, as: 'Lender', attributes: db.attributes.userShort}, 
                ],
                order:[['createdAt', 'DESC']]});
            loans.rows = loans.rows.splice(offset, limit);
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
            let lender = await db.User.findByPk(body.lender, {attributes: ['id', 'phoneNumber','email'], });
            if(!lender) return res.processError(400, 'lender cannot be null');
            let loan = await db.Loan.create(body);
            logger.success('Create Loan', {id: loan.id, userId:req.user.id});
            res.send(loan);//await db.Loan.findAll({where: {userId: req.user.id}}));
        }
        catch(error){
            res.processError(400, 'Error creating loan', error);
        }
    }
    async deleteLoan(req, res) {
        try{
            let loan = await db.Loan.findOne({where: {deleted:{[Op.ne]: true} , id: req.params.id}});
            if(!loan) return res.processError(400, 'Loan not found');
            loan.deleted = true;
            await loan.save();
            logger.success('Delete Loan', {userId:req.user.id, loanId: loan.id});
            return res.send({detail: 'app deleted'});
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
            logger.success('Update loan', {userId: req.user.id, loanId: loan.id});
            res.send(loan);
        } catch (error) {
            res.processError(400, 'Error updating user loan', error);
        }
    }
    
    async createOffset(req, res) {
        try {
            let body = returnOnlyArrayProperties(req.body, ['amount', 'remarks', 'date']);
            body.loanId = req.params.id;
            let offset = await db.Offset.create(body);
            logger.success('Added Offset', {id: req.params.id, userId:req.user.id,});
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
            logger.success('Delete Offset', {userId:req.user.id, loanId: req.params.id});
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
            logger.success('Update offset', {userId: req.user.id, loanId: req.params.id});
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


module.exports = new LoanController();
