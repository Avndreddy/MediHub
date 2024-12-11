import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Box,
  Paper,
  CircularProgress,
  ThemeProvider,
  createTheme,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { styled } from '@mui/system';

// Define theme with primary and secondary colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#006EBE', // Blue
      light: '#d3e7fb', // Lighter blue
    },
    secondary: {
      main: '#EB2026', // Red
      light: '#fbd8d9', // Lighter red
      dark: '#C20000', // Darker red
    },
    background: {
      default: '#f5f5f5', // Light grey
    },
  },
});

// Styled Paper component
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

// Styled TotalCost component
const TotalCost = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontWeight: 'bold',
  color: theme.palette.primary.main,
}));

// Styled IconButtons with more subtle hover effects
const StyledIconButton = styled(IconButton)(({ theme, colorType }) => ({
  color: colorType === 'increase' ? theme.palette.primary.main : 
         colorType === 'decrease' ? theme.palette.secondary.main : 
         theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: colorType === 'increase' ? theme.palette.primary.light :
                      colorType === 'decrease' ? theme.palette.secondary.light :
                      theme.palette.secondary.light,
  },
}));

const getCustomerId = () => {
  const token = JSON.parse(localStorage.getItem('token'));
  return token ? localStorage.getItem('customerId') : null;
};

const CustomerCart = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : {
      customerID: getCustomerId() || '',
      products: [],
      totalCost: 0,
    };
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartAndProducts = async () => {
      try {
        const customerID = localStorage.getItem('customerId');
        if (!customerID) {
          throw new Error('Customer ID not found');
        }

        // Fetch cart data
        const cartResponse = await axios.get(`http://localhost:5000/api/cart/${customerID}`);
        const fetchedCart = cartResponse.data;

        // Fetch product details
        const productResponse = await axios.get('http://localhost:5000/api/products');
        setProducts(productResponse.data);

        const newCart = {
          customerID,
          products: fetchedCart.products || [],
          totalCost: fetchedCart.totalCost || 0
        };
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to fetch cart. Please try again.');
        setLoading(false); // Set loading to false even if there's an error
      }
    };
    fetchCartAndProducts();
  }, []);

  const saveCartToLocalStorage = (newCart) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const postCart = async (cartData) => {
    try {
      const customerID = localStorage.getItem('customerId');
      if (!customerID) {
        throw new Error('Customer ID not found');
      }

      await axios.post(`http://localhost:5000/api/cart/${customerID}`, cartData);
      toast.success('Cart updated successfully');
    } catch (error) {
      console.error('Error updating cart in backend:', error);
      toast.error('Failed to update cart. Please try again.');
    }
  };

  const findProductPrice = (productID) => {
    const product = products.find(p => p._id === productID);
    return product ? product.price : 0;
  };

  const findProductName = (productID) => {
    const product = products.find(p => p._id === productID);
    console.log(product);
    return product ? product.productName : '';
  };

  const findProductImg = (productID) => {
    const product = products.find(p => p._id === productID);
    console.log(product);
    return product ? product.images[0] : '';
  };

  const updateCart = async (updateFunction) => {
    setCart((prevCart) => {
      try {
        const newCart = updateFunction(prevCart);
        saveCartToLocalStorage(newCart);
        postCart(newCart); // Post cart data to the backend
        return newCart;
      } catch (error) {
        console.error('Error updating cart state:', error);
        toast.error('Failed to update cart. Please try again.');
        return prevCart;
      }
    });
  };

  const increaseQuantity = (productID) => {
    updateCart(prevCart => {
      const price = findProductPrice(productID);
      const newProducts = prevCart.products.map(p =>
        p.productID === productID ? { ...p, quantity: p.quantity + 1 } : p
      );
      const newTotalCost = prevCart.totalCost + parseFloat(price);
      return { ...prevCart, products: newProducts, totalCost: newTotalCost };
    });
  };

  const decreaseQuantity = (productID) => {
    updateCart(prevCart => {
      const price = findProductPrice(productID);
      const existingProduct = prevCart.products.find(p => p.productID === productID);
      if (!existingProduct) return prevCart;

      if (existingProduct.quantity === 1) {
        const newProducts = prevCart.products.filter(p => p.productID !== productID);
        const newTotalCost = Math.max(prevCart.totalCost - parseFloat(price), 0);
        return { ...prevCart, products: newProducts, totalCost: newTotalCost };
      }

      const newProducts = prevCart.products.map(p =>
        p.productID === productID ? { ...p, quantity: p.quantity - 1 } : p
      );
      const newTotalCost = Math.max(prevCart.totalCost - parseFloat(price), 0);
      return { ...prevCart, products: newProducts, totalCost: newTotalCost };
    });
  };

  const removeFromCart = (productID) => {
    updateCart(prevCart => {
      const product = prevCart.products.find(p => p.productID === productID);
      const price = product ? findProductPrice(productID) : 0;
      const newProducts = prevCart.products.filter(p => p.productID !== productID);
      const newTotalCost = Math.max(prevCart.totalCost - (price * (product ? product.quantity : 0)), 0);

      if (newProducts.length === 0) {
        toast.info("Add products to the cart");
        return { ...prevCart, products: [], totalCost: 0 };
      }

      return { ...prevCart, products: newProducts, totalCost: newTotalCost };
    });
  };

  const handleSubmitCart = () => {
    navigate("/patientdetails");
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <ToastContainer />
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" sx={{ my: 4 }}>
          <ShoppingCartIcon sx={{ mr: 1 }} />
          Your Cart
        </Typography>
        <StyledPaper elevation={3}>
          {cart.products.length === 0 ? (
            <Typography variant="subtitle1" align="center">
              Your cart is empty. Add products to the cart.
            </Typography>
          ) : (
            <List>
              {cart.products.map((item) => {
                const productPrice = findProductPrice(item.productID);
                const productName= findProductName(item.productID);
                const productImg= findProductImg(item.productID);

                return (
                  <React.Fragment key={item.productID}>
                    <ListItem sx={{display:"flex",justifyContent:'center',alignContent:"center",alignItems:'center'}}> 
                     <img alt='noimg' src={productImg} width={'75px'} style={{padding:"10px"}}/>
                      <ListItemText
                        primary={<h3>{productName}</h3>}
                        secondary={`Price per unit: ₹${productPrice.toFixed(2)}`}
                      />
                      <ListItemSecondaryAction>
                        <StyledIconButton edge="end" aria-label="decrease" colorType="decrease" onClick={() => decreaseQuantity(item.productID)}>
                          <RemoveIcon />
                        </StyledIconButton>
                        <Typography component="span" sx={{ margin: 3,padding:'unset' }}>
                          {item.quantity}
                        </Typography>
                        <StyledIconButton edge="end" aria-label="increase" colorType="increase"  onClick={() => increaseQuantity(item.productID)}>
                          <AddIcon />
                        </StyledIconButton>
                        <StyledIconButton edge="end" aria-label="delete" colorType="delete" onClick={() => removeFromCart(item.productID)} sx={{ ml: 3 }}>
                          <DeleteIcon />
                        </StyledIconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {cart.products.length > 1 && <Divider />}
                    
                  </React.Fragment>
                );
              })}
            </List>
          )}
          
          <TotalCost variant="h6" align="right">
            Total Cost: ₹{cart.totalCost.toFixed(2)}
          </TotalCost>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitCart}
              disabled={cart.products.length === 0}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </StyledPaper>
      </Container>
    </ThemeProvider>
  );
};

export default CustomerCart;