const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const doctorSchema = new mongoose.Schema({
  doctor_id: { type: mongoose.Schema.Types.ObjectId, unique: true },
  doctorName: { type: String, required: true },
  doctorsContactInfo: { type: Number, required: true, unique: true },
  doctorsEmail: { type: String, required: true, unique: true },
  setRole: { type: String, required: true, default: 'doctor' },
  affiliatedHospital: { type: String, required: true },
  password: { type: String, required: true },
  doctorLicense: { type: String, required: true },
});

// Hash password before saving
doctorSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare password
doctorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
