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
  Avatar,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Grid,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { styled } from '@mui/system';

// Updated theme with colors matching the user login page
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
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(4),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
}));

const Form = styled('form')(({ theme }) => ({
  width: '100%', // Fix IE 11 issue.
  marginTop: theme.spacing(1),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  background: 'linear-gradient(45deg, #006EBE 30%, #003c71 90%)',
  '&:hover': {
    background: 'linear-gradient(45deg, #003c71 30%, #006EBE 90%)',
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  marginTop: theme.spacing(1),
}));



const WelcomeText = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
}));

const PharmacyLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/pharmacies/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token); // Store the token in localStorage
      localStorage.setItem('PharmacyId', response.data.id);
      navigate("/pharmacyDashboard");
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md" sx={{ display: 'flex', height: '100vh' }}>
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid item xs={12} md={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center', width: '100%' }}>
            <img src={Pharma} alt="Doctor" width={'350px'} />
              <WelcomeText variant="h6">
                Welcome Back, Pharmacy!<br />
                Log in to your MediHub account to manage your store, update product listings, and handle prescriptions. Connect directly with customers and streamline your pharmacy operations.
              </WelcomeText>
            </Box>
          </Grid>
          <Grid item xs={12} md={7} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <StyledPaper elevation={6}>
              <StyledAvatar>
                <LockOutlinedIcon />
              </StyledAvatar>
              <Typography variant="h5" component="h1" gutterBottom align="center" color="primary">
              Pharmacy Login
              </Typography>
              <Form onSubmit={handleSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <SubmitButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Login'}
                </SubmitButton>
              </Form>
              <NavButton
                  fullWidth
                  variant="text"
                  color="primary"
                  onClick={() => navigate('/newPharmacy')}
                >
                  Don’t have an account? Register
                </NavButton>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default PharmacyLogin;
