const Hospital = require('../models/Hospital')

const createHospital = async (req, res) => {
  try {
    const hospital = new Hospital(req.body)
    const saved = await hospital.save()
    res.status(201).json({ success: true, data: saved })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find()
    res.status(200).json({ success: true, data: hospitals })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

module.exports = { createHospital, getAllHospitals }