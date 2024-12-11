const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const pharmacySchema = new mongoose.Schema({
  pharmacy_id: { type: mongoose.Schema.Types.ObjectId }, // Removed unique constraint
  setRole: { type: String, required: true, default: 'pharmacy' },
  outletName: { type: String, required: true, unique: true },
  pharmacyLicence: { type: String, required: true, unique: true },
  sellerName: { type: String, required: true },
  seller_id: { type: mongoose.Schema.Types.ObjectId }, // Removed unique constraint
  email: { type: String, required: true, unique: true },
  contactInfo: { type: String, required: true },
  location: { type: String, required: true },
  pinCode: { type: Number, required: true },
  outletPictures: { type: String },
  isActive: { type: Boolean, default: false },
  availableDelivery: { type: Boolean, default: false },
  storeSpecialty:{type: String},
  storeTimings: { type: String, default: "" },
  kycStatus: { type: Boolean, default: false },
  password: { type: String, required: true }, // Ensure to hash passwords
  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90,
    validate: {
      validator: Number.isFinite,
      message: 'Latitude must be a finite number'
    }
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180,
    validate: {
      validator: Number.isFinite,
      message: 'Longitude must be a finite number'
    }
  }
});

pharmacySchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

pharmacySchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Pharmacy", pharmacySchema);
