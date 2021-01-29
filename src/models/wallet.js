const mongoose = require('mongoose')

const { Schema } = mongoose
const Wallet = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Users'
  },
  amount: Number,
  date: Date
})

module.exports = mongoose.model('Wallets', Wallet)
