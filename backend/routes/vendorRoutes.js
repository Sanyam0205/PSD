const express = require('express');
const { createVendor, getVendors, getVendorByCode, updateVendor, deleteVendor } = require('../controllers/vendorController');
const router = express.Router();

router.post('/', createVendor);
router.get('/', getVendors);
router.get('/:code', getVendorByCode);
router.put('/:code', updateVendor);
router.delete('/:code', deleteVendor);

module.exports = router;
