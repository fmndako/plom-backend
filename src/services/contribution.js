const contributionModel = require('./../models/contribution')

const getContribution = async data => await contributionModel.find(data)
const addContribution = async data => await contributionModel.create(data)

module.exports = {
  getContribution,
  addContribution
}