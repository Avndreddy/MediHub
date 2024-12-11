const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
    Prescription_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    Order_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    Patient_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    Patient_Name: { type: String, required: true },
    Patient_Phone_Number: { type: Number, required: true },
    Patient_Email: { type: String, required: true },
    Patient_Address: { type: String, required: true },
    Prescription: { type: String },  // Assuming this is a file path or URL
    Doctor_ID: [{ type: mongoose.Schema.Types.ObjectId }],
    Doctors_Status: { 
        type: [String], 
        enum: [
            'Pending',
            'Approved',
            'Rejected',
            'Emergency'
        ], 
        default: ['Pending'] 
    },
    Doctor_Comment: { type: String },
    pharmacy_id: [{ type: mongoose.Schema.Types.ObjectId }],
    Pharmacy_Status: { 
        type: [String], 
        enum: [
            'Pending',
            'Waiting for Doctor Review',
            'Order Accepted',
            'Out for Delivery',
            'Delivered'
        ], 
        default: ['Waiting for Doctor Review'] 
    },
    Pharmacy_Comment: { type: String },
    products: [
        {
            productID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                default: 0,
                min: [0, 'Quantity must be positive']
            },
        },
    ],
    totalCost: {
        type: Number,
        default: 0,
    }
});

 const Pres=mongoose.model('Prescription', PrescriptionSchema);
 module.exports =Pres;
