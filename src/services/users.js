const userModel = require('./../models/users')
const walletModel = require('./../models/wallet')
const loanModel = require('./../models/loan')
const authModel = require('./../models/users')
const paymentModel = require('./../models/payment')

const savePayment = async payer => await paymentModel.create(payer)
const updatePayment = async data => await paymentModel.update({ reference: data.reference },
  { $set: { isVerified: true } })
const findPayment = async data => await paymentModel.findOne({ reference: data.reference })
const update = async (search, data) => await authModel.findOneAndUpdate(search, data, { new: true })
const searchUser = async search => await userModel.findOne(search)
const searchUsers = async search => await userModel.find(search)
const saveWallet = async data => await walletModel.create(data)
const getWalletDetails = async data => await walletModel.find(data).populate('userId')
const loanRequest = async data => await loanModel.create(data)
const getLoanRequest = async data => await loanModel.findOne(data)
const updateUser = async (search, data) => await userModel.update(search, { $set: data })

module.exports = {
  searchUser,
  searchUsers,
  saveWallet,
  getWalletDetails,
  loanRequest,
  updateUser,
  getLoanRequest,
  savePayment,
  updatePayment,
  findPayment,
  update
}
