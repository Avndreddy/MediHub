const mongoose = require("mongoose");

const patientDetailsSchema = new mongoose.Schema({
  orderID: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
  },
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AccountHolder",
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  patientContactInfo: {
    type: Number,
    required: true,
  },
  customerContactInfo: {
    type: Number,
    required: true,
  },
  email: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  address: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  prescription: {
    type: String,
  },
  age: {
    type: Number,
    required: true,
  },
});

const PatientDetails = mongoose.model("PatientDetails", patientDetailsSchema);

module.exports = PatientDetails;
