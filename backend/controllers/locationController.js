const Location = require('../models/location');

exports.createLocation = async (req, res) => {
  const location = new Location(req.body);
  try {
    const savedLocation = await location.save();
    res.status(201).json(savedLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLocationByCode = async (req, res) => {
  try {
    const location = await Location.findOne({ locationCode: req.params.code });
    if (location) {
      res.json(location);
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const updatedLocation = await Location.findOneAndUpdate(
      { locationCode: req.params.code },
      req.body,
      { new: true }
    );
    if (updatedLocation) {
      res.json(updatedLocation);
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const deletedLocation = await Location.findOneAndDelete({ locationCode: req.params.code });
    if (deletedLocation) {
      res.json({ message: 'Location deleted successfully' });
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
