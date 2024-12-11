import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Grid,
  Box,
  ThemeProvider,
  createTheme,
  Chip,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
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
      default: '#f5f5f5', // Light grey
    },
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.15s ease-in-out',
  maxWidth: '300px', // Reduced card width
  margin: 'auto', // Center the card in the grid
  '&:hover': { transform: 'scale3d(1.05, 1.05, 1)' },
}));

const StyledCardMedia = styled(CardMedia)({
  paddingTop: '56.25%', // 16:9 aspect ratio
});

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
  padding: '8px', // Reduced padding
});

const StyledButton = styled(Button)(({ theme }) => ({
  fontSize: '0.75rem', // Smaller font size
  padding: '4px 8px', // Reduced padding
  margin: '2px', // Reduced margin
  '&.MuiButton-contained': {
    backgroundColor: '#006EBE', // Blue
    color: '#FFFFFF', // White
    '&:hover': {
      backgroundColor: '#0056b3', // Darker blue on hover
    },
  },
  '&.MuiButton-text': {
    color: '#006EBE', // Blue text
    '&:hover': {
      backgroundColor: '#e0f0ff', // Very light blue on hover
    },
  },
}));

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        const selectedPharmacyId = localStorage.getItem('SelectedPharmacy');
        const filteredByPharmacy = response.data.filter(product => product.pharmacy_id === selectedPharmacyId);
        setProducts(filteredByPharmacy);
        setFilteredProducts(filteredByPharmacy);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products. Please try again.');
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const lowercasedKeyword = filterKeyword.toLowerCase();
    const newFilteredProducts = products.filter(product => {
      const matchesKeyword = product.productName.toLowerCase().includes(lowercasedKeyword) ||
        product.category.toLowerCase().includes(lowercasedKeyword) ||
        product.keywords.some(keyword =>
          keyword.toLowerCase().includes(lowercasedKeyword)
        );
      
      // Check if product matches any of the tags
      const matchesTags = tags.length === 0 || tags.some(tag =>
        product.productName.toLowerCase().includes(tag.toLowerCase()) ||
        product.category.toLowerCase().includes(tag.toLowerCase()) ||
        product.keywords.some(keyword =>
          keyword.toLowerCase().includes(tag.toLowerCase())
        )
      );

      return matchesKeyword && matchesTags;
    });
    setFilteredProducts(newFilteredProducts);
  }, [filterKeyword, products, tags]);

  const handleFilterChange = (e) => {
    setFilterKeyword(e.target.value);
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || {
      customerID: localStorage.getItem('customerId') || '',
      products: [],
      totalCost: 0,
    };

    const existingProductIndex = cart.products.findIndex(p => p.productID === product._id);

    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += 1;
    } else {
      cart.products.push({ productID: product._id, quantity: 1 });
    }

    cart.totalCost += product.price;

    localStorage.setItem('cart', JSON.stringify(cart));
    try {
      const customerID = localStorage.getItem('customerId');
      if (!customerID) {
        throw new Error('Customer ID not found');
      }

      (async () => {
        try {
          const response = await axios.post(`http://localhost:5000/api/cart/${customerID}`, cart);
          console.log('Cart updated successfully:', response.data);
        } catch (error) {
          console.error('Error updating cart:', error);
        }
      })();
      
      toast.success('Cart updated successfully');
    } catch (error) {
      console.error('Error updating cart in backend:', error);
      toast.error('Failed to update cart. Please try again.');
    }
    console.log('Product added to cart');
  };

  const handleProductClick = (productId) => {
    navigate(`/desc/${productId}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <ToastContainer />
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" sx={{ my: 4 }}>
          Product List
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 4 }}>
          <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField
            fullWidth
            label="Search Products by Name, Category, or Keywords"
            variant="standard"
            size="small"
            value={filterKeyword}
            onChange={handleFilterChange}
          />
         
          <TextField
            label="Add Filter Tag"
            variant="standard"
            size="small"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            sx={{ ml: 2 }}
          />
           <StyledButton variant="contained" color="secondary" onClick={handleAddTag} sx={{ ml: 2 }}>
            Add Tag
          </StyledButton>
        </Box>
        <Box sx={{ mb: 4 }}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleRemoveTag(tag)}
              color="primary"
              sx={{ mr: 1 }}
            />
          ))}
        </Box>
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={3}>
              <StyledCard>
                <StyledCardMedia
                  image={product.images[0]}
                  title={product.productName}
                />
                <StyledCardContent>
                  <Typography gutterBottom variant="h6" component="h2">
                    {product.productName}
                  </Typography>
                  <Typography variant="body2">₹{product.price}</Typography>
                  <Typography variant="body2">Category: {product.category}</Typography>
                </StyledCardContent>
                <CardActions>
                  <StyledButton size="small" color="primary" variant="contained" onClick={() => addToCart(product)}>
                    <ShoppingCartIcon fontSize="small" /> Add to Cart
                  </StyledButton>
                  <StyledButton size="small" color="primary" variant="text" onClick={() => handleProductClick(product._id)}>
                    View Product
                  </StyledButton>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default ProductList;
