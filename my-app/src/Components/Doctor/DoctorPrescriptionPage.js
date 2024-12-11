import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Paper, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';

const DoctorsUpdatesPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [openFullDetails, setOpenFullDetails] = useState(null);
  const [products, setProducts] = useState([]);

  // Modal state and form data
  const [showModal, setShowModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [doctorComment, setDoctorComment] = useState('');
  const [doctorsStatus, setDoctorsStatus] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [error, setError] = useState('');

  // Image popup state
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const doctorId = localStorage.getItem('DoctorId');

  useEffect(() => {
    axios.get('http://localhost:5000/api/prescriptions')
      .then(response => setPrescriptions(response.data))
      .catch(error => console.error('Error fetching prescriptions:', error));
    
    axios.get('http://localhost:5000/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleOpenFullDetails = (prescriptionId) => {
    setOpenFullDetails(prescriptionId);
  };

  const handleCloseFullDetails = () => {
    setOpenFullDetails(null);
  };

  const handleOpenModal = (prescription) => {
    setSelectedPrescription(prescription);
    setDoctorComment(prescription.Doctor_Comment || '');
    setDoctorsStatus(prescription.Doctors_Status[0] || '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPrescription(null);
  };

  const handleUpdatePrescription = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (prescriptionFile) {
      formData.append('Prescription', prescriptionFile);
    }
    formData.append('Doctor_ID', doctorId);
    formData.append('Doctor_Comment', doctorComment);
    formData.append('Doctors_Status', doctorsStatus);

    try {
      await axios.patch(`http://localhost:5000/api/prescriptions/${selectedPrescription._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Prescription updated successfully!');
      const response = await axios.get('http://localhost:5000/api/prescriptions');
      setPrescriptions(response.data);
      handleCloseModal();
    } catch (error) {
      console.error('Error updating prescription:', error);
      setError('Failed to update prescription.');
      toast.error('Failed to update prescription.');
    }
  };

  const handleOpenImagePopup = (imageUrl) => {
    setImageUrl(`http://localhost:5000/${imageUrl}`);
    setShowImagePopup(true);
  };

  const handleCloseImagePopup = () => {
    setShowImagePopup(false);
    setImageUrl('');
  };

  const findProductName = (productID) => {
    const product = products.find(p => p._id === productID);
    return product ? product.productName : '';
  };

  const findProductImg = (productID) => {
    const product = products.find(p => p._id === productID);
    return product ? product.images[0] : '';
  };

  // Filter prescriptions by status
  const prescriptionSections = {
    Pending: prescriptions.filter(prescription =>
      (!prescription.Doctor_ID[0] || prescription.Doctor_ID[0] === doctorId) && prescription.Doctors_Status[0] === 'Pending'
    ),
    Approved: prescriptions.filter(prescription =>
      (prescription.Doctor_ID[0] === doctorId) && prescription.Doctors_Status[0] === 'Approved'
    ),
    Rejected: prescriptions.filter(prescription =>
      (prescription.Doctor_ID[0] === doctorId) && prescription.Doctors_Status[0] === 'Rejected'
    ),
    Emergency: prescriptions.filter(prescription =>
      (prescription.Doctor_ID[0] === doctorId) && prescription.Doctors_Status[0] === 'Emergency'
    ),
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#FFFFFF' }}>
      <Typography variant="h4" sx={{ color: '#006EBE', marginBottom: 3, fontWeight: 700 }}>
        Prescription Statuses
      </Typography>

      {/* Kanban Board Layout */}
      <Box sx={{ display: 'flex', gap: 4, overflowX: 'auto', padding: 2 }}>
        {Object.keys(prescriptionSections).map(status => (
          <Box
            key={status}
            sx={{
              minWidth: '300px',
              maxWidth: '300px',
              backgroundColor: '#F9F9F9',
              borderRadius: 2,
              padding: 2,
              boxShadow: 3,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" sx={{ color: '#006EBE', fontWeight: 600, marginBottom: 2 }}>
              {status}
            </Typography>
            {prescriptionSections[status].length === 0 ? (
              <Typography variant="body1" sx={{ marginBottom: 2 }}>
                No prescriptions available for {status.toLowerCase()} status.
              </Typography>
            ) : (
              prescriptionSections[status].map(prescription => (
                <Paper
                  key={prescription._id}
                  sx={{
                    marginBottom: 2,
                    padding: 2,
                    backgroundColor: '#FFFFFF',
                    boxShadow: 1,
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>Prescription ID: {prescription._id}</Typography>
                  <Button
                    onClick={() => handleOpenFullDetails(prescription._id)}
                    sx={{
                      backgroundColor: '#006EBE',
                      color: '#FFFFFF',
                      '&:hover': {
                        backgroundColor: '#0054A3'
                      },
                      marginTop: 1
                    }}
                  >
                    {prescription._id === openFullDetails ? 'Hide Details' : 'View Details'}
                  </Button>
                  {/* Doctor Status Box */}
                  <Paper
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 1,
                      padding: 1,
                      backgroundColor: '#E3F2FD',
                      borderRadius: 1,
                      boxShadow: 1
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#006EBE' }}>
                      Doctor Status: {prescription.Doctors_Status[0]}
                    </Typography>
                    <Button
                      onClick={() => handleOpenModal(prescription)}
                      sx={{
                        backgroundColor: '#006EBE',
                        color: '#FFFFFF',
                        '&:hover': {
                          backgroundColor: '#0054A3'
                        }}
                      }
                    >
                      Update
                    </Button>
                  </Paper>
                </Paper>
              ))
            )}
          </Box>
        ))}
      </Box>

      {/* Update Prescription Modal */}
      <Dialog
        open={showModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ backgroundColor: '#006EBE', color: '#FFFFFF', fontWeight: 600 }}>
          Update Prescription
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleUpdatePrescription} sx={{ padding: 2 }}>
            <TextField
              fullWidth
              label="Doctor Comment"
              multiline
              rows={4}
              value={doctorComment}
              onChange={(e) => setDoctorComment(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <Select
              fullWidth
              value={doctorsStatus}
              onChange={(e) => setDoctorsStatus(e.target.value)}
              sx={{ marginBottom: 2 }}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Emergency">Emergency</MenuItem>
            </Select>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPrescriptionFile(e.target.files[0])}
              sx={{ marginBottom: 2 }}
            />
            <DialogActions>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button
                type="submit"
                sx={{ backgroundColor: '#006EBE', color: '#FFFFFF', '&:hover': { backgroundColor: '#0054A3' }}}
              >
                Update
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Prescription Details Dialog */}
      {prescriptions.filter(p => p._id === openFullDetails).map(prescription => (
        <Dialog
          key={prescription._id}
          open={!!openFullDetails}
          onClose={handleCloseFullDetails}
          fullWidth
        >
          <DialogTitle sx={{ backgroundColor: '#006EBE', color: '#FFFFFF', fontWeight: 600 }}>
            Prescription Details
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCloseFullDetails}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Paper
              sx={{
                padding: 3,
                backgroundColor: '#F0F8FF',
                borderRadius: 2,
                boxShadow: 2
              }}
            >
              <Typography variant="h6" sx={{ color: '#006EBE', fontWeight: 600 }}>
                Prescription Details
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              <Box sx={{ marginBottom: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Patient Name:</Typography>
                <Typography variant="body2">{prescription.Patient_Name}</Typography>
              </Box>
              <Box sx={{ marginBottom: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Patient Phone:</Typography>
                <Typography variant="body2">{prescription.Patient_Phone_Number}</Typography>
              </Box>
              <Box sx={{ marginBottom: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Patient Email:</Typography>
                <Typography variant="body2">{prescription.Patient_Email}</Typography>
              </Box>
              <Box sx={{ marginBottom: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Patient Address:</Typography>
                <Typography variant="body2">{prescription.Patient_Address}</Typography>
              </Box>
              <Box sx={{ marginBottom: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Prescription:</Typography>
                {prescription.Prescription && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenImagePopup(prescription.Prescription)}
                    sx={{ marginTop: 1 }}
                  >
                    View Prescription
                  </Button>
                )}
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="h6" sx={{ color: '#006EBE', fontWeight: 600 }}>Ordered Products:</Typography>
                {prescription.products.map(product => (
                  <Paper
                    key={product.productID}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 2,
                      padding: 2,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 2,
                      boxShadow: 1
                    }}
                  >
                    <img
                      alt='Product'
                      src={findProductImg(product.productID)}
                      width={'75px'}
                      style={{ padding: "10px" }}
                    />
                    <Box sx={{ marginLeft: 2 }}>
                      <Typography variant="body1">{findProductName(product.productID)}</Typography>
                      <Typography variant="body2">Quantity: {product.quantity}</Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Paper>
          </DialogContent>
        </Dialog>
      ))}

      {/* Prescription Image Popup */}
      <Dialog
        open={showImagePopup}
        onClose={handleCloseImagePopup}
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#006EBE', color: '#FFFFFF', fontWeight: 600 }}>
          Prescription Image
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseImagePopup}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Prescription"
              style={{ width: '100%', height: 'auto' }}
            />
          ) : (
            <Typography variant="body1">No image available</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DoctorsUpdatesPage;
