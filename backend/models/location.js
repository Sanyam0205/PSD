const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  locationCode: {
    type: String,
    required: true,
    unique: true,
  },
  billToDistrict: {
    type: String,
    required: true,
  },
  billToPinCode: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Location', locationSchema);
