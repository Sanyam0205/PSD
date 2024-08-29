const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const path = require('path');
const fs = require('fs');
const uploadRoutes = require('./routes/uploadRoutes');
const purchaseOrderRoutes = require('./routes/projectOrderRoutes');
const locationRoutes = require('./routes/locationRoutes');
const { getNextSeriesPoNumber } = require('./controllers/ProjectOrderController');
const bodyparser = require("body-parser");
// Load environment variables
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// Connect to MongoDB

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error(err));

// Define routes
app.use('/api/vendors', require('./routes/vendorRoutes'));
app.use('/api/project-orders', require('./routes/projectOrderRoutes'));
app.use(uploadRoutes);
app.use(purchaseOrderRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/series', getNextSeriesPoNumber);
app.use(bodyparser.json());
app.use("/api", userRoutes);
app.use("/api", purchaseOrderRoutes);
app.use('/api/project-orders', require('./routes/projectOrderRoutes'));
