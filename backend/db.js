const mongoose = require('mongoose');
const Location = require('./models/Location');
const Delivery = require('./models/Delivery');

// Replace with your MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/test';

// Sample data for Locations and Deliveries
const sampleLocations = [
  { locationCode: 'LOC001', billToDistrict: 'District A', billToPinCode: '123456' },
  { locationCode: 'LOC002', billToDistrict: 'District B', billToPinCode: '654321' },
  { locationCode: 'LOC003', billToDistrict: 'District C', billToPinCode: '789012' },
];

const sampleDeliveries = [
  { deliveryLocationCode: 'DEL001', billToDistrict: 'District X', billToPinCode: '234567' },
  { deliveryLocationCode: 'DEL002', billToDistrict: 'District Y', billToPinCode: '765432' },
  { deliveryLocationCode: 'DEL003', billToDistrict: 'District Z', billToPinCode: '890123' },
];

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');

    // Insert sample locations
    await Location.insertMany(sampleLocations);
    console.log('Sample locations added');

    // Insert sample deliveries
    await Delivery.insertMany(sampleDeliveries);
    console.log('Sample deliveries added');

    // Close the connection
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
