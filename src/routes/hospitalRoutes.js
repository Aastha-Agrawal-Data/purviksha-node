const express = require('express')
const router = express.Router()
const {
  createHospital,
  getAllHospitals
} = require('../controllers/hospitalController')

router.post('/', createHospital)
router.get('/', getAllHospitals)

module.exports = router