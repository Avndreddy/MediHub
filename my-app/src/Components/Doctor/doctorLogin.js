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
  Avatar,
  ThemeProvider,
  createTheme,
  Grid,
  CircularProgress,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { styled } from '@mui/system';

// Theme with custom colors matching previous styles
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
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
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

const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  marginTop: theme.spacing(1),
}));

const NavButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const WelcomeText = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.text.primary,
}));

const DoctorLogin = () => {
  const [doctorsEmail, setDoctorsEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/doctors/login', {
        doctorsEmail,
        password,
      });
      localStorage.setItem('DoctorId', response.data.id);
      localStorage.setItem('token', response.data.token); // Store JWT token
      navigate('/DoctorDashboard'); // Redirect to a protected route after successful login
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md" sx={{ display: 'flex', height: '75vh' }}>
        <Grid container spacing={10} sx={{ flexGrow: 1 }}>
          <Grid item xs={12} md={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center', width: '100%' }}>
            <img src={Doc} alt="Doctor" width={'350px'} />
              <WelcomeText variant="h6">
                Welcome Back, Doctor!<br />
                Access your MediHub account to manage patient prescriptions, provide online consultations, and update your profile. Sign in to continue delivering excellent care.
              </WelcomeText>
            </Box>
          </Grid>
          <Grid item xs={12} md={7} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <StyledPaper elevation={6} sx={{ textAlign: 'center' }}>
              <StyledAvatar>
                <LockOutlinedIcon />
              </StyledAvatar>
              <Typography variant="h5" component="h1" gutterBottom align="center" color="primary">
              Doctor Login
              </Typography>
              <Form onSubmit={handleSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="doctorsEmail"
                  label="Email Address"
                  name="doctorsEmail"
                  autoComplete="email"
                  autoFocus
                  value={doctorsEmail}
                  onChange={(e) => setDoctorsEmail(e.target.value)}
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
              
                {error && <ErrorText>{error}</ErrorText>}
                <SubmitButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Login'}
                </SubmitButton>
                <NavButton
                  fullWidth
                  variant="text"
                  color="primary"
                  onClick={() => navigate('/NewDoctor')}
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

export default DoctorLogin;

