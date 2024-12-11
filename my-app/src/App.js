import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import UserRegister from './Components/User/UserRegister';
import ProductList from './Components/User/ProductList';
import ProductDescription from './Components/ProductDescription';
import AddPrescription from './Components/AddPrescription';
import PrescriptionPage from './Components/Doctor/DoctorPrescriptionPage';
import PharmacyDetails from './Components/pharmacydetails';
import PrescriptionPage1 from './Components/Pharmacy/pharmacyDashboard';
import CustomerCart from './Components/User/CustomerCart';
import ProtectedRoute from './Components/ProtectedRoute'; // Import ProtectedRoute
import SetRolePage from './Components/SetRolePage'; // Import SetRolePage
import PharmacyRegistration from './Components/Pharmacy/pharmaRegister';
import LoginPage from './Components/Pharmacy/pharmacyLogin';
import DoctorRegistration from './Components/Doctor/doctorRegister';
import DoctorLogin from './Components/Doctor/doctorLogin';
import UserLogin from './Components/User/userlogin';
import PatientForm from './Components/User/patientdetails';
import ProductForm from './Components/productadd';
import PrescriptionStatusPage from './Components/User/OrderStatus'
import ReviewForm from './Components/sellerreview';
import LocationApp from './Components/LocationApp';


const App = () => {
  return (
    <Router>
      {/* {NavBar} */}
      <Navbar />
      <Routes>
        
        {/* Public Routes */}
        <Route path="/" element={<SetRolePage />} /> {/* Add route for role setting */}

        {/* {Pharmacy} */}
        <Route path="/Pharmacydetails" element={<PharmacyDetails />} />
        <Route path="/prescription" element={<AddPrescription />} />
        <Route path="/newPharmacy" element={<PharmacyRegistration />} />
        <Route path="/pharmacyLogin" element={<LoginPage />} />
        <Route path="/pharmacyDashboard" element={<PrescriptionPage1 />} />

         {/* {Doctors} */}
        <Route path="/NewDoctor" element={<DoctorRegistration />} />
        <Route path="/DoctorLogin" element={<DoctorLogin />} />
        <Route path="/DoctorDashboard" element={<PrescriptionPage />} />

        {/* {Users} */}
        <Route path="/newUser" element={<UserRegister />} />
        <Route path="/UserLogin" element={<UserLogin />} />
        <Route path="/UserDashboard" element={<ProductList />} />
        <Route path="/desc/:id" element={<ProductDescription />} />
        <Route path="/cart" element={<CustomerCart />} />
        <Route path="/patientdetails" element={<PatientForm />} />
        <Route path="/newproducts" element={<ProductForm />} />
        <Route path="/orders" element={<PrescriptionStatusPage />} />
        <Route path="/review" element={<ReviewForm />} />
        <Route path="/location" element={<LocationApp />} />
        {/* Redirect for undefined routes */}
        <Route path="*" element={<Navigate to="/nopage" />} />
      </Routes>
    </Router>
  );
};

export default App;
