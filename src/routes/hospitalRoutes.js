const express = require('express')
const router = express.Router()
const Hospital = require('../models/Hospital')
const {
  createHospital,
  getAllHospitals
} = require('../controllers/hospitalController')

router.post('/', createHospital)
router.get('/', getAllHospitals)
router.delete('/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id)
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' })
    }
    res.status(200).json({ success: true, message: 'Hospital deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router