const Vendor = require('../models/Vendor');

exports.createVendor = async (req, res) => {
  const vendor = new Vendor(req.body);
  try {
    const savedVendor = await vendor.save();
    res.status(201).json(savedVendor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVendorByCode = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ vendorCode: req.params.code });
    if (vendor) {
      res.json(vendor);
    } else {
      res.status(404).json({ message: 'Vendor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateVendor = async (req, res) => {
  try {
    const updatedVendor = await Vendor.findOneAndUpdate(
      { vendorCode: req.params.code },
      req.body,
      { new: true }
    );
    if (updatedVendor) {
      res.json(updatedVendor);
    } else {
      res.status(404).json({ message: 'Vendor not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteVendor = async (req, res) => {
  try {
    const deletedVendor = await Vendor.findOneAndDelete({ vendorCode: req.params.code });
    if (deletedVendor) {
      res.json({ message: 'Vendor deleted successfully' });
    } else {
      res.status(404).json({ message: 'Vendor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
