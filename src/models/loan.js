const mongoose = require('mongoose')

const { Schema } = mongoose
const loan = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    rquired: true,
    ref: 'Users'
  },
  amount: Number,
  guarantor: [{
    type: Schema.Types.ObjectId,
    ref: 'Users'
  }],
  duration: Number,
  datePaid: {
    type: Date, default: Date.now
  },
  requestedDate: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('loans', loan)
