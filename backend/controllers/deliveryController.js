const Delivery = require('../models/delivery');

exports.createDelivery = async (req, res) => {
  const delivery = new Delivery(req.body);
  try {
    const savedDelivery = await delivery.save();
    res.status(201).json(savedDelivery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDeliveryByCode = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ deliveryLocationCode: req.params.code });
    if (delivery) {
      res.json(delivery);
    } else {
      res.status(404).json({ message: 'Delivery not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDelivery = async (req, res) => {
  try {
    const updatedDelivery = await Delivery.findOneAndUpdate(
      { deliveryLocationCode: req.params.code },
      req.body,
      { new: true }
    );
    if (updatedDelivery) {
      res.json(updatedDelivery);
    } else {
      res.status(404).json({ message: 'Delivery not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteDelivery = async (req, res) => {
  try {
    const deletedDelivery = await Delivery.findOneAndDelete({ deliveryLocationCode: req.params.code });
    if (deletedDelivery) {
      res.json({ message: 'Delivery deleted successfully' });
    } else {
      res.status(404).json({ message: 'Delivery not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
