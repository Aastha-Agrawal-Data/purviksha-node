const mongoose = require('mongoose')

const ambulanceSchema = new mongoose.Schema({
  vehicle_number: {
    type: String,
    required: true
  },
  emt_name: {
    type: String,
    required: true
  },
  emt_id: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Ambulance', ambulanceSchema)