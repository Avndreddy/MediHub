import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, TextField, Typography, FormControl, Select, MenuItem, CircularProgress, Paper, Radio, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// Make sure to bind modal to your app element
Modal.setAppElement('#root'); // Change '#root' to your app root element if different

const PatientForm = () => {
  const userid = localStorage.getItem('customerId');
  const [patientData, setPatientData] = useState({
    customerID: userid,
    patientName: '',
    patientContactInfo: '',
    customerContactInfo: '',
    email: '',
    address: '',
    prescription: null,
    age: '',
    mode: 'order',
  });
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3); // Number of records initially visible
  const [allLoaded, setAllLoaded] = useState(false); // Flag to check if all records are loaded

 const nav=useNavigate();
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setPatientData((prevData) => ({ ...prevData, prescription: e.target.files[0] }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in patientData) {
      if (patientData[key] !== null && patientData[key] !== '') {
        formData.append(key, patientData[key]);
      }
    }
    try {
      await axios.post('http://localhost:5000/api/patient', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Patient record added successfully');
      setPatientData({
        customerID: userid,
        patientName: '',
        patientContactInfo: '',
        customerContactInfo: '',
        email: '',
        address: '',
        prescription: null,
        age: '',
        mode: 'order',
      });
      fetchPatients(); // Refresh patient list
      setShowFormModal(false); // Hide the form
    } catch (error) {
      console.error('Error adding patient record:', error);
      toast.error('Error adding patient record');
    }
  };

  // Handle edit submission
  const handleEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in patientData) {
      if (patientData[key] !== null && patientData[key] !== '') {
        formData.append(key, patientData[key]);
      }
    }
    try {
      await axios.patch(`http://localhost:5000/api/patient/${selectedPatientId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Patient record updated successfully');
      fetchPatients(); // Refresh patient list
      setShowEditModal(false); // Hide the edit form
    } catch (error) {
      console.error('Error updating patient record:', error);
      toast.error('Error updating patient record');
    }
  };

  // Fetch patients based on customerID
  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/patient', {
        params: { customerID: userid }
      });
      setPatients(response.data);
      if (response.data.length <= 3) {
        setAllLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching patient records:', error);
      toast.error('Error fetching patient records:');
    } finally {
      setLoading(false);
    }
  };

  // Delete patient record by ID
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/patient/${id}`);
      toast.success('Patient record deleted successfully');
      fetchPatients(); // Refresh patient list
    } catch (error) {
      console.error('Error deleting patient record:', error);
      toast.error('Error deleting patient record');
    }
  };

  // Fetch patient data for editing
  const handleEditClick = (patient) => {
    setSelectedPatientId(patient._id);
    setPatientData({
      patientName: patient.patientName,
      patientContactInfo: patient.patientContactInfo,
      customerContactInfo: patient.customerContactInfo,
      email: patient.email,
      address: patient.address,
      prescription: null, // Do not prefill prescription as file data cannot be set
      age: patient.age,
      mode: patient.mode,
    });
    setShowEditModal(true);
  };

  useEffect(() => {
    fetchPatients();
  }, [userid]);

  const openModal = (prescriptionUrl) => {
    setSelectedPrescription(prescriptionUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPrescription(null);
  };
  
  const handleRadioChange = (e) => {
    const patientId = e.target.value;
    const patient = patients.find(p => p._id === patientId); // Find the patient object by ID
    setSelectedPatient(patient);
    localStorage.setItem('selectedPatient', JSON.stringify(patient));
  };
  
  

const handleSelectionSubmit = async () => {
  // Retrieve selected patient details
  const selectedPatient = JSON.parse(localStorage.getItem('selectedPatient'));

  // Retrieve cart data from local storage
  const cartData = JSON.parse(localStorage.getItem('cart')) || {};
  const products = Array.isArray(cartData.products) ? cartData.products : [];
  const totalCost = cartData.totalCost || 0; // Default to 0 if totalCost is not provided

  // Extract product details for the payload
  const productDetails = products.map(item => ({
      productID: item.productID, // Assuming this is the correct field name
      quantity: item.quantity || 0 // Default to 0 if quantity is not provided
  }));

  if (selectedPatient) {
      try {
        const payload = {
          Patient_id: selectedPatient._id,
          Patient_Name: selectedPatient.patientName,
          Patient_Phone_Number: selectedPatient.patientContactInfo,
          Patient_Email: selectedPatient.email,
          Patient_Address: selectedPatient.address,
          Prescription: selectedPatient.prescription || '', // Handle undefined prescription
          products: productDetails,
          totalCost: totalCost,
          pharmacy_id: localStorage.getItem('SelectedPharmacy') || '' // Handle localStorage null/undefined
      };
          console.log('payload', payload);
          if(localStorage.getItem('cart')){
            toast.error('No Products in Cart, Please add products into Cart');
            
          }
          // Post request to your backend
          await axios.post('http://localhost:5000/api/prescriptions', payload, {
              headers: {
                  'Content-Type': 'application/json',
              },
          });
          nav('/orders');
          toast.success('Prescription created successfully');
          //localStorage.removeItem('cart');
          try{
              await axios.delete(`http://localhost:5000/api/cart/${localStorage.getItem('customerId')}`);
              //toast.success('Cart is cleared');
              console.log('Cart is cleared');
          }catch(error)
          {
            toast.error('Unable to clear cart');
          }
          localStorage.removeItem('selectedPatient');
         nav('/orders');
      } catch (error) {
          console.error('Error creating prescription:', error);
          toast.error('Error creating prescription');
      }
  } else {
      toast.error('Please select a patient.');
  }
};


  const handleLoadMore = () => {
    if (visibleCount >= patients.length) {
      setAllLoaded(true);
    } else {
      setVisibleCount(visibleCount + 3);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
      <ToastContainer />
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowFormModal(true)}
        sx={{ margin: 1, backgroundColor: '#1976d2', color: '#fff', '&:hover': { backgroundColor: '#1565c0' } }}
      >
        Add New Patient
      </Button>

      {/* Form Modal */}
      <Modal
        isOpen={showFormModal}
        onRequestClose={() => setShowFormModal(false)}
        style={{
          content: {
            width: '80%',
            maxWidth: '600px',
            margin: 'auto',
            padding: '24px',
          },
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Add Patient Details</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowFormModal(false)}
            sx={{ backgroundColor: '#dc004e', color: '#fff', '&:hover': { backgroundColor: '#c51162' } }}
          >
            Close
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Patient Name"
            name="patientName"
            value={patientData.patientName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Patient Contact Info"
            name="patientContactInfo"
            value={patientData.patientContactInfo}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Customer Contact Info"
            name="customerContactInfo"
            value={patientData.customerContactInfo}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            value={patientData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Address"
            name="address"
            value={patientData.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ marginBottom: 2 }}
          />
          <input
            type="file"
            name="prescription"
            onChange={handleFileChange}
            style={{ margin: '16px 0' }}
          />
          <TextField
            label="Age"
            name="age"
            value={patientData.age}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth margin="normal" required>
            <Select
              name="mode"
              value={patientData.mode}
              onChange={handleChange}
            >
              <MenuItem value="order">Order</MenuItem>
              <MenuItem value="walkin">Walk-In</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Submit
          </Button>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onRequestClose={() => setShowEditModal(false)}
        style={{
          content: {
            width: '80%',
            maxWidth: '600px',
            margin: 'auto',
            padding: '24px',
          },
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Edit Patient Details</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowEditModal(false)}
            sx={{ backgroundColor: '#dc004e', color: '#fff', '&:hover': { backgroundColor: '#c51162' } }}
          >
            Close
          </Button>
        </div>
        <form onSubmit={handleEdit}>
          <TextField
            label="Patient Name"
            name="patientName"
            value={patientData.patientName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Patient Contact Info"
            name="patientContactInfo"
            value={patientData.patientContactInfo}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Customer Contact Info"
            name="customerContactInfo"
            value={patientData.customerContactInfo}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            value={patientData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Address"
            name="address"
            value={patientData.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ marginBottom: 2 }}
          />
          <input
            type="file"
            name="prescription"
            onChange={handleFileChange}
            style={{ margin: '16px 0' }}
          />
          <TextField
            label="Age"
            name="age"
            value={patientData.age}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth margin="normal" required>
            <Select
              name="mode"
              value={patientData.mode}
              onChange={handleChange}
            >
              <MenuItem value="order">Order</MenuItem>
              <MenuItem value="walkin">Walk-In</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Update
          </Button>
        </form>
      </Modal>

      {/* Display patient records */}
      {loading ? (
        <CircularProgress />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {patients.slice(0, visibleCount).map(patient => (
            <Paper key={patient._id} sx={{ padding: 2, backgroundColor: '#f5f5f5', boxShadow: 2 }}>
              <FormControl component="fieldset">
                <FormControlLabel
                  control={<Radio />}
                  value={patient._id}
                  onChange={handleRadioChange}
                  label={
                    <>
                      <Typography><strong>Name:</strong> {patient.patientName}</Typography>
                      <Typography><strong>Contact Info:</strong> {patient.patientContactInfo}</Typography>
                      <Typography><strong>Customer Contact Info:</strong> {patient.customerContactInfo}</Typography>
                      <Typography><strong>Email:</strong> {patient.email}</Typography>
                      <Typography><strong>Address:</strong> {patient.address}</Typography>
                      <Typography><strong>Age:</strong> {patient.age}</Typography>
                      <Typography><strong>Mode:</strong> {patient.mode}</Typography>
                      {patient.prescription && (
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => openModal(`http://localhost:5000/${patient.prescription}`)}
                          sx={{ marginTop: 1 }}
                        >
                          View Prescription
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(patient._id)}
                        sx={{ marginTop: 1 }}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="contained"
                        color="info"
                        onClick={() => handleEditClick(patient)}
                        sx={{ marginTop: 1, marginLeft: 1 }}
                      >
                        Edit
                      </Button>
                    </>
                  }
                />
              </FormControl>
            </Paper>
          ))}
          {!allLoaded && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleLoadMore}
              sx={{ margin: 1, backgroundColor: '#1976d2', color: '#fff', '&:hover': { backgroundColor: '#1565c0' } }}
            >
              Load More
            </Button>
          )}
          <Button
            onClick={handleSelectionSubmit}
            sx={{ margin: 1, backgroundColor: '#dc004e', color: '#fff', '&:hover': { backgroundColor: '#c51162' } }}
          >
            Submit Selected Patient
          </Button>
        </div>
      )}

      {/* Modal for displaying prescription */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            width: '80%',
            height: '80%',
            margin: 'auto',
            overflow: 'auto',
          },
        }}
      >
        <div style={{ padding: '16px' }}>
          <Typography variant="h6">Prescription</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={closeModal}
            sx={{ margin: 1, backgroundColor: '#dc004e', color: '#fff', '&:hover': { backgroundColor: '#c51162' } }}
          >
            Close
          </Button>
        </div>
        {selectedPrescription && (
          <iframe
            src={selectedPrescription}
            style={{ width: '100%', height: '80vh', border: 'none' }}
            title="Prescription File"
          />
        )}
      </Modal>
    </div>
  );
};

export default PatientForm;
