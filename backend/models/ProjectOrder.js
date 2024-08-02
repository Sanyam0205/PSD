const mongoose = require('mongoose');

const subItemschema = new mongoose.Schema({
  sno: Number,
  description: String,
  unit: String,
  quantity: Number,
  ratePerUnit: Number,
  gstPercentage: Number,
  discount: Number,
  amount: Number,
});
const itemSchema = new mongoose.Schema({
  sno: Number,
  description: String,
  unit: String,
  quantity: Number,
  ratePerUnit: Number,
  gstPercentage: Number,
  discount: Number,
  amount: Number,
  subItems:[subItemschema] 
});

const projectOrderSchema = new mongoose.Schema({
  vendorCode: String,
  name: String,
  contactperson: String,
  address: String,
  district: String,
  pinCode: String,
  email: String,
  contact: String,
  gstNumber: String,
  locationCode: String,
  billtoname: String,
  billToAddress: String,
  billToGstNumber: String,
  shippingAddress: String,
  billToDistrict: String,
  billToPinCode: String,
  billToContact: String,
  billToEmail: String,
  deliveryLocationCode: String,
  deliveryName: String,
  deliveryDistrict: String,
  deliveryPinCode: String,
  deliveryContact: String,
  deliveryEmail: String,
  poNumber: String,
  poDate: Date,
  podeliverydate: Date,
  items: [itemSchema],
  totalAmount: Number, 
  topsection: String,
  Notes: String,
  tnc: String,
  signature: {
    fileName: { type: String },
    filePath: { type: String },
    fileSize: { type: Number },
    mimeType: { type: String },
    uploadDate: { type: Date, default: Date.now },
  },

});

module.exports = mongoose.model('ProjectOrder', projectOrderSchema);
