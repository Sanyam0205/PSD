const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  deliveryLocationCode: {
    type: String,
    required: true,
    unique: true,
  },
  deliveryDistrict: {
    type: String,
    required: true,
  },
  deliveryPinCode: {
    type: String,
    required: true,
  },
  // Add any other fields related to delivery as needed
});

module.exports = mongoose.model('Delivery', deliverySchema);
