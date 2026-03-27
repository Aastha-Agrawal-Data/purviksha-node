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

module.exports = router