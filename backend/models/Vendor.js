const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: String,
  vendorCode: String,
  contactperson: String,
  address: String,
  email: String,
  contact: String,
  gstNumber: String,
  district: String,
  state: String,
  pinCode: String,
});

module.exports = mongoose.model('Vendor', vendorSchema);
