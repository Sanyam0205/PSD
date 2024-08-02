const mongoose = require('mongoose');
const Location = require('./models/Location');
const Delivery = require('./models/Delivery');

// Replace with your MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/test';

// Sample data for Locations and Deliveries
const sampleLocations = [
  { locationCode: 'LOC001', district: 'District A', pinCode: '123456' },
  { locationCode: 'LOC002', district: 'District B', pinCode: '654321' },
  { locationCode: 'LOC003', district: 'District C', pinCode: '789012' },
];

const sampleDeliveries = [
  { deliveryLocationCode: 'DEL001', district: 'District X', pinCode: '234567' },
  { deliveryLocationCode: 'DEL002', district: 'District Y', pinCode: '765432' },
  { deliveryLocationCode: 'DEL003', district: 'District Z', pinCode: '890123' },
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
