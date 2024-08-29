// routes/ProjectOrderRoutes.js

const express = require('express');
const router = express.Router();
const {
  createProjectOrder,
  getProjectOrderByPoNumber,
  addItemToProjectOrder,
  editProjectOrder,
  editItemInProjectOrder,
  getNextSeriesPoNumber,
  getAllProjectOrders
} = require('../controllers/ProjectOrderController');

router.post('/', createProjectOrder);
router.get('/:poNumber', getProjectOrderByPoNumber);
router.post('/:poNumber/items', addItemToProjectOrder);
router.put('/:poNumber', editProjectOrder); // New route for editing project order
router.put('/:poNumber/items/:itemId', editItemInProjectOrder);
router.get('/next-po-number', getNextSeriesPoNumber);
router.get('/purchaseorders', getAllProjectOrders);


module.exports = router;
