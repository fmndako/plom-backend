
const mailjet = require('node-mailjet')
  .connect(process.env.MAILJET_PUBLIC_KEY, process.env.MAILJET_SECRET_KEY, {
    url: 'api.mailjet.com',
    version: 'v3.1',
    perform_api_call: true
  })

async function sendMail (senderMail, senderName, receiverName, receiverEmail, token) {
  try {
    return await mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: `${senderMail}`,
              Name: `${senderName}`
            },
            To: [
              {
                Email: `${receiverEmail}`,
                Name: `${receiverName}`
              }
            ],
            Subject: 'Password reset',
            HTMLPart: `<h3>Dear, ${receiverName} click the following link to reset your password <a href='https://www.mailjet.com/password-reset/${token}'>Mailjet</a>!</h3><br />May the delivery force be with you!`
          }
        ]
      })
  } catch (error) {
    console.error(error)

    return ({ error: 'Unable to reset your password' })
  }
}


module.exports = {
  sendMail
}
