const express = require('express');
const Prescription=require("../models/Prescription");
const router = express.Router();
const multer = require('multer');
const mongoose = require("mongoose");
const Pres = require('../models/Prescription');

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' }); // Adjust destination as needed

// PATCH route to update Pharmacy_Comment and Pharmacy_Status
router.patch('/:id/pharmacy', async (req, res) => {
    const { pharmacyComment, pharmacyStatus } = req.body;
    const prescriptionId = req.params.id;

    console.log('PATCH request received for prescription:', prescriptionId);
    console.log('Request body:', req.body); // Log the request body

    try {
        const updatedPrescription = await Prescription.findByIdAndUpdate(
            prescriptionId,
            { Pharmacy_Comment: pharmacyComment, Pharmacy_Status: pharmacyStatus },
            { new: true } // Return updated document
        );

        if (!updatedPrescription) {
            console.log('Prescription not found:', prescriptionId);
            return res.status(404).json({ error: 'Prescription not found' });
        }

        console.log('Prescription updated successfully:', updatedPrescription);
        res.json(updatedPrescription);
    } catch (err) {
        console.error('Error updating prescription:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});


// Update prescription by ID
router.patch('/:id', upload.single('Prescription'), async (req, res) => {
  const {Doctor_ID, Doctor_Comment, Doctors_Status } = req.body;
  const prescriptionId = req.params.id;

  try {
    console.log('Updating prescription:', prescriptionId);
    console.log('Request body:', req.body); // Check if body contains expected fields

    let updateFields = {Doctor_ID ,Doctor_Comment, Doctors_Status };

    // Check if there's a file uploaded
    if (req.file) {
      updateFields.Prescription = req.file.path; // Save file path or handle Buffer as needed
    }

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      prescriptionId,
      updateFields,
      { new: true }
    );

    if (!updatedPrescription) {
      console.log('Prescription not found:', prescriptionId);
      return res.status(404).json({ error: 'Prescription not found' });
    }

    console.log('Prescription updated successfully:', updatedPrescription);
    res.json(updatedPrescription);
  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(400).json({ error: error.message });
  }
});

// // Create a new prescription
// router.post('/', async (req, res) => {
//   try {

//     const prescription = new Prescription(req.body);
//     await prescription.save();
//     res.status(201).send(prescription);
//   } catch (error) {
//     console.error('Error creating prescription:', error);
//     res.status(400).json({ error: error.message });
//   }
// });



// Read all prescriptions
router.get('/', async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.status(200).send(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(400).json({ error: error.message });
  }
});

// Read one prescription by ID
router.get('/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    res.status(200).send(prescription);
  } catch (error) {
    console.error('Error fetching prescription by ID:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete prescription by ID
router.delete('/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    res.status(200).json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    res.status(400).json({ error: error.message });
  }
});



// POST /prescriptions - Create a new prescription
router.post('/', async (req, res) => {
    try {
        const {
            Patient_id,
            Patient_Name,
            Patient_Phone_Number,
            Patient_Email,
            Patient_Address,
            Prescription,
            products,
            totalCost,
            pharmacy_id
        } = req.body;

        console.log('Request Body:', req.body);

        const newid = new mongoose.Types.ObjectId();
        console.log('Generated ID:', newid);

        const newPrescription = new Pres({
            Prescription_id: newid,
            Order_id: newid,
            Patient_id,
            Patient_Name,
            Patient_Phone_Number,
            Patient_Email,
            Patient_Address,
            Prescription,
            products,
            totalCost,
            Doctor_ID: [],
            Doctors_Status: ['Pending'],
            Doctor_Comment: '',
            pharmacy_id:pharmacy_id,
            Pharmacy_Status: ['Pending'],
            Pharmacy_Comment: '',
            _id:newid
        });

        console.log('Created Prescription Object:', newPrescription);

        await newPrescription.save();

        res.status(201).json({
            message: 'Prescription created successfully',
            prescription: newPrescription
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            message: 'Failed to create prescription',
            error: error.message
        });
    }
});



module.exports = router;
