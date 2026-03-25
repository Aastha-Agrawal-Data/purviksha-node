const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE', 'OTHER'],
    required: true
  },
  contact: {
    type: String
  },
  notes: {
    type: String
  }
}, { timestamps: true })

module.exports = mongoose.model('Patient', patientSchema)