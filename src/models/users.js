const mongoose = require('mongoose')

const { Schema } = mongoose
const User = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  phone: {
    type: String,
    required: true
  },
  first_name: String,
  middle_name: String,
  last_name: String,
  address: String,
  passwordToken: false,
  isAdmin: {
    type: Boolean,
    default: false
  },
  profile_pix: { type: String, default: '' },
  date_of_birth: String,
  next_of_kin_name: String,
  next_of_kin_email: String,
  next_of_kin_phone: String,
  next_of_kin_relationship: String
},
{
  _id: String
})

module.exports = mongoose.model('Users', User)
