const express = require('express');
const router = express.Router();
const PatientDetails = require('../models/PatientDetails');
const upload = require('../middleware/multer');
const mongoose = require("mongoose");

// Create a new patient record with prescription
router.post('/', upload.single('prescription'), async (req, res) => {
  try {
    const orderid = new mongoose.Types.ObjectId();
    req.body.orderID = orderid;
    const patientData = {
      ...req.body,
      prescription: req.file ? req.file.path : '',
      _id:orderid // Save file path
    }; 
    const newPatient = new PatientDetails(patientData);
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update patient record with prescription file
router.patch('/:id', upload.single('prescription'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.file) {
      updateData.prescription = req.file.path; // Update file path
    }

    const updatedPatient = await PatientDetails.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedPatient) return res.status(404).json({ error: 'Patient not found' });
    res.json(updatedPatient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to get patient records based on customerID
router.get('/', async (req, res) => {
  try {
    const { customerID } = req.query;
    if (!customerID) {
      return res.status(400).json({ error: 'CustomerID is required' });
    }
    
    // Find patients with the provided customerID
    const patients = await PatientDetails.find({ customerID });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Delete patient record by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedPatient = await PatientDetails.findByIdAndDelete(req.params.id);
    if (!deletedPatient) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient record deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
