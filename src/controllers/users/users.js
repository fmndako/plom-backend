'use strict';
const UserService = require('../../services/users.js');   
const winston = require('../../services/winston');
const db = require('../../../server/models');
const Op = db.Sequelize.Op;
const logger = new winston('User Management');
const { phoneNumberValidator } = require('../../../utilities/helpers');


class UserController{
    async createLoanUser(req, res) {
        try {
            let {emails, firstName, numbers, lastName} = req.body;
            if ( !firstName ) return res.processError(400, 'Invalid request, all fields are required');
            let body = {emails, numbers, firstName, lastName};
            if (typeof body.emails === 'string') body.emails = JSON.parse(body.emails);
            if (typeof body.numbers=== 'string') body.numbers = JSON.parse(body.numbers);
            let query = {creatorId: req.user.id};
            for (let n of body.emails){
                // if  (!phoneNumberValidator(n))return res.processError('400', 'Invalid emails');
                let users = await UserService.getRegisteredUsers('email', n, 'private', query);
                if (users.length > 0) return res.processError(400, 'User with email already exist, use the search function instead');
            }
            for (let n of body.numbers){
                if  (!phoneNumberValidator(n)) return res.processError('400', 'Invalid phone number');
                let users = await UserService.getRegisteredUsers('phoneNumber', n, 'private', query);
                if (users.length > 0) return res.processError(400, 'User with phone number already exist, use the search function instead');
            }
            body.type = 'private';
            let user = await UserService.createUser(body);
            if (!user) return res.processError(400, 'Error creating user');
            user.creatorId = req.user.id;
            await user.save();
            logger.success('Added new loan user', {userId: req.user.id});
            return res.status(201).send(user);
        } catch (error) {
            res.processError(400, 'Error creating user', error);
        }
    }

    async updateLoanUser(req, res) {
        try {
            let {emails, firstName, numbers, lastName } = req.body;
            let body = {emails, numbers, firstName, lastName};
            if (typeof body.emails === 'string') body.emails = JSON.parse(body.emails);
            if (typeof body.numbers=== 'string') body.numbers = JSON.parse(body.numbers);
            let query = {creatorId: req.user.id, id: {[Op.ne]: req.params.id}};
            for (let n of body.emails){
                // if  (!phoneNumberValidator(n))return res.processError('400', 'Invalid emails');
                let users = await UserService.getRegisteredUsers('email', n, 'private', query);
                if (users.length > 1) return res.processError(400, 'User with email already exist, use the search function instead');
            }
            for (let n of body.numbers){
                if  (!phoneNumberValidator(n)) return res.processError('400', 'Invalid phone number');
                let users = await UserService.getRegisteredUsers('phoneNumber', n, 'private', query );
                if (users.length > 1) return res.processError(400, 'User with phone number already exist, use the search function instead');
            }
            let user = await UserService.updateUser(req.params.id, body);
            if (!user) return res.processError(400, 'Error creating user');
            logger.success('Update loan user', {userId: req.user.id});
            return res.status(201).send(user);
        } catch (error) {
            res.processError(400, 'Error updating user', error);
        }
    }
    async deleteLoanUser(req, res) {
        try {
            let user = await db.User.destroy({where: {id: req.params.id, creatorId: req.user.id}});
            if (!user) return res.processError(400, 'User not found');
            logger.success('deleted user', {userId: req.user.id});
            return res.send({detail: 'user deleted successfully'});
        } catch (error) {
            res.processError(400, 'Error deleting user', error);
        }
    }
    async getUser(req, res) {
        try {
            let user = await UserService.getUser(req.user.id);
            res.send(user);
        }
        catch(error){
            res.processError(400, 'Error getting user');
        }
    }
    async getLoanUsers(req, res) {
        try {
            const search = {};
            let { startDate, skipData, limitData } = req.processReq();
            // search.users = {[db.Sequelize.Op.contains]: req.user.users};
            let user = await db.User.findAll({where: {creatorId: req.user.id}});
            res.send(user);
        }
        catch(error){
            res.processError(400, 'Error getting users', error);
        }
    }

    async searchUser(req, res) {
        try {
            let { page, limit, startDate, skipData, limitData,  } = req.processReq();
            let params = req.query.params;
            let search = `%${params}%`;
            let others = [ 
                { email: {[Op.iLike]: search}},
                { phoneNumber: {[Op.iLike]: search}},
                { verifiedEmails:  {[Op.contains]: [search]}},
                { verifiedNumbers: {[Op.contains]: `${search}`}}
            ];        
            let query = {};
            query.deleted = {[Op.ne]: true};
            query.createdBySelf = true;
            query[Op.or] = others;
            let user = await db.User.findAndCountAll({where: query});
            res.paginateRes(user, page, limit );
        }
        catch(error){
            res.processError(400, 'Error getting users', error);
        }
    }
    async updateUser(req, res) {
        try {
            let { salutation, gender, address, maritalStatus, bvn } = req.body;
            if ( !salutation || !gender || !address || !bvn ) res.processError(400, 'All fields are required');
            let body = { salutation, gender, address, maritalStatus, bvn, updatedProfile: true };
            let bvnIsValid = /^\d+$/.test(bvn);
            if (bvn.length !== 11 || !bvnIsValid) return res.processError(400, 'Invalid BVN number' );
            let user = await UserService.updateUser(req.user.id, body);
            logger.success('Updated user profile', {userId: req.user.id});
            res.send(user);
        } catch (error) {
            res.processError(400, 'Error updating user');
        }
    }
    
    async changeStatus(req, res) {
        try {
            let status = req.body.status === 'active' ? true : false;
            let user = await UserService.updateUser(req.user.id, {isActive: status});
            res.send(user);
        } catch (error) {
            res.processError(400, 'Error changing user status');
        }
    }
    async acceptTerms(req, res) {
        try {
            if (req.user.acceptedTerms) return res.processError(400, 'Already accepted terms and conditions');
            req.user.acceptedTerms = true;
            await req.user.save();
            res.send({detail: 'Terms and conditions accepted'});
        } catch (error) {
            res.processError(400, 'Error accepting terms');
        }
    }
}

module.exports = new UserController();
