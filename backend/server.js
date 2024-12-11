const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

// Import routes
const doctorRoutes = require("./routes/doctor");
const userRoutes = require('./routes/userRoutes');
const customerCartRoutes = require("./routes/customerCart");
const patientDetailsRoutes = require("./routes/patientDetails");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const productRoutes = require("./routes/productRoutes");
const sellerReviewRoutes = require("./routes/sellerReviewRoutes");
const prescriptionRoutes=require("./routes/prescriptionroute");
const logout=require("./routes/logout");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // Update with your frontend URL
  credentials: true
}));


// Connect to MongoDB
const db = 'mongodb://localhost:27017';
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Session middleware
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: db }),
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour
    httpOnly: true,
    secure: false // Set to true if using HTTPS
  }
}));

// Routes
//app.use('/api/auth', authRoutes);
app.use("/api/logout", logout);
app.use("/api/products", productRoutes);

app.use('/api/users', userRoutes);
app.use("/api/cart", customerCartRoutes);
app.use("/api/patient", patientDetailsRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use("/api/pharmacies", pharmacyRoutes);
app.use("/api/reviews", sellerReviewRoutes);
app.use("/api/doctors", doctorRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
