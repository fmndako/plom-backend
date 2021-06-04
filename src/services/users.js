'use strict';
// let User = require('../models/users');
const db = require('../../server/models/index');
const Op = db.Sequelize.Op;
let User = db.User;
const bcrypt = require('bcryptjs');
const { returnOnlyArrayProperties } = require('../../utilities/helpers');

class UserService {
    async getUser (userId) {
        let query = {id: userId, deleted:{[Op.ne]: true}};
        let user = await User.findOne({where: query, attributes: db.attributes.user
        });
        return user;
    }
    async getUsers (query, page, limit) {
        try {
            query.deleted = {[Op.ne]: true};
            return await User.findAll({where: query, attributes: db.attributes.user, order: [['createdAt', 'DESC']]});
        } catch (e) {
            throw new Error(e);
        }
    }
    async createUser (body) {
        try{
            // console.log(body);
            let user = await User.create(body);  
            return returnOnlyArrayProperties(user, db.attributes.user, true);     
        }
        catch(err){
            throw new Error(err);
        }
    }

    async updateUser (userId, body) {
        let user = await User.findByPk(userId);
        if (body.password) body.password = await bcrypt.hash(body.password, 8);
        Object.keys(body).forEach(k => {
            user[k] = body[k];
        });
        user = await user.save();
        return returnOnlyArrayProperties(user, db.attributes.user, true);     

    }

    async deleteUser (userId){
        let user = await User.findByPk(userId);
        if(user) throw Error();
        user.deleted = true;
        await user.save();
    }

    async verifyUser(value, password){
        let user;
        user = await User.findAll({where: {deleted: {[Op.ne]: true}, email: value, loginMethod: {[db.Sequelize.Op.ne]: 'phoneNumber'}}} );
        if(user.length < 1) user = await User.findAll({where: {deleted: {[Op.ne]: true}, phoneNumber: value, loginMethod: 'phoneNumber'}} );
        if (user.length < 1) {
            throw new Error('Invalid username or password');
        }
        user = user[0];
        // if (user.accountLocked && withinLockedHours(user.timeLocked)) throw new Error('Account has been blocked. Try again in a few hours');
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error('Invalid username or password');

            // if(!user.attemptCount || user.attemptCount < 5) {
            //     user.attemptCount = user.attemptCount + 1;
            //     user.save();
            //     throw new Error(`Invalid username or password, you have ${5- user.attemptCount} attempts left`);
            // } else { 
            //     user.attemptCount = 0;
            //     user.accountLocked = true;
            //     user.timeLocked = new Date();
            //     user.save();
            //     throw new Error('Account has been blocked. Try again in a few hours');
            // }
        }
        // if (user.attemptCount || user.accountLocked) {
        //     user.attemptCount = 0;
        //     user.accountLocked = false;
        //     user.save();
        // }
        return user;
    }

    async generateToken(user){
        let u = await User.generateToken(user);
        return u;
    }
}


function withinLockedHours(dt1){
    let diff =(new Date().getTime() - dt1.getTime()) / 1000;
    let minutes = (process.env.LOCK_HOURS || 2 ) * 60 * 60;
    return diff < minutes;
}

module.exports = new UserService();