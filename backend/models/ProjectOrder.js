const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  sno: Number,
  description: String,
  unit: String,
  quantity: Number,
  ratePerUnit: Number,
  gstPercentage: Number,
  discount: Number,
  amount: Number // amount is calculated as quantity * ratePerUnit
});

const projectOrderSchema = new mongoose.Schema({
  vendorCode: String,
  name: String,
  contactperson: String,
  address: String,
  email: String,
  contact: String,
  gstNumber: String,
  billToAddress: String,
  billToGstNumber: String,
  shippingAddress: String,
  pinCode: String,
  state: String,
  shippingPhoneNumber: String,
  poNumber: String,
  poDate: Date,
  items: [itemSchema],
  totalAmount: Number, // totalAmount is the sum of all item amounts
  topsection: String,
  Notes: String,
  tnc: String,
  // additionalSections: String,
  // additionalTables: [itemSchema]
});

module.exports = mongoose.model('ProjectOrder', projectOrderSchema);
