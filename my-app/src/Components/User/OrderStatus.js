import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Collapse, Paper, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const PrescriptionStatusPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [openComments, setOpenComments] = useState({});
  const [openFullDetails, setOpenFullDetails] = useState(null); // Use null for no open dialog
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch all prescriptions
    axios.get('http://localhost:5000/api/prescriptions')
      .then(response => setPrescriptions(response.data))
      .catch(error => console.error('Error fetching prescriptions:', error));
    
    // Fetch product details
    axios.get('http://localhost:5000/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleToggleComment = (prescriptionId, type) => {
    setOpenComments(prev => ({
      ...prev,
      [prescriptionId]: {
        ...prev[prescriptionId],
        [type]: !prev[prescriptionId]?.[type]
      }
    }));
  };

  const handleOpenFullDetails = (prescriptionId) => {
    setOpenFullDetails(prescriptionId);
  };

  const handleCloseFullDetails = () => {
    setOpenFullDetails(null);
  };

  const findProductName = (productID) => {
    const product = products.find(p => p._id === productID);
    return product ? product.productName : '';
  };

  const findProductImg = (productID) => {
    const product = products.find(p => p._id === productID);
    return product ? product.images[0] : '';
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#FFFFFF' }}>
      <Typography variant="h4" sx={{ color: '#006EBE', marginBottom: 3, fontWeight: 700 }}>
        Prescription Statuses
      </Typography>
      {prescriptions.map(prescription => (
        <Paper
          key={prescription._id}
          sx={{
            marginBottom: 3,
            padding: 3,
            backgroundColor: '#F9F9F9',
            boxShadow: 3,
            borderRadius: 2
          }}
        >
          <Typography variant="h6" sx={{ color: '#006EBE', fontWeight: 600 }}>
            Prescription ID: {prescription._id}
          </Typography>

          <Paper
            sx={{
              padding: 2,
              marginTop: 2,
              backgroundColor: '#FFFFFF',
              borderRadius: 2,
              boxShadow: 2
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>Order Status: {prescription.Order_Status}</Typography>
            <Button
              onClick={() => handleOpenFullDetails(prescription._id)}
              sx={{
                backgroundColor: '#006EBE',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#0054A3'
                },
                marginTop: 2
              }}
            >
              {openFullDetails === prescription._id ? 'Hide Full Prescription' : 'View Full Prescription'}
            </Button>
          </Paper>

          {/* Doctor Status Box */}
          <Paper
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 2,
              padding: 2,
              backgroundColor: '#E3F2FD',
              borderRadius: 2,
              boxShadow: 2
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#006EBE' }}>
              Doctor Status: {prescription.Doctors_Status[0]}
            </Typography>
            <Button
              onClick={() => handleToggleComment(prescription._id, 'doctorComment')}
              sx={{
                backgroundColor: '#EB2026',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#C21A1E'
                }}
              }
            >
              {openComments[prescription._id]?.doctorComment ? 'Hide Doctor Comment' : 'Show Doctor Comment'}
            </Button>
          </Paper>
          <Collapse in={openComments[prescription._id]?.doctorComment}>
            <Paper
              sx={{
                padding: 2,
                marginTop: 1,
                backgroundColor: '#FFFFFF',
                borderRadius: 2,
                boxShadow: 1
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#EB2026' }}>Doctor Comment:</Typography>
              <Typography variant="body2">{prescription.Doctor_Comment}</Typography>
            </Paper>
          </Collapse>

          {/* Pharmacy Status Box */}
          <Paper
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 2,
              padding: 2,
              backgroundColor: '#E3F2FD',
              borderRadius: 2,
              boxShadow: 2
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#006EBE' }}>
              Pharmacy Status: {prescription.Pharmacy_Status[0]}
            </Typography>
            <Button
              onClick={() => handleToggleComment(prescription._id, 'pharmacyComment')}
              sx={{
                backgroundColor: '#006EBE',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#0054A3'
                }
              }}
            >
              {openComments[prescription._id]?.pharmacyComment ? 'Hide Pharmacy Comment' : 'Show Pharmacy Comment'}
            </Button>
          </Paper>
          <Collapse in={openComments[prescription._id]?.pharmacyComment}>
            <Paper
              sx={{
                padding: 2,
                marginTop: 1,
                backgroundColor: '#FFFFFF',
                borderRadius: 2,
                boxShadow: 1
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#006EBE' }}>Pharmacy Comment:</Typography>
              <Typography variant="body2">{prescription.Pharmacy_Comment}</Typography>
            </Paper>
          </Collapse>

          {/* Full Prescription Details Modal */}
          <Dialog
            open={openFullDetails === prescription._id}
            onClose={handleCloseFullDetails}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle sx={{ backgroundColor: '#006EBE', color: '#FFFFFF', fontWeight: 600 }}>
              Full Prescription Details
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
                  <Typography variant="body2"> {/* Display or process the prescription buffer here */} </Typography>
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

                <Box sx={{ marginTop: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Total Cost:</Typography>
                  <Typography variant="body1">{prescription.totalCost}</Typography>
                </Box>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseFullDetails}
                sx={{
                  backgroundColor: '#006EBE',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#0054A3'
                  }
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      ))}
    </Box>
  );
};

export default PrescriptionStatusPage;
