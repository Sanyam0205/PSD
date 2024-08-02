const express = require('express');
const {
  createDelivery,
  getDeliveries,
  getDeliveryByCode,
  updateDelivery,
  deleteDelivery,
} = require('../controllers/deliveryController');

const router = express.Router();

router.post('/', createDelivery);
router.get('/', getDeliveries);
router.get('/:code', getDeliveryByCode);
router.put('/:code', updateDelivery);
router.delete('/:code', deleteDelivery);

module.exports = router;
