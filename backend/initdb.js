const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vendor = require('./models/Vendor');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  insertSampleData();
}).catch(err => console.error(err));

const insertSampleData = async () => {
  const vendors = [
    {
      name: 'Vendor A',
      vendorCode: 'V001',
      address: '123 Main St, City A',
      email: 'vendorA@example.com',
      gstNumber: 'GST123A'
    },
    {
      name: 'Vendor B',
      vendorCode: 'V002',
      address: '789 Main St, City B',
      email: 'vendorB@example.com',
      gstNumber: 'GST123B'
    },
    {
      name: 'Vendor C',
      vendorCode: 'V003',
      address: '123 Main St, City C',
      email: 'vendorC@example.com',
      gstNumber: 'GST123C'
    }
  ];

  try {
    await Vendor.insertMany(vendors);
    console.log('Sample data inserted successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error inserting sample data:', error);
    mongoose.connection.close();
  }
};
