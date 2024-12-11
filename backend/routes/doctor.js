// const express = require("express");
// const mongoose = require("mongoose");
// const Doctor = require("../models/doctor");

// const router = express.Router();

// // Create a new doctor
// router.post("/", (req, res) => {
//   const doctor_id = new mongoose.Types.ObjectId();
//   const newDoctor = new Doctor({
//     doctor_id: doctor_id,
//     doctorName: req.body.doctorName,
//     doctorsContactInfo: req.body.doctorsContactInfo,
//     doctorsEmail: req.body.doctorsEmail,
//     setRole:req.body.setRole,
//     affiliatedHospital: req.body.affiliatedHospital,
//     _id: doctor_id
//   });

//   newDoctor
//     .save()
//     .then((doctor) => res.status(201).json(doctor))
//     .catch((err) => res.status(400).json({ error: err.message }));
// });

// // Get all doctors
// router.get("/", (req, res) => {
//   Doctor.find()
//     .then((doctors) => res.json(doctors))
//     .catch((err) => res.status(404).json({ error: err.message }));
// });

// // Get a single doctor by ID
// router.get("/:id", (req, res) => {
//   Doctor.findById(req.params.id)
//     .then((doctor) => {
//       if (!doctor) {
//         return res.status(404).json({ error: "Doctor not found" });
//       }
//       res.json(doctor);
//     })
//     .catch((err) => res.status(400).json({ error: err.message }));
// });

// // Update a doctor by ID
// router.put("/:id", (req, res) => {
//   Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true })
//     .then((doctor) => {
//       if (!doctor) {
//         return res.status(404).json({ error: "Doctor not found" });
//       }
//       res.json(doctor);
//     })
//     .catch((err) => res.status(400).json({ error: err.message }));
// });

// // Partially update a doctor by ID
// router.patch("/:id", (req, res) => {
//   Doctor.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
//     .then((doctor) => {
//       if (!doctor) {
//         return res.status(404).json({ error: "Doctor not found" });
//       }
//       res.json(doctor);
//     })
//     .catch((err) => res.status(400).json({ error: err.message }));
// });

// // Delete a doctor by ID
// router.delete("/:id", (req, res) => {
//   Doctor.findByIdAndDelete(req.params.id)
//     .then((doctor) => {
//       if (!doctor) {
//         return res.status(404).json({ error: "Doctor not found" });
//       }
//       res.json({ message: "Doctor deleted successfully" });
//     })
//     .catch((err) => res.status(400).json({ error: err.message }));
// });

// module.exports = router;


const express = require("express");
const mongoose = require("mongoose");
const Doctor = require("../models/doctor");
const jwt = require("jsonwebtoken");

const router = express.Router();

// JWT secret key
const JWT_SECRET = 'avnd';

// Create a new doctor (registration)
router.post("/register", async (req, res) => {
  try {
    const doctor_id = new mongoose.Types.ObjectId();
    const newDoctor = new Doctor({
      doctor_id: doctor_id,
      doctorName: req.body.doctorName,
      doctorsContactInfo: req.body.doctorsContactInfo,
      doctorsEmail: req.body.doctorsEmail,
      setRole: req.body.setRole,
      affiliatedHospital: req.body.affiliatedHospital,
      password: req.body.password,
      doctorLicense: req.body.doctorLicense,
      _id: doctor_id
    });

    await newDoctor.save();
    res.status(201).json({ message: 'Doctor registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login and get JWT token
router.post("/login", async (req, res) => {
  try {
    const { doctorsEmail, password } = req.body;
    const doctor = await Doctor.findOne({ doctorsEmail });
    
    if (!doctor || !(await doctor.comparePassword(password))) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const id=doctor._id;
    const token = jwt.sign({ id: doctor._id, role: doctor.setRole }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token,id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Protect routes with JWT middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Example of protected route
router.get("/protected", authenticateJWT, (req, res) => {
  res.json({ message: 'You have access to this protected route', user: req.user });
});

// Other routes...

module.exports = router;
