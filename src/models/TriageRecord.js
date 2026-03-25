const mongoose = require('mongoose')

const triageRecordSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  ambulance_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ambulance',
    required: true
  },
  hospital_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },

  // Clinical inputs entered by EMT
  airway_status: {
    type: String,
    enum: ['PATENT', 'OBSTRUCTED'],
    required: true
  },
  respiratory_rate: {
    type: Number,
    required: true
  },
  spo2: {
    type: Number,
    required: true
  },
  pulse_rate: {
    type: Number,
    required: true
  },
  sbp: {
    type: Number,
    required: true
  },
  crt: {
    type: String,
    enum: ['LESS_THAN_2', 'MORE_THAN_2'],
    required: true
  },
  avpu: {
    type: String,
    enum: ['ALERT', 'VOICE', 'PAIN', 'UNRESPONSIVE'],
    required: true
  },
  vulnerable_population: {
  type: Boolean,
  default: false
  },
  total_score: {
  type: Number,
  default: 0
  },

  // Fast track
  fast_track: {
    type: Boolean,
    default: false
  },
  fast_track_reason: {
    type: String,
    enum: ['CHEST_PAIN', 'SEIZURE', 'UNCONSCIOUS', 'STROKE', 'NONE'],
    default: 'NONE'
  },

  // Computed by scoring engine
  severity_level: {
    type: String,
    enum: ['RED', 'YELLOW', 'GREEN'],
    required: true
  },

  // Record metadata
  status: {
    type: String,
    enum: ['PENDING', 'RECEIVED', 'IN_TREATMENT'],
    default: 'PENDING'
  },
  eta_minutes: {
    type: Number,
    required: true
  }

}, { timestamps: true })

module.exports = mongoose.model('TriageRecord', triageRecordSchema)