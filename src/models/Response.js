const mongoose = require('mongoose')

const responseSchema = new mongoose.Schema({
  record_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TriageRecord',
    required: true
  },
  parameter: {
    type: String,
    enum: ['AIRWAY', 'BREATHING', 'CIRCULATION', 'DISABILITY'],
    required: true
  },
  value_text: {
    type: String,
    required: true
  },
  contributing_to: {
    type: String,
    enum: ['RED', 'YELLOW', 'GREEN'],
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Response', responseSchema)