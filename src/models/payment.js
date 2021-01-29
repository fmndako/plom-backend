const mongoose = require('mongoose')

const { Schema } = mongoose
const payment = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  userId: {
    type: String
  },
  email: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  reference: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('payments', payment)
