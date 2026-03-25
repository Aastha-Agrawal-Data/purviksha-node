const mongoose = require('mongoose')

const hospitalSchema = new mongoose.Schema({
  hospital_name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Hospital', hospitalSchema)