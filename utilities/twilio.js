const winston = require('../src/services/winston');
const logger = new winston('Message Controller');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);



class Message {
    async send(to, body){
        try {
        let resp = await client.messages
                .create({
                    from: 'whatsapp:+14155238886',
                    body: 'Your Plom code is 323243',
                    to: 'whatsapp:+2347066177668'
                });
            logger.info('Message sent')
            }
            catch (err){
                logger.error(err);
            }
    }
}

module.exports = new Message();