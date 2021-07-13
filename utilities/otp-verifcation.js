'use strict';
const winston = require('../src/services/winston');
const logger = new winston('OTP Verification');
const db = require('./../server/models');
let Otp = db.Token;


class OTPVerification {
    async generateOTP (num) {
        try {
            let exp = 10**6;
            if (num) exp = 10 ** num;
            return Math.floor(exp + Math.random() * 900000);
        } catch (e) {
            logger.error('Error generating OTP');
        }
    }
    async getOtps (query) {
        try {
            return await Otp.findAll({where: query});
        } catch (e) {
            logger.error('Error getting OTPs');
        }
    }
    async _expired(date, type){
        let time = type === 'email'? 3600 * 24 : 30 * 60;
        return (new Date().getTime() - new Date(date).getTime() )/ 3600 > time;
    }
    async saveOTP (user, type, otp) {
        try {
            user.verifyOtp = await Otp.findAll({where: {userId : user.id}});
            let userOtp = user.verifyOtp && user.verifyOtp.length > 0 ? user.verifyOtp.filter(t => t.type === type) : [];

            if (userOtp.length < 1 ) {
                userOtp = Otp.build();
            }
            else {
                userOtp = userOtp[0];
            }
            if (otp) {   
                otp = await this.generateOTP(8);
                userOtp.token = otp + ''; 
            }
            userOtp.type = type;
            userOtp.dateCreated = new Date();
            userOtp.verified = false;
            userOtp.userId = user.id;
            await userOtp.save();
            if (otp) return otp;
            return true;
        } catch (e) {
            logger.error('Error saving OTP', {error:e});
        }
    }
    
    async verifyOTP (user, type, res, otp) {
        let types = {phone: 'Phone', email: 'Email', 'password-reset': 'Password Reset'};
        let typeMessage = types[type] || '';
        try {
            user.verifyOtp = await Otp.findAll({where: {userId : user.id}});
            let userOtp = user.verifyOtp && user.verifyOtp.length > 0 ? user.verifyOtp.filter(t => t.type === type) : [];
            // if verified, user did not request verification. return 400
            

            if (userOtp.length < 1 || userOtp[0].verified) return res.processError(400, typeMessage + ' verification request not found');
            let message = typeMessage + ' verification successful';
            userOtp = userOtp[0];
            if (!this._expired(userOtp.dateCreated)) return res.processError(400, typeMessage + ' verification request has expired');
            if (!otp) {
                user.isActive = true;
                user.status = 'active';
                userOtp.verified = true;
                userOtp.save();
                await user.save();
                logger.success(typeMessage + ' verification', {userId: user.id});
                return message;
            } 
            else {
                if (userOtp.token === otp) {
                    user.isActive = true;
                    user.status = 'active';
                    userOtp.verified = true;
                    userOtp.save();
                    await user.save();
                    logger.success(typeMessage + ' verification', {userId: user.id});
                    if (type === 'password-reset') return {userId: userOtp.userId};
                    return message;
                }
                else {
                    return res.processError(404, typeMessage + ' - Invalid token or verification request has expired');
                }
            } 
        } catch (error) {
            logger.error( typeMessage + ' verification error', {error});
        }
    }
   

    

  

}




module.exports = new OTPVerification();