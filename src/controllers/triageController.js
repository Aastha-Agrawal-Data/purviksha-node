const TriageRecord = require('../models/TriageRecord')
const Response = require('../models/Response')
const Patient = require('../models/Patient')
const { calculateTriage } = require('../services/triageEngine')

// POST /api/triage — Submit new triage
const submitTriage = async (req, res) => {
  try {
    const {
      patient_id,
      ambulance_id,
      hospital_id,
      airway_status,
      respiratory_rate,
      spo2,
      pulse_rate,
      sbp,
      crt,
      avpu,
      fast_track,
      fast_track_reason,
      vulnerable_population,
      eta_minutes
    } = req.body

    // Run scoring engine
    const result = calculateTriage({
      airway_status,
      respiratory_rate,
      spo2,
      pulse_rate,
      sbp,
      crt,
      avpu,
      fast_track,
      fast_track_reason,
      vulnerable_population
    })

    // Save triage record
    const triageRecord = new TriageRecord({
      patient_id,
      ambulance_id,
      hospital_id,
      airway_status,
      respiratory_rate,
      spo2,
      pulse_rate,
      sbp,
      crt,
      avpu,
      fast_track: result.fast_track,
      fast_track_reason: result.fast_track_reason,
      severity_level: result.severity_level,
      total_score: result.total_score,
      vulnerable_population,
      eta_minutes,
      status: 'PENDING'
    })

    const savedRecord = await triageRecord.save()

    // Save individual parameter responses
    if (result.parameter_scores) {
      const responses = Object.entries(result.parameter_scores).map(
        ([parameter, score]) => ({
          record_id: savedRecord._id,
          parameter,
          value_text: JSON.stringify(score),
          contributing_to: score.color
        })
      )
      await Response.insertMany(responses)
    }

    // Fetch patient details for socket payload
    const patient = await Patient.findById(patient_id)

    // Emit real-time alert via Socket.io
    const io = req.app.get('io')
    io.emit('new_triage_alert', {
      record_id: savedRecord._id,
      patient_name: patient ? patient.name : 'Unknown',
      age: patient ? patient.age : null,
      gender: patient ? patient.gender : null,
      severity_level: result.severity_level,
      fast_track: result.fast_track,
      fast_track_reason: result.fast_track_reason,
      total_score: result.total_score,
      eta_minutes,
      timestamp: savedRecord.createdAt
    })

    res.status(201).json({
      success: true,
      message: 'Triage submitted successfully',
      data: {
        record_id: savedRecord._id,
        severity_level: result.severity_level,
        total_score: result.total_score,
        parameter_scores: result.parameter_scores,
        fast_track: result.fast_track
      }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Triage submission failed',
      error: error.message
    })
  }
}

// GET /api/triage — Get all triage records
const getAllTriage = async (req, res) => {
  try {
    const records = await TriageRecord.find()
      .populate('patient_id', 'name age gender')
      .populate('ambulance_id', 'vehicle_number emt_name')
      .populate('hospital_id', 'hospital_name')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch records',
      error: error.message
    })
  }
}

// GET /api/triage/:id — Get single record
const getTriageById = async (req, res) => {
  try {
    const record = await TriageRecord.findById(req.params.id)
      .populate('patient_id', 'name age gender')
      .populate('ambulance_id', 'vehicle_number emt_name')
      .populate('hospital_id', 'hospital_name')

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Triage record not found'
      })
    }

    const responses = await Response.find({ record_id: req.params.id })

    res.status(200).json({
      success: true,
      data: { record, responses }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch record',
      error: error.message
    })
  }
}

// PATCH /api/triage/:id/status — Update status
const updateTriageStatus = async (req, res) => {
  try {
    const { status } = req.body
    const record = await TriageRecord.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Triage record not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Status updated',
      data: record
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: error.message
    })
  }
}

module.exports = {
  submitTriage,
  getAllTriage,
  getTriageById,
  updateTriageStatus
}