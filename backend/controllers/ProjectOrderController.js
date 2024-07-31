const ProjectOrder = require('../models/ProjectOrder');

// Function to calculate total amount for the project order
const calculateTotalAmount = (items) => {
  return items.reduce((total, item) => total + item.amount, 0);
};

exports.createProjectOrder = async (req, res) => {
  const { vendorCode, name,contactperson, address, email,contact, gstNumber, billToAddress,billToGstNumber,shippingAddress,pinCode,state,shippingPhoneNumber, poNumber, poDate, items,topsection,
    Notes,
    tnc,signature} = req.body;
  const totalAmount = calculateTotalAmount(items);

  const projectOrder = new ProjectOrder({
    vendorCode,
    name,
    contactperson,
    address,
    email,
    contact,
    gstNumber,
    billToAddress,
    billToGstNumber,
    shippingAddress,
    pinCode,
    state,
    shippingPhoneNumber,
    poNumber,
    poDate,
    items,
    totalAmount,
    topsection,
    Notes,
    tnc,
    signature,
  });

  try {
    const savedProjectOrder = await projectOrder.save();
    res.status(201).json(savedProjectOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addItemToProjectOrder = async (req, res) => {
  const { poNumber } = req.params;
  const { description, unit, quantity, ratePerUnit,gstPercentage,discount } = req.body;
  
  try {
    // Find the project order by PO number
    const projectOrder = await ProjectOrder.findOne({ poNumber });
  
    // Create a new item
    const newItem = {
      sno,
      description,
      unit,
      quantity,
      ratePerUnit,
      gstPercentage,
      discount,
      amount: quantity * ratePerUnit * (1 + gstPercentage / 100) * (1 - discount/100),
      subItems: subItems || []
    };
  
    // Add the new item to the project order's items array
    projectOrder.items.push(newItem);

    // Recalculate the total amount
    projectOrder.totalAmount = calculateTotalAmount(projectOrder.items);
  
    // Save the updated project order
    const updatedProjectOrder = await projectOrder.save();
  
    res.json(updatedProjectOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectOrderByPoNumber = async (req, res) => {
  const { poNumber } = req.params;

  try {
    // Find the project order in the database by its PO number
    const projectOrder = await ProjectOrder.findOne({ poNumber });

    if (!projectOrder) {
      // If project order is not found, return a 404 status code and a message
      return res.status(404).json({ message: 'Project order not found' });
    }

    // If project order is found, return it in the response
    res.json(projectOrder);
  } catch (error) {
    // If an error occurs, return a 500 status code and an error message
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.editProjectOrder = async (req, res) => {
  const { poNumber } = req.params;
  const updatedProjectOrder = req.body;

  try {
    const editedProjectOrder = await ProjectOrder.findOneAndUpdate(
      { poNumber },
      { $set: updatedProjectOrder }, // Use $set operator to update all fields
      { new: true }
    );

    res.json(editedProjectOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editItemInProjectOrder = async (req, res) => {
  const { poNumber, itemId } = req.params;
  const updatedItem = req.body;

  try {
    const projectOrder = await ProjectOrder.findOne({ poNumber });
    const itemIndex = projectOrder.items.findIndex(item => item._id.toString() === itemId);

    if (itemIndex !== -1) {
      projectOrder.items[itemIndex] = {
        ...projectOrder.items[itemIndex]._doc,
        ...updatedItem,
        amount: updatedItem.quantity * updatedItem.ratePerUnit, // Recalculate the amount
      };

      projectOrder.totalAmount = calculateTotalAmount(projectOrder.items);

      const updatedProjectOrder = await projectOrder.save();
      res.json(updatedProjectOrder);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

