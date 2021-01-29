const mongoose = require('mongoose')

const { Schema } = mongoose
const contributionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Users'
  },
  amount: {
    type: Number,
    required: true
  },
  datePaid: {
    type: Date,
    required: true
  }
})

module.exports = mongoose.model('Contribution', contributionSchema)