const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  locationCode: {
    type: String,
    required: true,
    unique: true,
  },
  billtoname: {
    type: String,
    required: true,
  },
  billToAddress: {
    type: String,
    required: true,
  },
  billToDistrict: {
    type: String,
    required: true,
  },
  billToPinCode: {
    type: String,
    required: true,
  },
  billToGstNumber: {
    type: String,
    required: true,
  },
  billToContact: {
    type: String,
    required: true,
  },
  billToEmail: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Location', locationSchema);
