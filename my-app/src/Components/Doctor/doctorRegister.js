import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Doc from '../../assets/Doctor.jpg';

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

const NavButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const DoctorRegistration = () => {
  const [doctorName, setDoctorName] = useState('');
  const [doctorsContactInfo, setDoctorsContactInfo] = useState('');
  const [doctorsEmail, setDoctorsEmail] = useState('');
  const [password, setPassword] = useState('');
  const [doctorLicense, setDoctorLicense] = useState('');
  const [affiliatedHospital, setAffiliatedHospital] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/doctors/register', {
        doctorName,
        doctorsContactInfo,
        doctorsEmail,
        password,
        doctorLicense,
        affiliatedHospital
      });
      navigate('/DoctorLogin'); // Redirect to login page after successful registration
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <StyledPaper elevation={3}>
              <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
                Doctor Registration
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Doctor Name"
                      name="doctorName"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Contact Info"
                      name="doctorsContactInfo"
                      value={doctorsContactInfo}
                      onChange={(e) => setDoctorsContactInfo(e.target.value)}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="email"
                      label="Email"
                      name="doctorsEmail"
                      value={doctorsEmail}
                      onChange={(e) => setDoctorsEmail(e.target.value)}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Doctor License"
                      name="doctorLicense"
                      value={doctorLicense}
                      onChange={(e) => setDoctorLicense(e.target.value)}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Affiliated Hospital"
                      name="affiliatedHospital"
                      value={affiliatedHospital}
                      onChange={(e) => setAffiliatedHospital(e.target.value)}
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
                    <NavButton
                  fullWidth
                  variant="text"
                  color="primary"
                  onClick={() => navigate('/DoctorLogin')}
                >
                  already have an account? Login
                </NavButton>
                  </Grid>
                  {error && (
                    <Grid item xs={12}>
                      <ErrorText>{error}</ErrorText>
                    </Grid>
                  )}
                </Grid>
              </form>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ContentBox>
            <img src={Doc} alt="Doctor" width={'350px'} />
              <Typography variant="h6" color="text.primary">
                Join MediHub as a Doctor!<br />
                Sign up to be part of MediHub’s network of healthcare professionals. Manage patient prescriptions, conduct online consultations, and enhance your practice with our platform.
              </Typography>
            </ContentBox>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default DoctorRegistration;
