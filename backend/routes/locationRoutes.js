const express = require('express');
const {
  createLocation,
  getLocations,
  getLocationByCode,
  updateLocation,
  deleteLocation,
} = require('../controllers/locationController');

const router = express.Router();

router.post('/', createLocation);
router.get('/', getLocations);
router.get('/:code', getLocationByCode);
router.put('/:code', updateLocation);
router.delete('/:code', deleteLocation);

module.exports = router;
