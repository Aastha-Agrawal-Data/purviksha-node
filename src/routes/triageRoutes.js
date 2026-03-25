const express = require('express')
const router = express.Router()
const {
  submitTriage,
  getAllTriage,
  getTriageById,
  updateTriageStatus
} = require('../controllers/triageController')

router.post('/', submitTriage)
router.get('/', getAllTriage)
router.get('/:id', getTriageById)
router.patch('/:id/status', updateTriageStatus)

module.exports = router