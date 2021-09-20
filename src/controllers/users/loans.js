const Op = require('../../../server/models').Sequelize.Op;
const db = require('../../../server/models');
const winston = require('../../services/winston');
const logger = new winston('Loan Management');
const { returnOnlyArrayProperties, sumArray } = require('../../utilities/helpers');
const loanField = ['amount', 'type', 'notify', 'duration', 'options', 'userNotification', 'dateToRepay', 'dateTaken', 'repaymentType','lender', 'remarks', 'repaymentOptions', 'duration', 'security'];
const EmailService = require('../../services/email');
const appRoot = require('app-root-path');
const defaultTemplates = require(appRoot + '/templates');
const Handlebars = require('express-handlebars').create();
let requestEmailTemplate = defaultTemplates.request;
const frontendUrl = process.env.FRONTEND_URL;

async function getLoan(req, res) {
    try {
        let loan = await db.Loan.findOne({where: {deleted:{[Op.ne]: true} , id: req.params.id}, 
            include: [
                {model: db.Offset, as: 'offsets'}, 
                {model: db.User, as: 'User', attributes: db.attributes.userShort}, 
                {model: db.User, as: 'Lender', attributes: db.attributes.userShort}, 
            ],});
        if(!loan) throw Error();
        processLoan(loan, req.user.id, null, loan.isOwner(req.user.id));
        if (!res) return loan;
        res.send(loan);
    }
    catch(error){
        if (!res) throw 'Error getting loan';
        res.processError(400, 'Error retrieving loan', error);
    }
}
async function getLoans(req, res) {
    try {
        let {page, limit, offset, startDate, endDate, type,  } = req.processReq();
        let request = req.query.request;
        let lender = req.query.lender;
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
        let query = {
            [Op.and]: [{
                [Op.or]: [{userId:req.user.id}, {lender: req.user.id}],}, 
            {[Op.or]: [ 
                {[Op.and] : [{userId:req.user.id}, {deleted: false}],}, 
                {[Op.and] : [{lender:req.user.id}, {lenderDeleted: false}],}, 
            ]}
            ]
        };
        if (request === true){
            query.approvalStatus = {[Op.in]: ['pending', 'rejected']};
        } else {
            query.approvalStatus = {[Op.or]: [{[Op.eq]: null,}, {[Op.eq]: 'approved' }]}; 
        }
        if (lender){
            req.query.lender = lender;
        }
        if (req.query.type && queryObj[req.query.type]) query = {...query, ...queryObj[req.query.type]};
        console.log(query);
        if (req.query.active === 'true'){
            query.cleared = {[Op.ne]: true};
        } else if (req.query.active === 'false'){
            query.cleared = true;
        }
        let loans = await db.Loan.findAndCountAll({where: query, 
            include: [
                {model: db.Offset, as: 'offsets'}, 
                {
                    model: db.User, 
                    as: 'User', 
                    attributes: db.attributes.userShort,
                    // include: [
                    //     {
                    //         model: db.UserConfig
                    //     }
                    // ]

                }, 
                {model: db.User, as: 'Lender', attributes: db.attributes.userShort}, 
            ],
            order:[['createdAt', 'DESC']]});
                
        for (let loan of loans.rows){
            processLoan(loan, req.user.id, reminderDays, loan.isOwner(req.user.id));
        }
        // loans.rows = loans.rows.splice(offset, limit);
        res.paginateRes(loans, page, limit );
    }
    catch (error) {
        res.processError(400, 'Error fetching user loans', error);
    }
}
async function createLoan(req, res) {
    try {
        let body = returnOnlyArrayProperties(req.body, loanField);
        body.userId = req.user.id;
        if(!body. lender) throw 'Please enter user details';
        let lender = await db.User.findByPk(body.lender, {attributes: db.attributes.user,});
        if(!lender) throw 'lender cannot be null';
        if(!res) {
            body.approvalStatus = 'pending';
            body.dateRequested = new Date();
            body.type = 'Borrow';
        }
        if (!['once', 'several'].includes(body.repaymentType)) throw 'Select repayment type - once or several';
        if (body.repaymentType === 'once' && !body.dateToRepay) throw 'Repayment date is required';
        if (body.repaymentType === 'several' && !body.repaymentOptions) throw 'Repayment options is required';
    
        if (body.repaymentOptions
            && body.repaymentOptions.custom  
            && (!body.repaymentOptions.list || 
                ( body.repaymentOptions.list && !body.repaymentOptions.list.length )))  
            throw 'Repayment option custom list can not be empty';
  
        let loan = await db.Loan.create(body);
        loan.dataValues.Lender = lender;
        
        req.params.id = loan.id;
        if(!res) return await getLoan(req);
        logger.success('Create Loan', {objectId: loan.id, userId:req.user.id});
        res.send({detail: 'Add loan successful'});
    } 
    catch(error){
        if(!res) throw error;
        res.processError(400, typeof error === 'string'? error : 'Error creating loan', error);
    }
}
async function deleteLoan(req, res) {
    try{
        let ids = req.params.id ? [req.params.id] : (req.query.ids? req.query.ids.split(','): []);
        if(!ids && !ids.length) return res.processError(400, 'Loan(s) cannot be null');
        let loans = await db.Loan.findAll({where: {deleted:{[Op.ne]: true} , id: {[Op.in]: ids}}, 
            include: [
                {model: db.User, as: 'Lender', attributes: db.attributes.user}, 
            ],});
        if(!loans.length) return res.processError(400, 'Loan(s) not found');
        loans.forEach(l => {
            if(l.isOwner(req.user.id)) {
                if (!l.Lender.createdBySelf) l.destroy();
                else l.deleted = true;
            } 
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
async function updateLoan(req, res) {
    try {
        let loan = await db.Loan.findOne({where: {deleted:{[Op.ne]: true} , id: req.params.id}});
        if (!loan) throw 'Loan not found';
        if (req.user.id !== loan.userId) throw 'Not allowed';
        if (loan.approvalStatus && (res || loan.approvalDate)) throw 'Not allowed';
        let body = returnOnlyArrayProperties(req.body, loanField );
        Object.keys(body).forEach(k => {
            loan[k] = body[k];
        });
        await loan.save();
        if (!res) return loan;
        logger.success('Update loan', {userId: req.user.id, objectId: loan.id});
        res.send(loan);
    } catch (error) {
        if (!res) throw error;
        res.processError(400, 'Error updating user loan', error);
    }
}
async function clearLoan(req, res) {
    try {
        let body = returnOnlyArrayProperties(req.body, ['date']);
        let loan = await db.Loan.findOne({where: {deleted:{[Op.ne]: true} , id: req.params.id}});
        let obj = { dateCleared: new Date(body.date), cleared: true};
        let query;
        if (loan.isOwner(req.user.id)) {
            query = {userCleared: obj};
        } else  query = {lenderCleared: obj};
        let l = await db.Loan.update( 
            query,
            { where: { id: req.params.id } }
        );
        logger.success('Loan Cleared', {objectId: req.params.id, userId:req.user.id,});
        res.send({detail: 'Loan cleared successfully'});
    }
    catch(error){
        res.processError(400, 'Error clearing loan', error);
    }
}

async function createOffset(req, res) {
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

async function requestLoan(req, res) {
    try {
        
        let loan = await createLoan(req, null);
        await sendRequestMail(loan, loan.Lender.email, true);
        logger.success('Loan request sent', {objectId: loan.id, userId:req.user.id,});
        logger.success('Loan request received', {objectId: loan.id, userId:req.body.lender});
        res.send({detail: 'Loan request sent successfully'});
    }
    catch(error){
        res.processError(400, 'Error requesting loan', error);
    }
}

async function approveLoan(req, res) {
    try {
        let query = {deleted:{[Op.ne]: true} , id: req.params.id};
        if(!req.user){
            query.lender = req.params.userId;
        } else query.lender = req.user.id; 
        let lo = await getLoan(req);
        let loan = await db.Loan.findOne({where: query}); 
        if(!loan) throw 'Error, loan request not found';
        loan.approvalStatus = req.params.type;
        loan.approvalComments = req.body.remarks;
        await loan.save();
        sendRequestMail(loan, loan.User.email, false, req.params.type, false);
        sendRequestMail(loan, loan.Lender.email, false, req.params.type, true);
        logger.success(`${loan.approvalStatus} loan request`, {objectId: loan.id, userId:req.params.lender || req.user.id,});
        res.send({detail: `Loan request ${loan.approvalStatus} sucessfully`});
    }
    catch(error){
        res.processError(400, error, error);
    }
}


async function updateRequest(req, res) {
    try {
        let loan = await updateLoan(req, null);
        //send notification to lender of loan request if not approved;
        logger.success('Loan request updated', {objectId: loan.id, userId:req.user.id,});
        res.send({detail: 'Loan request updated successfully'});
    }
    catch(error){
        res.processError(400, 'Error requesting loan', error);
    }
}
    
async function deleteRequest(req, res) {
    try {
        let query = {deleted:{[Op.ne]: true} , id: req.params.id};
        let loan = await db.Loan.findOne({where: query}); 
        if (!loan) throw 'Loan not found';
        if (!loan.approvalStatus) throw 'Not Allowed';
        if (loan.approvalDate) throw 'Loan already approved, delete loan instead';
        await loan.destroy();
        //send notification to lender of loan request if not approved;
        logger.success('Loan request deleted', {objectId: loan.id, userId:req.user.id,});
        logger.success('Loan request cancelled by requester', {objectId: loan.id, userId:loan.lender,});
        res.send(loan);
    }
    catch(error){
        res.processError(400, 'Error deleting loan request', error);
    }
}

async function getRequests(req, res){
    req.query.request = true;
    return getLoans(req, res);
}
async function deleteOffset(req, res) {
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
async function updateOffset(req, res) {
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
async function processLoan(loan, id, reminderDays, isOwner){
    if(!reminderDays) {
        let userConfig = await db.UserConfig.findOne({where: {userId: id}});
        reminderDays = userConfig &&  userConfig.reminderDays ? userConfig.reminderDays : 7; 
    }
    let bal, status;
    if (!loan.cleared && loan.offsets && loan.offsets.length) bal = loan.amount - sumArray(loan.offsets, 'amount');
    //status =  getLoanStatus(loan, reminderDays);
    loan.dataValues.User.fullname = getUserNames(loan.dataValues.User);
    loan.dataValues.Lender.fullname = getUserNames(loan.dataValues.Lender);
    loan.dataValues.status = status;
    loan.dataValues.bal = bal;
    loan.dataValues.isOwner = isOwner;
    let isRequest = loan.dataValues.dateRequested;
    let isLender = isRequest && !isOwner;
    let isApproved = loan.dataValues.dateApproved;
    let isPrivate = loan.Lender.type === 'private';
    let isCoop = loan.Lender.type === 'coop';
    loan.dataValues.isCoop = isCoop;
    loan.dataValues.isRequested = isRequest;
    loan.dataValues.canDelete = isPrivate;
    loan.dataValues.canEdit = isPrivate;
    loan.dataValues.canCancel = isRequest && !isApproved;
    loan.dataValues.canOffset =  isPrivate || (!isPrivate && isLender);
    loan.dataValues.canClear = (isPrivate && !loan.userCleared) ||   (!isCoop && ((isOwner && !loan.userCleared) || (!isOwner && !loan.lenderCleared)));// || (isCoop && !loan.cleared);
    // loan.dataValues.canMarkAsCompleted = isCoop && loan.status === 'cleared';
    
}

function sendRequestMail(loan, email, request, type, self, cancelled){
    try {
        let rejected = type === 'reject';
        let approved = type === 'approve';

        let rejectLink = `${process.env.BACKEND_URL}noauth/loans/request/${loan.id}/${loan.lender}/reject`;
        let approveLink = `${process.env.BACKEND_URL}noauth/loans/request/${loan.id}/${loan.lender}/approve`;
        let fullname = loan.User.firstName + ' ' + loan.User.lastName;
        let lender = loan.Lender.firstName + ' ' + loan.Lender.lastName;
        let variables = {
            ...loan.dataValues, fullname, lender, ...loan.User.dataValues,
            rejectLink,
            // duration: `${loan.dataValues.duration.number} ${loan.dataValues.duration.period}`,
            approveLink,
            frontendUrl, 
            self, 
            rejected, 
            request,  
            approved, 
            cancelled,
            once: loan.repaymentType === 'once',
            
        };
        let mailTemplate;
        mailTemplate = Handlebars._compileTemplate(requestEmailTemplate);
        let mailContent = mailTemplate(variables);
            
        let payload = {
            subject: 'Loan Request',
        };
        return EmailService.sendEmail(email, payload, mailContent );
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

function getLoanStatus(loan, reminderDays){
    if (loan.repaymentType === 'once') {
        let status;
        if(loan.cleared) status = 'Cleared';
        else if  (loan.dateToRepay <= new Date().addPeriod('Days', reminderDays).endOf('day') && loan.dateToRepay > new Date().endOf('day') ){
            status = 'Due Soon';
        } else if (loan.dateToRepay >= new Date().startOf('day') && loan.dateToRepay <= new Date().endOf('day')  ){
            status = 'Due Today';
        } else if (loan.dateToRepay < new Date().startOf('day')  ){
            status = 'Over Due';
        } else status = 'Active';
        return status;
    } else {
        return 'In progress';


    }    
}
function getUserNames(user){
    if (user.type !== 'cooperative'){
        return `${user.firstName} ${user.lastName}`;
    } 
    return 'Cooperative';
}
module.exports = {
    getLoan, getLoans, createLoan,
    deleteLoan, updateLoan, 
    clearLoan, createOffset, requestLoan, getRequests, 
    approveLoan,
    updateRequest, deleteRequest,  deleteOffset, updateOffset,
    processLoan
};