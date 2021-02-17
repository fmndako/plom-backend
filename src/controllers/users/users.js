const UserService = require('../../services/users.js');   
const winston = require('../../services/winston');
const db = require('../../../server/models');
const logger = new winston('User Management');
const { getClientId } = require('../../services/encrypt'); 

class UserController{
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
