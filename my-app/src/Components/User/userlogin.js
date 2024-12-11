import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import person from '../../assets/Person.jpg';

import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Box,
  Grid,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { styled } from '@mui/system';

// Theme with custom logo colors
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
  width: '100%',
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

const UserLogin = () => {
  const [formData, setFormData] = useState({
    useremail: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchCart = async () => {
    try {
      const customerID = localStorage.getItem('customerId');
      if (!customerID) {
        throw new Error('Customer ID not found in local storage');
      }

      const response = await axios.get(`http://localhost:5000/api/cart/${customerID}`);
      
      if (!response.data) {
        throw new Error('Cart data is empty or undefined');
      }

      localStorage.setItem('cart', JSON.stringify(response.data));
      console.log('Cart updated successfully after login');
    } catch (error) {
      console.error('Error fetching cart:', error.message || error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      
      if (!response.data || !response.data.token || !response.data.id) {
        throw new Error('Login response data is incomplete');
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('customerId', response.data.id);

      await fetchCart();
      setTimeout(() => {
        navigate("/Pharmacydetails");
    }, 2000);
      

    } catch (err) {
      console.error('Login error:', err.response ? err.response.data.error : err.message);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme} >
      <ToastContainer />

      <Container component="main" maxWidth="md" sx={{ display: 'flex', height: '100vh' }}>
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid item xs={12} md={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center', width: '100%' }}>
            <img src={person} alt="Doctor" width={'350px'} />
              <WelcomeText variant="h6">
                Welcome Back!<br />
                Log in to your MediHub account to access your personalized pharmacy experience. Manage your prescriptions, connect with local pharmacies, and get the medications you need with ease.
              </WelcomeText>
            </Box>
          </Grid>
          <Grid item xs={12} md={7} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <StyledPaper elevation={6} >
              <StyledAvatar>
                <LockOutlinedIcon />
              </StyledAvatar>
              <Typography variant="h5" component="h1" gutterBottom align="center" color="primary">
                User Registration
              </Typography>
              <Form onSubmit={handleSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="useremail"
                  label="Email Address"
                  name="useremail"
                  autoComplete="email"
                  autoFocus
                  value={formData.useremail}
                  onChange={handleChange}
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
                  value={formData.password}
                  onChange={handleChange}
                />
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <SubmitButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Sign In'}
                </SubmitButton>
                <NavButton
                  fullWidth
                  variant="text"
                  color="primary"
                  onClick={() => navigate('/newUser')}
                >
                  Don’t have an account? Register
                </NavButton>
              </Form>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>

    </ThemeProvider>
  );
};

export default UserLogin;

