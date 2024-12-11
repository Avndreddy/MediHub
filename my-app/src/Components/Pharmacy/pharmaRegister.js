import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Pharma from '../../assets/pharma.jpg';

import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { styled } from '@mui/system';

// Custom theme with logo colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#006EBE', // Blue
    },
    secondary: {
      main: '#EB2026', // Red
    },
    background: {
      default: '#FFFFFF', // White
    },
    text: {
      primary: '#212121', // Dark Grey
    },
  },
});

const NavButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  background: 'linear-gradient(45deg, #006EBE 30%, #003c71 90%)',
  '&:hover': {
    background: 'linear-gradient(45deg, #003c71 30%, #006EBE 90%)',
  },
}));

const ErrorText = styled('p')(({ theme }) => ({
  color: theme.palette.error.main,
}));

const SuccessText = styled('p')(({ theme }) => ({
  color: theme.palette.success.main,
}));

const ContentBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
}));

const ContentImage = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  maxWidth: 250,
  maxHeight: 250,
  backgroundImage: 'url(/path/to/your/image.jpg)', // Replace with your image path
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

const PharmacyRegistration = () => {

  const [formData, setFormData] = useState({
    outletName: '',
    pharmacyLicence: '',
    sellerName: '',
    email: '',
    contactInfo: '',
    location: '',
    storeSpecialty: '',
    pinCode: '',
    outletPictures: '',
    password: '',
    confirmPassword: '',
    longitude: '', // Added longitude
    latitude: '' // Added latitude
  });
  

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/pharmacies/register', formData);
      setSuccess('Pharmacy registered successfully');
      setFormData({
        outletName: '',
        pharmacyLicence: '',
        sellerName: '',
        email: '',
        contactInfo: '',
        location: '',
        pinCode: '',
        outletPictures: '',
        password: '',
        storeSpecialty:'',
        confirmPassword: '',
        longitude: '', // Reset longitude
        latitude: '' // Reset latitude
      });
      navigate('/pharmacyLogin');
    } catch (err) {
      console.error('Error response:', err.response); // Log error response
      setError(err.response?.data?.message || 'Registration failed');
    }
  };
  

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <StyledPaper elevation={3}>
              <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
                Register Pharmacy
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Outlet Name"
                      name="outletName"
                      value={formData.outletName}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Pharmacy Licence"
                      name="pharmacyLicence"
                      value={formData.pharmacyLicence}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Seller Name"
                      name="sellerName"
                      value={formData.sellerName}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Store Specility"
                      name="storeSpecialty"
                      value={formData.storeSpecialty}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="email"
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Contact Info"
                      name="contactInfo"
                      value={formData.contactInfo}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Pin Code"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Outlet Pictures (URL)"
                      name="outletPictures"
                      value={formData.outletPictures}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Confirm Password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
  <TextField
    fullWidth
    type="number"
    label="Longitude"
    name="longitude"
    value={formData.longitude}
    onChange={handleChange}
    required
    variant="outlined"
  />
</Grid>
<Grid item xs={12}>
  <TextField
    fullWidth
    type="number"
    label="Latitude"
    name="latitude"
    value={formData.latitude}
    onChange={handleChange}
    required
    variant="outlined"
  />
</Grid>

                  <Grid item xs={12}>
                    <StyledButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                    >
                      Register
                    </StyledButton>
                  </Grid>
                  {error && (
                    <Grid item xs={12}>
                      <ErrorText>{error}</ErrorText>
                    </Grid>
                  )}
                  {success && (
                    <Grid item xs={12}>
                      <SuccessText>{success}</SuccessText>
                    </Grid>
                  )}
                </Grid>
              </form>
              <NavButton
                  fullWidth
                  variant="text"
                  color="primary"
                  onClick={() => navigate('/pharmacyLogin')}
                >
                  already have an account? Login
                </NavButton>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'top', justifyContent: 'top' }}>
            <ContentBox>
            <img src={Pharma} alt="Doctor" width={'350px'} />
              <Typography variant="h6" color="text.primary">
                Join MediHub as a Pharmacy!<br />
                Sign up to showcase your products, manage prescriptions, and reach customers online. Enhance your pharmacy's visibility and streamline your operations with our platform.
              </Typography>
            </ContentBox>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default PharmacyRegistration;
