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

// Define the more specific route first
router.get('/all', getAllProjectOrders);
router.get('/next-po-number', getNextSeriesPoNumber);

// Then define the more general routes
router.get('/:poNumber', getProjectOrderByPoNumber);
router.post('/:poNumber/items', addItemToProjectOrder);
router.put('/:poNumber', editProjectOrder); // New route for editing project order
router.put('/:poNumber/items/:itemId', editItemInProjectOrder);

router.post('/', createProjectOrder);


module.exports = router;
