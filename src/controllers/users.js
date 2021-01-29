const request = require('request')
const multer = require('helper/multer')
const usersServices = require('./../services/users')
const { initializePayment, verifyPayment } = require('../../config/paystack')(request)
// eslint-disable-next-line no-undef


const getUser = async (req, res) => {
  const search = {
    _id: req.user.id
  }

  try {
    const result = await usersServices.searchUser(search)

    if (!result) {
      res.status(404).send({ error: 'Username not found' })

      return
    }

    result.password = undefined

    res.send(result)
  } catch (error) {
    console.error(error)
    res.status(401).send({ error: 'Error fetching user' })
  }
}

const saveWallet = async (req, res) => {
  const data = {
    userId: req.user.id,
    amount: req.body.amount,
    date: new Date()
  }
  const value = Number(data.amount)
  try {
    if ((value === 0) || (Number.isNaN(value))) {
      res.send({ error: 'Enter a valid amount' })

      return
    }

    const result = await usersServices.saveWallet(data)
    res.send(result)
  } catch (error) {
    res.status(400).send(error)
  }
}

const getWalletDetails = async (req, res) => {
  const data = { userId: req.user.id, }
  try {
    const result = await usersServices.getWalletDetails(data)
    res.send({ result })
  } catch (error) {
    res.status(400).send(error)
  }
}

const loanRequest = async (req, res) => {
  const data = {
    userId: req.user.id,
    amount: req.body.amount,
    guarantor: req.body.guarantor,
    duration: req.body.duration,
  }
  const value = Number(data.amount)
  try {
    if ((value === 0) || (Number.isNaN(value))) {
      res.send({ error: 'Enter valid amount' })

      return
    }

    data.amount = value

    const foundGuarantors = await usersServices.searchUsers({ email: { $in: data.guarantor } })
    const array = []
    foundGuarantors.forEach((guarantor) => {
      array.push(guarantor._id)
    })

    if (data.guarantor.length !== foundGuarantors.length) {
      const unfoundEmails = []

      data.guarantor.forEach((email) => {
        let isSeen = false

        foundGuarantors.forEach((user) => {
          if (email === user.email) {
            isSeen = true

            return -1
          }
        })

        if (!isSeen) {
          unfoundEmails.push(email)
        }
      })

      return res.status(400).send({ error: `Invalid guarantor's email: ${unfoundEmails.join(', ')}` })
    }

    data.guarantor = foundGuarantors

    const result = await usersServices.loanRequest(data)
    res.send({ result })
  } catch (error) {
    res.status(400).send(error)
  }
}

const getLoanRequest = async (req, res) => {
  const data = {
    userId: req.user.id
  }
  const result = await usersServices.getLoanRequest(data)

  try {
    if (!result) {
      res.send({ error: 'unable to access loan request' })
    }

    res.send(result)
  } catch (error) {
    res.status(400).send(error)
  }
}

const addProfilePicture = async (req, res) => {
  const search = { _id: req.user.id }

  try {
    const data = { profile_pix: req.file.path }
    const result = await usersServices.searchUser(search)
    const updatedUser = await usersServices.update(search, data)

    if (result.profile_pix !== '') {
      const file = [result.profile_pix.split('s\\')[1]]
      multer.remove(file, updatedUser.profile_pix.split('s\\')[1])
    }


    res.status(200).send(updatedUser)
  } catch (error) {
    return res.status(500).send({
      error: 'Unknown error occurred when processing your request.'
    })
  }
}

const beginPayment = async (req, res) => {
  const search = { _id: req.user.id }
  const result = await usersServices.searchUser(search)

  if (!result) {
    return res.status(400).send({ error: 'User not found' })
  }

  const fullName = `${result.first_name} ${result.last_name}`
  const form = {
    amount: process.env.initialChargeAmount * 100,
    email: result.email,
    full_name: fullName,
    metadata: {
      full_name: fullName
    }
  }

  try {
    initializePayment(form, async (error, body) => {
      if (error) {
        res.staus(400).send({ error: 'Unable to get payment details' })

        return
      }

      const response = JSON.parse(body)
      const { email } = result
      const { reference } = response.data
      const { amount } = form
      const payer = {
        reference, amount, email, fullName, userId: req.user.id
      }
      await usersServices.savePayment(payer)
      res.send(response.data.authorization_url)
    })
  } catch (error) {
    console.error(error)

    return res.status(400).send({ error: 'Uanble to initialize payment' })
  }
}

const confirmPayment = async (req, res) => {
  const ref = req.query.reference
  verifyPayment(ref, async (error, body) => {
    if (error) {
      console.error(error)

      return res.status(400).send({ error: 'Uanble to verify payment' })
    }

    const response = JSON.parse(body)
    const { reference, amount } = response.data
    const { email } = response.data.customer
    const { fullName } = response.data.customer
    const data = {
      reference, amount, email, fullName
    }
    const findId = await usersServices.findPayment({ reference })
    await usersServices.updatePayment({ reference })

    const updateWallet = {
      userId: findId.userId,
      amount: data.amount,
      date: new Date()
    }
    const result = await usersServices.saveWallet(updateWallet)

    if (!result) {
      console.error(error)

      return res.status(400).send({ error: 'Unable to save payment details' })
    }

    res.send({ result: 'Your payment was succesfully updated' })
  })
}


const updateProfile = async (req, res) => {
  const search = {
    _id: req.user.id
  }
  const data = {
    first_name: req.body.first_name,
    email: req.body.email,
    middle_name: req.body.middle_name,
    last_name: req.body.last_name,
    address: req.body.address,
    date_of_birth: req.body.date_of_birth,
    next_of_kin_name: req.body.next_of_kin_name,
    next_of_kin_email: req.body.next_of_kin_email,
    next_of_kin_phone: req.body.next_of_kin_phone,
    next_of_kin_relationship: req.body.next_of_kin_relationship,
  }
  const regex = /[$-/:-?{-~!"^_`[\]]/

  if (!data.first_name || regex.test(data.first_name) === true) {
    res.send({ error: 'Enter a name' })

    return
  }

  if (!data.email || data.email.search('@') === -1) {
    res.send({ error: 'Enter a valid e-mail address' })

    return
  }

  if (!data.last_name || regex.test(data.last_name) === true) {
    res.send({ error: 'Last name can not be empty, add a valid name' })

    return
  }

  if (!data.address) {
    res.send({ error: 'Enter an address' })

    return
  }

  const dateRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i

  if (!data.date_of_birth || dateRegex.test(data.date_of_birth) !== true) {
    res.send({ error: 'Enter the correct date format dd/mm/yyyy' })

    return
  }

  if (!data.next_of_kin_name || regex.test(data.next_of_kin_name) === true) {
    res.send({ error: 'Enter Next of kin Name' })

    return
  }

  if (!data.next_of_kin_phone) {
    res.send({ error: 'Enter Next of kin phone number' })

    return
  }

  if (!data.next_of_kin_relationship) {
    res.send({ error: 'Enter Next of kin Relationshin' })

    return
  }

  if (!data.next_of_kin_email || data.next_of_kin_email.search('@') === -1) {
    res.send({ error: 'Enter a valid Next of kin e-mail address' })

    return
  }

  try {
    const updatedUser = await usersServices.update(search, data)

    res.status(200).send(updatedUser)
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).send({
        error: 'profile not found'
      })
    }

    return res.status(500).send({
      error: 'Error updating your profile'
    })
  }
}

module.exports = {
  getUser,
  saveWallet,
  getWalletDetails,
  loanRequest,
  getLoanRequest,
  updateProfile,
  addProfilePicture,
  beginPayment,
  confirmPayment
}
