const express = require('express');
const router = express.Router();
const flightStatusController = require('../controllers/flightStatusController');

router.get('/', flightStatusController.getAllFlightStatuses);
router.get('/:id', flightStatusController.getFlightStatusById);
router.post('/', flightStatusController.createFlightStatus);
router.put('/:id', flightStatusController.updateFlightStatus);
router.delete('/:id', flightStatusController.deleteFlightStatus);

module.exports = router;
