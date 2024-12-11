import React from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ReactComponent as Logo1 } from '../Logo_1.svg';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Link,
  Button
} from '@mui/material';
import { styled } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';

// Set a single background color and add drop shadow for the AppBar
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: '#FFFFFF', // White background
  maxHeight: '80px', // Adjusted for better alignment
  height: '80px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add a subtle drop shadow
}));

const NavLink = styled(Link)(({ theme }) => ({
  color: '#006EBE', // Blue color
  textDecoration: 'none',
  marginLeft: theme.spacing(2),
  fontWeight: '500',
  padding: theme.spacing(1, 2), // Add padding to make it look like a button
  borderRadius: '4px', // Rounded corners
  '&:hover': {
    backgroundColor: '#e3f2fd', // Very light blue
    color: '#004ba0', // Darker blue for better contrast on hover
    textDecoration: 'none',
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const isLoggedIn = !token;
  console.log(isLoggedIn,userRole,token)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getRegisterLink = () => {
    switch (userRole) {
      case 'pharmacy': return "/newPharmacy";
      case 'doctor': return "/newDoctor";
      default: return "/newUser";
    }
  };

  const getLoginLink = () => {
    switch (userRole) {
      case 'pharmacy': return "/pharmacyLogin";
      case 'doctor': return "/DoctorLogin";
      default: return "/UserLogin";
    }
  };

  const handleChangeRole = () => {
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <StyledAppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: '#006EBE', // Blue color
              }}
            >
              <Logo1 style={{ height: '60px' }} />
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <MenuIcon sx={{ color: '#006EBE' }} /> {/* Blue color for the icon */}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {location.pathname!==handleChangeRole &&!isLoggedIn && <MenuItem onClick={() => { handleChangeRole(); handleClose(); }}>Change Role</MenuItem>}
              {isLoggedIn && userRole && <MenuItem onClick={handleClose} component={RouterLink} to="/Pharmacydetails">Home</MenuItem>}
              {!isLoggedIn && userRole && <MenuItem onClick={handleClose} component={RouterLink} to={getLoginLink()}>Login</MenuItem>}
              {!isLoggedIn && userRole && <MenuItem onClick={handleClose} component={RouterLink} to={getRegisterLink()}>Register</MenuItem>}
              {isLoggedIn && userRole === 'customer' && <MenuItem onClick={handleClose} component={RouterLink} to="/cart">Cart</MenuItem>}
              {isLoggedIn && userRole === 'customer' && <MenuItem onClick={handleClose} component={RouterLink} to="/orders">Order Status</MenuItem>}
              {isLoggedIn && userRole && <NavLink onClick={() => { logout(); handleClose(); }}>Logout</NavLink>}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', alignItems: 'center' }}>
            {location.pathname!==handleChangeRole && isLoggedIn && <NavLink onClick={handleChangeRole}>Change Role</NavLink>}
            {!isLoggedIn && userRole === 'customer' && <NavLink component={RouterLink} to="/Pharmacydetails">Home</NavLink>}
            {location.pathname!== getLoginLink()&& isLoggedIn && userRole && <NavLink component={RouterLink} to={getLoginLink()}>Login</NavLink>}
            {location.pathname!== getRegisterLink()&& isLoggedIn && userRole && <NavLink component={RouterLink} to={getRegisterLink()}>Register</NavLink>}
            {!isLoggedIn && userRole === 'customer' && <NavLink component={RouterLink} to="/cart">Cart</NavLink>}
            {!isLoggedIn && userRole === 'customer' && <NavLink component={RouterLink} to="/patientdetails">Patient Details</NavLink>}
            {!isLoggedIn && userRole === 'customer' && <NavLink component={RouterLink} to="/orders">Order Status</NavLink>}

          </Box>

          {!isLoggedIn && userRole && (
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
              <Button onClick={logout} variant="contained" color="error" sx={{ marginLeft: 2 }}>
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar;
