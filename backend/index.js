const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userroutes');


const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error(err));

app.use('/api/vendors', require('./routes/vendorRoutes'));
app.use('/api/project-orders', require('./routes/ProjectOrderRoutes'));
app.use('/api/users', userRoutes);
// app.use('/api/users', require('./routes/userRoutes'));
