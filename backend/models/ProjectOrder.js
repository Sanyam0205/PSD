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
