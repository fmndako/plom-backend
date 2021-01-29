const bcrypt = require('bcrypt')
const User = require('../../models/users')

const saltRounds = 10
const perPage = 10
const filter = {
  _id: 1,
  email: 1,
  first_name: 1,
  middle_name: 1,
  last_name: 1,
  total_amount_contributed: 1,
  available_balance: 1,
  date_registered: 1,
  profile_pix: 1
}
const createAdmin = async () => {
  const email = 'admin@test.com'
  const password = '12345'
  const phone = '12345'
  const isAdmin = true
  const data = {
    email,
    phone,
    isAdmin,
    password
  }
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(data.password, salt)

  data.password = hash

  try {
    const foundUser = await User.findOne({ email })

    if (foundUser) {
      console.log(`Admin with ${foundUser.email} already exist `)
    } else {
      const admin = new User(data)
      const newAdmin = await admin.save()
      console.log(`Admin successfully created with ${newAdmin.email}`)
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports.getAllUsers = async (req, res) => {
  const page = Number(req.query.page) || 1
  const {
    email, sort, name, order
  } = req.query
  let query = {}
  let sortType
  let sortOrder = 1


  if (order === 'descending') {
    sortOrder = -1
  }

  if (name !== '' && name !== undefined) {
    query = { $or: [{ first_name: new RegExp(name, 'gi') }, { last_name: new RegExp(name, 'gi') }] }
  }

  if (email !== '' && email !== undefined) {
    query = {
      email: new RegExp(email, 'gi')
    }
  }

  if (filter[sort]) {
    sortType = { [sort]: sortOrder }
  } else {
    sortType = { date_registered: sortOrder }
  }

  try {
    const foundUsers = await User.find(query, filter)
      .limit(perPage)
      .skip(perPage * (page - 1))
      .sort(sortType)
    const count = await User.countDocuments()
    res.status(200).send({
      users: foundUsers,
      page,
      pages: Math.floor(count / perPage)
    })
  } catch (error) {
    res.status(400).send({ error: 'An error occoured ' })
  }
}
createAdmin()
