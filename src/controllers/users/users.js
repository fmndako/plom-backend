const UserService = require('../../services/users.js');   
const winston = require('../../services/winston');
const db = require('../../../server/models');
const logger = new winston('User Management');
const { getClientId } = require('../../services/encrypt'); 

class UserController{
    async createLoanUser(req, res) {
        try {
            let {emails, firstName, numbers, lastName } = req.body;
            if ( !firstName ) return res.processError(400, 'Invalid request, all fields are required');
            let body = {emails, numbers, firstName, lastName};
            body.createdBySelf = false;
            let user = await UserService.createUser(body);
            let saved = await db.User.update(
                {'users': db.sequelize.fn('array_append', db.Sequelize.col('users'), user.id)},
                {'where': {'id': req.user.id}});
            if (!user) return res.processError(400, 'Error creating user');
            logger.success('Added new user', {userId: req.user.id});
            return res.status(201).send(user);
        } catch (error) {
            res.processError(400, 'Error creating user', error);
        }
    }

    async updateLoanUser(req, res) {
        try {
            let {emails, firstName, numbers, lastName } = req.body;
            let body = {emails, numbers, firstName, lastName};
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
            if(!req.user.users.includes(req.params.id)) return res.processError(400, 'User doesnt exist');
            let user = await db.User.destroy({where: {id: req.params.id}});
            let saved = await db.User.update(
                {'users': db.sequelize.fn('array_remove', db.Sequelize.col('users'), req.params.id)},
                {'where': {'id': req.user.id}});
            if (!user) return res.processError(400, 'Removed loan user');
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
            let { startDate, skipData, limitData } = req.query;
            // search.users = {[db.Sequelize.Op.contains]: req.user.users};
            let user = await db.User.findAll({where: {id: {[db.Sequelize.Op.in]: req.user.users}}});
            res.send(user);
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
