const jwt = require('jsonwebtoken')
const config = require('./../../config/index')

const authenticate = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ error: 'Unathorized request' })
  }

  const token = await req.headers.authorization.split(' ')[1]

  if (!token) {
    return res.status(401).send({ error: 'Unathorized request' })
  }

  console.log(token, 'token')

  try {
    const payload = jwt.verify(token, config.tokenSecret)

    if (!payload) {
      return res.status(401).send({ error: 'Unathorized request' })
    }

    req.user = payload

    next()
  } catch (e) {
    return res.status(401).send({
      error: 'Error dectected'
    })
  }
}

module.exports = {
  authenticate

}
