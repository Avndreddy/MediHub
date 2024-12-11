import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import { styled } from '@mui/system';

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
      primary: '#212121', // Very dark grey (almost black)
      secondary: '#757575', // Medium grey
    },
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.default,
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const RoleButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
  fontSize: '0.9rem',
  background: theme.palette.primary.main,
  color: theme.palette.background.default,
  '&:hover': {
    background: theme.palette.secondary.main,
  },
}));

const SetRolePage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    localStorage.setItem('userRole', role);
    switch (role) {
      case 'customer':
        navigate('/UserLogin');
        break;
      case 'doctor':
        navigate('/DoctorLogin');
        break;
      case 'pharmacy':
        navigate('/pharmacyLogin');
        break;
      default:
        navigate('/');
    }
  };

  const roles = [
    { name: 'customer', icon: <PersonIcon fontSize="large" />, label: 'Customer' },
    { name: 'doctor', icon: <LocalHospitalIcon fontSize="large" />, label: 'Doctor' },
    { name: 'pharmacy', icon: <LocalPharmacyIcon fontSize="large" />, label: 'Pharmacy' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
            Welcome to MediHub!
          </Typography>
          <Typography variant="h6" component="p" gutterBottom align="center" color="text.secondary">
            To get started, please select your role below. Depending on your choice, you'll be redirected to the appropriate login or registration page.
          </Typography>
          <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
            Select Your Role
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {roles.map((role) => (
              <Grid item xs={12} sm={6} md={4}  key={role.name}>
                <StyledPaper elevation={3}>
                  {role.icon}
                  <Typography variant="h5" component="h2" gutterBottom color="primary">
                    {role.label}
                  </Typography>
                  <RoleButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleRoleSelection(role.name)}
                  >
                    Select {role.label}
                  </RoleButton>
                </StyledPaper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default SetRolePage;
