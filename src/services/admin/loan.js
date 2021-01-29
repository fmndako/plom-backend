const loanModel = require('./../../models/loan')

const getLoans = async data => await loanModel
  .find(data.query)
  .limit(data.limit).skip(data.limit * data.page).sort({ [data.sortBy]: data.sortStyle })

module.exports = {
  getLoans
}
