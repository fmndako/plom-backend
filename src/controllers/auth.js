
'use strict';
const db = require('../../server/models');
const winston = require('../services/winston');
const logger = new winston('User Management');
const EmailService = require('../services/email');
const OTPUtils = require('../../utilities/otp-verifcation');
const appRoot = require('app-root-path');
const defaultTemplates = require(appRoot + '/templates');
const Handlebars = require('express-handlebars').create();
const jwt = require('jsonwebtoken');
const { returnOnlyArrayProperties } = require('../../utilities/helpers');
let signupEmailTemplate = defaultTemplates.signup;
let passwordEmailTemplate = defaultTemplates.password;
const frontendUrl = process.env.FRONTEND_URL;
const UserService = require('../services/users');


class UserController {
    async signup (req, res) {
        try {
            let {email, password, firstName, lastName, accountNumber, loginMethod} = req.body;
            if (!email || !password) return res.processError(400, 'Invalid request, all fields are required');
            if (!loginMethod && ( !firstName || !lastName )) return res.processError(400, 'Invalid request, all fields are required');
            let valid = await checkPassword(password);
            if(!valid) return res.processError(400, 'Password must be minimum of 8 characters, contain both lower and upper case, number and special characters');
            
            let body = {email, password, firstName, acceptedTerms:true, lastName, accountNumber, loginMethod, phoneNumber : loginMethod ? req.body.phoneNumber : ''};
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
    async login (req, res ) {
        try {
            const { username, password} = req.body;
            if(!username || !password) return res.processError(400, 'Enter both user name and password');
            let user;
            user = await UserService.verifyUser(username, password);
            if (!user) {
                return res.processError(404, 'Invalid email or password');
            }
            let token = jwt.sign({id: user.id}, process.env.JWT_KEY );
            user.token = token;
            user.tokenCreatedAt = new Date();
            await user.save();
            user = returnOnlyArrayProperties(user, db.attributes.user, true);
            logger.success('Log in', {userId: user.id});
            res.send({ user, token });
        } catch (error) {
            res.processError(400, error);
        }     
    }
    async logout (req, res) {
        try {
            req.user.token = '';
            await req.user.save();
            logger.success('Log out', {userId: req.user.id});
            res.send({detail: 'Logout successful'});
        } catch (error) {
            res.processError(400, error);
        }
    }    
    // async requestEmailVerificationOtp (req, res){
    //     try {
    //         let user = await UserService.getUser(req.user.id);
    //         let otp = await OTPUtils.saveOTP(user, 'email');
    //         _sendEmailVerificationMail(user, otp, 'email');
    //         res.send({otp});
    //     } catch (error) {
    //         res.processError(400, error);
    //     }
    // }
    async requestEmailVerificationLink(req, res){
        try {
            let user = await UserService.getUser(req.user.id);
            if (!user) return res.processError(400, 'User does not exist');
            let otp = await OTPUtils.saveOTP(user, 'email', true);
            let url = frontendUrl;
            url = `${url}/verifyEmail/${user.id}/${otp}`;
            _sendEmailVerificationMail(user, url, 'Email Verification');
            user.save();
            logger.success('Request email verification', {userId: req.user.id});
            res.send({detail: 'Email verification link sent' + url});
        } catch (error) {
            res.processError(400, 'Error requesting email verification');
        }
    }
    async verifyEmailLink (req, res){
        try {
            let user = await UserService.getUser(req.params.userId);
            if (!user) return res.processError(400, 'user does not exist');
            let type = 'email';
            if (req.params.verifyEmail === 'passwordReset') type = 'password-reset';
            return await OTPUtils.verifyOTP(user, type, res, req.params.otp);
        } catch (error) {
            res.processError(400, error);
        }
    }
    // async verifyEmailOtp (req, res){
    //     try {
    //         let email = req.body.email ? req.body.email : req.user.email;
    //         let otp = req.body.otp;
    //         if(!email || !otp) return res.processError(400, 'Bad request');
    //         let user = await UserService.getUsers({email:email});
    //         if (user && user.length < 1) return res.processError(400, 'user does not exist');
    //         user = user[0];
    //         let verified = await OTPUtils.verifyOTP(otp, user, 'email');
    //         if (verified[0] === 200) return res.send(verified[1]);
    //         return res.processError(verified[0], verified[1]);
    //     } catch (error) {
    //         res.processError(400, error);
    //     }
    // }
    async changePassword (req, res){
        try {
            let oldPassword = req.body.oldPassword;
            let newPassword = req.body.newPassword;
            if (!oldPassword || !newPassword) return res.processError(400, 'All fields are required');
            let results = await req.user.checkPassword(oldPassword);
            if (!results) return res.processError(400, 'Invalid password');
            let valid = await checkPassword(newPassword);
            if(!valid) return res.processError(400, 'Password must be minimum of 8 characters, contain both lower and upper case, number and special characters');
            req.user.setNewPassword(newPassword);
            logger.success('Change password', {userId: req.user.id});
            res.send({detail: 'Successfully change password'});
        } catch (error) {
            res.processError(400, 'Error changing password');
        }
    }
    async requestPasswordReset (req, res){
        try {
            let email = req.body.email ? req.body.email : req.user.email;
            if(!email) return res.processError(400, 'Enter a valid email request');
            let user = await UserService.getUsers({email:email});
            if (user && user.length < 1) return res.processError(400, 'user does not exist');
            user = user[0];
            let url = frontendUrl;
            let otp = await OTPUtils.saveOTP(user, 'password-reset', true);
            url = `${url}/passwordReset?ref=${user.id}&token=${otp}`;
            _sendEmailVerificationMail(user, url, 'password-reset');
            user = user.toJSON(); 
            user.otp = otp;
            logger.success('Request password reset', {userId: user.id});
            res.send({detail: 'Password reset link sent to your mail'});
        } catch (error) {
            res.processError(400, error);
        }
    }
    // async resetPassword (req, res){
    //     try {
    //         let otp = req.body.otp;
    //         let id = req.body.id;
    //         if (!id || !otp) return res.processError(400, 'bad request');
    //         let user = await UserService.getUser(id);
    //         let verified = await OTPUtils.verifyOTP(otp, user, 'password-reset');
    //         if (verified[0] === 200) res.send({id, message: verified[1]});
    //         return res.processError(verified[0], verified[1]);
    //     } catch (error) {
    //         res.processError(400, error);
    //     }
    // }
    async setPassword (req, res){
        try {
            let password = req.body.newPassword;
            let valid = checkPassword(password);
            if(!valid) return res.processError(400, 'Password must be minimum of 8 characters, contain both lower and upper case, number and special characters');
            let id = req.body.userId;
            if(!password || !id) throw Error();
            let user = await UserService.getUser(id);
            if (!user ) return res.processError(400, 'User does not exist');
            user.verifyOtp = await OTPUtils.getOtps({userId: id});
            let userOtp = user.verifyOtp.filter(o => o.type === 'password-reset');
            if (userOtp.length < 0 && !userOtp.verified) return res.processError(400, 'Invalid request, Error setting new password');
            await user.setNewPassword(password);
            return res.send({detail: 'New password successfully set'});
        } catch (error) {
            res.processError(400, 'Error setting new password');
        }
    }
    
}
function checkPassword(str){
    let re = /^(?=.*\d)(?=.*[!@#$%^'"&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(str);
}
async function  _sendEmailVerificationMail (user, url, subject, otp){
    try {
        let variables = {
            firstName: user.firstName,
            link: url,
            otp: otp,
            frontendUrl
        };
        let mailTemplate;
        if(subject.toLowerCase().includes('email')){
            mailTemplate = Handlebars._compileTemplate(signupEmailTemplate);
        } else {
            mailTemplate = Handlebars._compileTemplate(passwordEmailTemplate);

        }
        let mailContent = mailTemplate(variables);
            
        let payload = {
            subject: subject
        };
        return EmailService.sendEmail(user.email, payload, mailContent );
    } catch (error) {
        logger.error(error);
    }
}

module.exports = new UserController();
