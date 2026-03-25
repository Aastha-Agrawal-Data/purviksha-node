const Patient = require('../models/Patient')

const createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body)
    const saved = await patient.save()
    res.status(201).json({ success: true, data: saved })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: patients })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

module.exports = { createPatient, getAllPatients }