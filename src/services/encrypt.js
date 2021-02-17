'use strict';
const crypto = require('crypto-js');
const key = process.env.KMS;
const _ = require('lodash');

function encryptObj(data, obj) {
    if (obj) data = JSON.stringify(data);
    return crypto.AES.encrypt(data, key).toString();
}

function decryptObj(cipher, obj){
    try {
        let bytes  = crypto.AES.decrypt(cipher, key);
        let str = bytes.toString(crypto.enc.Utf8);
        if (obj) str = JSON.parse(str);
        return str;
    }
    catch(err){
        console.log(err);
    }
}
function sha1 (str){
    let bytes  = crypto.SHA1(str).toString();
    return bytes;
}

function encode64(textString){
    let words = crypto.enc.Utf8.parse(textString); 
    return crypto.enc.Base64.stringify(words);

}
function decode64(code){
    let words  = crypto.enc.Base64.parse(code);
    return crypto.enc.Base64.stringify(words);
}

function getAuthorization(clientId){
    return 'HeritageAuth ' + encode64(clientId);
}

function getReference(num){
    let ref =  _.times(num, () => _.random(35).toString(36)).join('');
    return ref.toUpperCase();
}

async function getClientId(Users){
    const db = require('../models');
    let userExists = true; 
    let id, user;
    while (userExists) {
        id = Math.floor(Math.pow(10, 9) + Math.random() * 9 * Math.pow(10, 9)).toString();
        user = await Users.findOne({where: {clientId: {[db.Sequelize.Op.eq]: id}}});
        if (!user) break;
    }
    return id;
}

function getSignature(method, url, reference, clientId, secret, test){
    let baseUrl = test ? process.env.TEST_URL : process.env.LIVE_URL;
    let encodeUrl = encodeURIComponent(`${baseUrl}${url}`);
    let baseStringToBeSigned = `${method.toUpperCase()}&${encodeUrl}&${reference}&${clientId}&${secret}`;
    // console.log(`${baseUrl}${url}`, baseStringToBeSigned);
    // console.log(encode64(sha1(baseStringToBeSigned)))
    return encode64(sha1(baseStringToBeSigned));
}

function encryptHeaders(clientId, secret, uniqueKey){
    return encryptObj({clientId, secret, uniqueKey}, true);
}
function getHeaders(app, api, test, type, obj){
    let encryptedHeaders = app.headers;
    let {clientId, secret, uniqueKey} = decryptObj(encryptedHeaders, true);
    let url;
    if (type === 'internal') {
        url = api.url;
        if(api.method.toLowerCase() === 'get' && obj) {
            url+= '?';
            let length = Object.keys(obj).length;
            Object.keys(obj).forEach((k, ind) => {
                url += `${k}=${obj[k]}`;
                if(ind < length - 1) url += '&';
            });
        }
    } else {
        url = obj.url;
    }
    let method = api.method;
    let header = {}; 
    let reference = getReference(30);
    header.Signature = getSignature(method, url, reference, clientId, secret, test);
    header.UniqueKey = uniqueKey;
    header.Authorization = getAuthorization(clientId);
    header.Reference = reference;
    return header;
}

function createUserSecret(appId, header){
    let sec = appId + '_' + getReference(40);
    let secret = 'hb_prod_' + encryptObj(sec);
    let encryptedSecret = encryptObj(secret);
    let headers =  encryptObj(header, true);
    return { secret, encryptedSecret, headers };
}

function compareKeys(apiKey, appKey){
    let keys = decryptObj(appKey);
    return apiKey === keys;
}

module.exports = {
    createUserSecret, compareKeys, getHeaders, getReference, getClientId, decryptObj
};