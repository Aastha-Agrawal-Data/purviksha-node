const express = require('express')
const router = express.Router()
const Ambulance = require('../models/Ambulance')

router.post('/', async (req, res) => {
  try {
    const ambulance = new Ambulance(req.body)
    const saved = await ambulance.save()
    res.status(201).json({ success: true, data: saved })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const ambulances = await Ambulance.find()
    res.status(200).json({ success: true, data: ambulances })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})
router.delete('/:id', async (req, res) => {
  try {
    const ambulance = await Ambulance.findByIdAndDelete(req.params.id)
    if (!ambulance) {
      return res.status(404).json({ success: false, message: 'Ambulance not found' })
    }
    res.status(200).json({ success: true, message: 'Ambulance deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})
module.exports = router