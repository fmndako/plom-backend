const UserService = require('../../services/users.js');   
const winston = require('../../services/winston');
const db = require('../../../server/models');
const logger = new winston('User Management');
const { getClientId } = require('../../services/encrypt'); 

class UserController{
    async createLoaner(req, res) {
        try {
            let {email, firstName, lastName } = req.body;
            if (!email || !password) return res.processError(400, 'Invalid request, all fields are required');
            if (!loginMethod && ( !firstName || !lastName )) return res.processError(400, 'Invalid request, all fields are required');
            let valid = await checkPassword(password);
            if(!valid) return res.processError(400, 'Password must be minimum of 8 characters, contain both lower and upper case, number and special characters');
            
            let body = {email, password, firstName, acceptedTerms:true, lastName, loginMethod, phoneNumber : loginMethod ? req.body.phoneNumber : ''};
            if (!loginMethod){
                let users = await UserService.getUsers({email:email});
                if (users.length > 0) return res.processError(400, 'User with email already exist');
            }
            body.status = 'inactive';
            let user = await UserService.createUser(body);
            if (!user) return res.processError(400, 'Error creating user');
            let otp = await OTPUtils.saveOTP(user, 'email', 'true');
            let url = frontendUrl;
            url = `${url}/verifyEmail?ref=${user.id}&token=${otp}`;
            _sendEmailVerificationMail(user, url, 'Email Verification');
            // user.url = url;
            logger.success('Sign up', {userId: user.id});
            return res.status(201).send(user);
        } catch (error) {
            res.processError(400, 'Error creating user', error);
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
    async getUsers(req, res) {
        try {
            const search = {};
            let { startDate, skipData, limitData } = req.query;
            let endDate = req.query.endDate;

            if (startDate && endDate) {
                endDate = new Date(endDate);
                endDate.setDate(endDate.getDate() + 1);
                
            } else {
                endDate = new Date();
                startDate = new Date();
                startDate.setDate(endDate.getDate() - 7);
            }
            search.dateCreated = {
                $gte: new Date(startDate),
                $lte: endDate
            };
            let user = await UserService.getUsers(search, skipData, limitData);
            res.send(user);
        }
        catch(error){
            res.processError(400, 'Error getting users');
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
