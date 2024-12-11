import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Person from '../../assets/Person.jpg';
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

const UserRegister = () => {
  const [formData, setFormData] = useState({
    userName: '',
    address: '',
    pinCode: '',
    useremail: '',
    contactInfo: '',
    password: '',
    setRole: 'customer',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      toast.success('Registeration successfully');
      setTimeout(() => {
        navigate('/UserLogin');
    }, 3000);
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
          <ToastContainer />
      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <StyledPaper elevation={3}>
              <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
                Register
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="User Name"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Pin Code"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
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
                      type="email"
                      label="Email"
                      name="useremail"
                      value={formData.useremail}
                      onChange={handleChange}
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
                      value={formData.password}
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
                    <NavButton
                  fullWidth
                  variant="text"
                  color="primary"
                  onClick={() => navigate('/UserLogin')}
                >
                  already have an account? Login
                </NavButton>
                  </Grid>
                </Grid>
              </form>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ContentBox>
            <img src={Person} alt="Doctor" width={'350px'} />
              <Typography variant="h6" color="text.primary">
                Join MediHub Today!<br />
                Create an account to start enjoying our streamlined pharmacy services. Register now to manage your prescriptions, order medicines, and get connected with local pharmacies.
              </Typography>
            </ContentBox>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default UserRegister;
