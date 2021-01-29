const authModel = require('./../models/users')

const register = async data => await authModel.create(data)
const resetPassword = async data => await authModel.findOne(data)
const update = async (Id, data) => await authModel.update({ _id: Id }, data)
const login = async data => await authModel.findOne(data)
const searchUser = async email => await authModel.findOne({ email })

module.exports = {
  register,
  resetPassword,
  login,
  update,
  searchUser
}
