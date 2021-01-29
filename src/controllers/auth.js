const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const authServices = require('./../services/auth')
const mail = require('./../helper/email')
const config = require('./../../config/index')
const userService = require('../services/users')

const saltRounds = 10
const register = async (req, res) => {
  const data = {
    phone: req.body.phone,
    password: req.body.password,
    first_name: req.body.first_name,
    middle_name: req.body.middle_name,
    last_name: req.body.last_name,
    email: req.body.email,
    address: req.body.address
  }

  try {
    if (!data.phone) {
      res.send({ error: 'Enter a phone number' })

      return
    }

    if (!data.password || data.password.length < 6) {
      res.send({ error: 'Password must be over 5 characters' })

      return
    }

    if (!data.first_name) {
      res.send({ error: 'Enter a name' })

      return
    }

    if (!data.last_name) {
      res.send({ error: 'Last name can not be empty' })

      return
    }

    if (!data.email || data.email.search('@') === -1) {
      res.send({ error: 'Enter a valid e-mail address' })

      return
    }

    if (!data.address) {
      res.send({ error: 'Enter an address' })

      return
    }

    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(data.password, salt)
    const email = data.email.toLowerCase()
    const result = await authServices.searchUser(email)

    if (result) {
      return res.status(400).send({ error: 'Email already exist' })
    }

    data.password = hash
    await authServices.register(data)

    res.send({ result: 'Registration successful' })
  } catch (error) {
    res.status(500).send({ error: 'unable to register' })
  }
}

const resetPassword = async (req, res) => {
  const data = {
    email: req.body.email,
  }
  try {
    if (!data.email || data.email.search('@') === -1) {
      return res.send({ error: 'Enter a valid e-mail address' })
    }

    const result = await authServices.resetPassword(data)

    if (!result) {
      res.send({ error: 'Account does not exist' })

      return
    }

    const token = jwt.sign({ id: result._id }, config.tokenSecret)

    await userService.updateUser({ _id: result._id }, { passwordToken: token })

    await mail.sendMail(process.env.SENDER_EMAIL, process.env.EMAIL_SENDER_NAME,
      result.first_name, result.email, token)

    res.send({ result: `a link has been sent to ${result.email}` })
  } catch (error) {
    console.error(error)

    return res.status(400).send({ error: 'Unable to reset your password' })
  }
}


const newPassword = async (req, res) => {
  const { token, password } = req.body

  try {
    const tokenWasGeneratedByServer = await userService.searchUser({ passwordToken: token })

    if (!tokenWasGeneratedByServer) {
      return res.status(400).send({ message: 'Invalid token provided' })
    }

    const payload = jwt.verify(token, config.tokenSecret)

    if (!payload) {
      return res.status(400).send({ error: 'Can not reset password' })
    }

    const Id = payload.id
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(password, salt)

    await authServices.update({ _id: Id }, { password: hashedPassword, passwordToken: '' })
    res.send({ result: 'Your password has been successfully updated' })
  } catch (error) {
    console.error({ error })

    return res.status(400).send({ error: 'Can not reset password' })
  }
}

const login = async (req, res) => {
  const data = {
    email: req.body.email
  }
  try {
    const result = await authServices.login(data)

    if (!result) {
      res.send({ error: 'Invalid email or password' })

      return
    }

    const verifiedPassword = await bcrypt.compare(req.body.password, result.password)

    if (!verifiedPassword) {
      res.status(400).send({ error: 'Invalid email or password' })

      return
    }

    const payload = {
      id: result._id,
      isAdmin: result.isAdmin
    }
    const token = jwt.sign(payload, config.tokenSecret)

    res.send({ token })
  } catch (error) {
    console.error({ error })

    return res.status(400).send({ error: 'Error occurred when logging in' })
  }
}


module.exports = {
  register,
  resetPassword,
  newPassword,
  login
}